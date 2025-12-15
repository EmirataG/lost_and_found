"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

type Message = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

type Participant = {
  user_id: string;
  user?: { id: string; name?: string; avatar_url?: string };
};

const ConversationView = ({ conversationId }: { conversationId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const loadMessages = async () => {
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      const json = await res.json();
      setMessages(json || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadConversation = async () => {
    try {
      const res = await fetch(`/api/conversations`);
      const json = await res.json();
      const conv = (json || []).find((c: any) => c.id === conversationId);
      if (conv) setParticipants(conv.participants || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    loadUser();
    loadMessages();
    loadConversation();
    const interval = setInterval(loadMessages, 4000);
    return () => clearInterval(interval);
  }, [conversationId]);

  const send = async () => {
    if (!text.trim() && files.length === 0) return;
    try {
      // upload files first (if any)
      const attachments: Array<{
        url: string;
        filename: string;
        content_type?: string;
      }> = [];
      for (const file of files) {
        const fileName = `${Date.now()}_${file.name.replaceAll(" ", "_")}`;
        const path = `attachments/${conversationId}/${encodeURIComponent(fileName)}`;
        // try the 'attachments' bucket first
        let uploadError = null;
        try {
          const { error } = await supabase.storage
            .from("attachments")
            .upload(path, file);
          if (error) throw error;
          const { data } = supabase.storage
            .from("attachments")
            .getPublicUrl(path);
          attachments.push({
            url: data.publicUrl,
            filename: file.name,
            content_type: file.type,
          });
          continue;
        } catch (err: any) {
          uploadError = err;
          console.warn(
            "attachments bucket upload failed:",
            err?.message || err,
          );
        }

        // fallback: try the 'photos' bucket if attachments bucket is missing
        if (
          String(uploadError?.message || "")
            .toLowerCase()
            .includes("bucket not found") ||
          String(uploadError || "")
            .toLowerCase()
            .includes("bucket not found")
        ) {
          try {
            const altPath = `${conversationId}/${encodeURIComponent(fileName)}`;
            const { error } = await supabase.storage
              .from("photos")
              .upload(altPath, file);
            if (error) throw error;
            const { data } = supabase.storage
              .from("photos")
              .getPublicUrl(altPath);
            attachments.push({
              url: data.publicUrl,
              filename: file.name,
              content_type: file.type,
            });
            continue;
          } catch (err2: any) {
            console.warn(
              "photos bucket fallback failed:",
              err2?.message || err2,
            );
            alert(
              "File upload failed: no suitable storage bucket found. Please create a public 'attachments' bucket in Supabase, or contact the developer.",
            );
            continue;
          }
        }

        // other upload error: log and continue
        console.error(uploadError);
        alert("File upload failed. See console for details.");
      }

      await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text, attachments }),
      });
      setText("");
      setFiles([]);
      loadMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const senderName = (senderId: string) => {
    const p = participants.find((x) => x.user_id === senderId);
    return p?.user?.name || senderId;
  };

  return (
    <div className="flex h-full flex-col p-6">
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        {messages.map((m) => {
          const p = participants.find((x) => x.user_id === m.sender_id);
          const avatar =
            p?.user?.avatar_url || `https://www.gravatar.com/avatar/?d=mp&s=64`;
          const isOwnMessage = currentUserId && m.sender_id === currentUserId;

          if (isOwnMessage) {
            // Own message - right-aligned, blue background
            return (
              <div
                key={m.id}
                className="flex justify-end"
              >
                <div className="max-w-md">
                  <div className="rounded-2xl rounded-tr-sm bg-yaleBlue p-4 text-white shadow-lg">
                    <div className="break-words">{m.body}</div>
                    {m.attachments && m.attachments.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {m.attachments.map((a: any) => (
                          <a
                            key={a.id}
                            href={a.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 p-2 text-sm font-medium text-white transition hover:bg-white/20"
                          >
                            📎 {a.filename || a.url}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-1 text-right text-xs font-medium text-gray-500">
                    {mounted && new Date(m.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          } else {
            // Received message - left-aligned, gray background
            return (
              <div
                key={m.id}
                className="flex justify-start"
              >
                <div className="flex max-w-md items-start gap-3">
                  <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatar}
                      alt={senderName(m.sender_id)}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 text-xs font-semibold text-gray-600">
                      {senderName(m.sender_id)}
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-gray-100 p-4 shadow">
                      <div className="break-words">{m.body}</div>
                      {m.attachments && m.attachments.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {m.attachments.map((a: any) => (
                            <a
                              key={a.id}
                              href={a.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                              📎 {a.filename || a.url}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-1 text-xs font-medium text-gray-500">
                      {mounted && new Date(m.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>

      <div className="mt-4 flex flex-shrink-0 items-center gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          className="flex-1 rounded-lg border border-gray-300 p-3 placeholder-gray-400 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Write a message..."
        />
        {/* <label className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer inline-flex items-center gap-2 font-medium text-gray-700">
                📎 {files.length > 0 ? `${files.length} file${files.length > 1 ? 's' : ''}` : 'Attach'}
                <input type="file" multiple onChange={(e) => { if (e.target.files) setFiles(Array.from(e.target.files)); }} className="hidden" />
              </label> */}
        <button
          onClick={send}
          className="rounded-lg bg-yaleBlue px-6 py-3 font-semibold text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ConversationView;
