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

type Participant = { user_id: string; user?: { id: string; name?: string; avatar_url?: string } };

const ConversationView = ({ conversationId }: { conversationId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [files, setFiles] = useState<File[]>([]);
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
    loadMessages();
    loadConversation();
    const interval = setInterval(loadMessages, 4000);
    return () => clearInterval(interval);
  }, [conversationId]);

  const send = async () => {
    if (!text.trim() && files.length === 0) return;
    try {
      // upload files first (if any)
      const attachments: Array<{ url: string; filename: string; content_type?: string }> = [];
      for (const file of files) {
        const fileName = `${Date.now()}_${file.name.replaceAll(" ", "_")}`;
        const path = `attachments/${conversationId}/${encodeURIComponent(fileName)}`;
        // try the 'attachments' bucket first
        let uploadError = null;
        try {
          const { error } = await supabase.storage.from("attachments").upload(path, file);
          if (error) throw error;
          const { data } = supabase.storage.from("attachments").getPublicUrl(path);
          attachments.push({ url: data.publicUrl, filename: file.name, content_type: file.type });
          continue;
        } catch (err: any) {
          uploadError = err;
          console.warn("attachments bucket upload failed:", err?.message || err);
        }

        // fallback: try the 'photos' bucket if attachments bucket is missing
        if (String(uploadError?.message || "").toLowerCase().includes("bucket not found") || String(uploadError || "").toLowerCase().includes("bucket not found")) {
          try {
            const altPath = `${conversationId}/${encodeURIComponent(fileName)}`;
            const { error } = await supabase.storage.from("photos").upload(altPath, file);
            if (error) throw error;
            const { data } = supabase.storage.from("photos").getPublicUrl(altPath);
            attachments.push({ url: data.publicUrl, filename: file.name, content_type: file.type });
            continue;
          } catch (err2: any) {
            console.warn("photos bucket fallback failed:", err2?.message || err2);
            alert("File upload failed: no suitable storage bucket found. Please create a public 'attachments' bucket in Supabase, or contact the developer.");
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
    <div className="max-w-3xl mx-auto p-4">
      <button onClick={() => router.back()} className="mb-3 text-sm text-gray-600">Back</button>
      <div className="border rounded p-3 h-[60vh] overflow-y-auto flex flex-col gap-3">
        {messages.map((m) => {
          const p = participants.find((x) => x.user_id === m.sender_id);
          const avatar = p?.user?.avatar_url || `https://www.gravatar.com/avatar/?d=mp&s=64`;
          return (
            <div key={m.id} className="p-2 bg-gray-100 rounded">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={avatar} alt={senderName(m.sender_id)} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 font-semibold">{senderName(m.sender_id)}</div>
                        <div className="mt-1">{m.body}</div>
                        {m.attachments && m.attachments.length > 0 ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {m.attachments.map((a: any) => (
                              <a key={a.id} href={a.url} target="_blank" rel="noreferrer" className="inline-block border rounded p-1 text-sm">
                                {a.filename || a.url}
                              </a>
                            ))}
                          </div>
                        ) : null}
                  <div className="text-xs text-gray-400 mt-1">{new Date(m.created_at).toLocaleString()}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

            <div className="mt-3 flex gap-2 items-center">
              <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Write a message..." />
              <input type="file" multiple onChange={(e) => { if (e.target.files) setFiles(Array.from(e.target.files)); }} />
              <button onClick={send} className="px-3 py-2 bg-yaleBlue text-white rounded">Send</button>
            </div>
    </div>
  );
};

export default ConversationView;
