"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

type Conversation = {
  id: string;
  title?: string;
  last_message_at?: string;
};

type Request = {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: string;
  message?: string;
  requester?: { id: string; name?: string; avatar_url?: string };
};

const MessagesPanel = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [email, setEmail] = useState("");

  const load = async () => {
    try {
      const [{ data: userData }] = await Promise.all([supabase.auth.getUser()]);
      const curUserId = userData?.user?.id;

      const convRes = await fetch("/api/conversations");
      const convJson = await convRes.json();
      setConversations(convJson || []);

      const reqRes = await fetch("/api/connections/requests");
      const reqJson = await reqRes.json();
      setRequests(reqJson || []);

      setTimeout(() => {
        // store current user id for rendering
        setCurrentUserId(curUserId || null);
      }, 0);
    } catch (err) {
      console.error(err);
    }
  };

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const sendRequest = async () => {
    try {
      const res = await fetch("/api/connections/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiver_email: email }),
      });
      const json = await res.json();
      alert(json.message || "Request sent");
      setEmail("");
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const respond = async (id: string, action: "accept" | "reject") => {
    try {
      const res = await fetch("/api/connections/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: id, action }),
      });
      const json = await res.json();
      alert(json.message || "Done");
      load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Messages</h2>

      <section className="mb-6">
        <h3 className="font-semibold mb-2">Start a connection</h3>
        <div className="flex gap-2">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="User email" className="p-2 border rounded flex-1" />
          <button onClick={sendRequest} className="px-3 py-2 bg-yaleBlue text-white rounded">Send request</button>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="font-semibold mb-2">Pending requests</h3>
        {requests.length === 0 && <div className="text-sm text-gray-600">No pending requests</div>}
        <ul>
          {requests.map((r) => (
            <li key={r.id} className="flex gap-2 items-center my-2">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.requester?.avatar_url || `https://www.gravatar.com/avatar/?d=mp&s=48`} alt={r.requester?.name || r.requester_id} className="w-full h-full object-cover" />
                </div>
                <div className="">From: {r.requester?.name || r.requester_id}</div>
              </div>
              <button onClick={() => respond(r.id, "accept")} className="px-2 py-1 bg-green-500 text-white rounded">Accept</button>
              <button onClick={() => respond(r.id, "reject")} className="px-2 py-1 bg-red-500 text-white rounded">Reject</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-semibold mb-2">Conversations</h3>
        {conversations.length === 0 && <div className="text-sm text-gray-600">No conversations yet</div>}
        <ul>
          {conversations.map((c: any) => {
            let display = c.title || "Direct message";
            let avatarUrl: string | null = null;
            if (c.participants && currentUserId) {
              // for direct convs, show other participant's name
              if (c.participants.length === 2) {
                const otherPart = c.participants.find((p: any) => p.user && p.user.id && p.user.id !== currentUserId);
                if (otherPart && otherPart.user) {
                  display = otherPart.user.name || display;
                  avatarUrl = otherPart.user.avatar_url || null;
                }
              }
            }

            const avatar = avatarUrl || `https://www.gravatar.com/avatar/?d=mp&s=64`;

            return (
              <li key={c.id} className="my-2">
                <Link href={`/messages/${c.id}`} className="block p-3 border rounded hover:bg-gray-50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatar} alt={display} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{display}</div>
                    <div className="text-sm text-gray-500">{c.last_message_at ? new Date(c.last_message_at).toLocaleString() : "No messages"}</div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default MessagesPanel;
