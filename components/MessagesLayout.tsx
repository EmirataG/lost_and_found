"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ConversationView from "./ConversationView";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

type Conversation = {
  id: string;
  title?: string;
  last_message_at?: string;
  participants?: Array<{ user_id: string; user?: { id: string; name?: string; avatar_url?: string } }>;
};

export default function MessagesLayout() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [requests, setRequests] = useState<Array<{ id: string; requester_id: string; receiver_id: string; status: string; message?: string; requester?: { id: string; name?: string; avatar_url?: string } }>>([]);
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [connections, setConnections] = useState<Array<{ id: string; user_id: string; friend_id: string; other?: { id: string; name?: string; avatar_url?: string } }>>([]);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data: userData } = await supabase.auth.getUser();
        setCurrentUserId(userData?.user?.id || null);
      } catch (e) {
        // ignore
      }

      try {
        const [convRes, reqRes, connRes] = await Promise.all([fetch("/api/conversations"), fetch("/api/connections/requests"), fetch("/api/connections/list")]);
        const convJson = await convRes.json();
        const reqJson = await reqRes.json();
        const connJson = await connRes.json();
        setConversations(convJson || []);
        setRequests(reqJson || []);
        setConnections(connJson || []);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left list */}
        <div className="col-span-1 md:col-span-1">
          <div className="bg-white rounded shadow p-2 h-[70vh] overflow-y-auto">
            {/* Requests area */}
            <div className="px-2 py-2 border-b">
              <h3 className="text-lg font-semibold">Requests</h3>
              <div className="mt-2">
                <div className="flex gap-2">
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="User email" className="p-2 border rounded flex-1" />
                  <button onClick={async () => {
                    try {
                      const res = await fetch('/api/connections/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ receiver_email: email }) });
                      const json = await res.json();
                      alert(json.message || 'Request sent');
                      setEmail('');
                      // reload requests
                      const r = await fetch('/api/connections/requests');
                      const rj = await r.json();
                      setRequests(rj || []);
                    } catch (e) {
                      console.error(e);
                      alert('Error sending request');
                    }
                  }} className="px-3 py-2 bg-yaleBlue text-white rounded">Send</button>
                </div>

                <div className="mt-3">
                  <h4 className="font-semibold">Pending</h4>
                  {requests.length === 0 ? (
                    <div className="text-sm text-gray-500">No pending requests</div>
                  ) : (
                    <ul className="mt-2">
                      {requests.map((r) => (
                        <li key={r.id} className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={r.requester?.avatar_url || `https://www.gravatar.com/avatar/?d=mp&s=48`} alt={r.requester?.name || r.requester_id} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-sm">From: {r.requester?.name || r.requester_id}</div>
                          </div>
                          <button onClick={async () => {
                            try {
                              const res = await fetch('/api/connections/respond', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ request_id: r.id, action: 'accept' }) });
                              const json = await res.json();
                              alert(json.message || 'Accepted');
                              const r2 = await fetch('/api/connections/requests');
                              setRequests((await r2.json()) || []);
                              const convRes = await fetch('/api/conversations');
                              setConversations((await convRes.json()) || []);
                            } catch (e) {
                              console.error(e);
                              alert('Error responding');
                            }
                          }} className="px-2 py-1 bg-green-500 text-white rounded">Accept</button>
                          <button onClick={async () => {
                            try {
                              const res = await fetch('/api/connections/respond', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ request_id: r.id, action: 'reject' }) });
                              const json = await res.json();
                              alert(json.message || 'Rejected');
                              const r2 = await fetch('/api/connections/requests');
                              setRequests((await r2.json()) || []);
                            } catch (e) {
                              console.error(e);
                              alert('Error responding');
                            }
                          }} className="px-2 py-1 bg-red-500 text-white rounded">Reject</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-2 py-1">
              <h3 className="text-lg font-semibold">Conversations</h3>
              <div className="relative">
                <button onClick={() => setShowNew((s) => !s)} className="px-2 py-1 bg-yaleBlue text-white rounded">+</button>
                {showNew ? (
                  <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow z-20">
                    <div className="p-2 text-sm font-semibold">Start conversation</div>
                    <div className="max-h-48 overflow-y-auto">
                      {connections.length === 0 ? (
                        <div className="p-2 text-sm text-gray-500">No connections</div>
                      ) : (
                        connections.map((c) => {
                          const other = c.other || { id: c.user_id === currentUserId ? c.friend_id : c.user_id };
                          return (
                            <div key={c.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer" onClick={async () => {
                              try {
                                const res = await fetch('/api/conversations/create-or-find', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ other_user_id: other.id }) });
                                const json = await res.json();
                                if (json.conversation_id) {
                                  setSelected(json.conversation_id);
                                  setShowNew(false);
                                  const convRes2 = await fetch('/api/conversations');
                                  setConversations((await convRes2.json()) || []);
                                } else if (json.requestCreated) {
                                  alert(json.message || 'Connection request created');
                                } else {
                                  alert(json.message || 'Unable to open conversation');
                                }
                              } catch (e) {
                                console.error(e);
                                alert('Error starting conversation');
                              }
                            }}>
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={other.avatar_url || `https://www.gravatar.com/avatar/?d=mp&s=48`} alt={other.name || other.id} className="w-full h-full object-cover" />
                              </div>
                              <div className="text-sm">{other.name || other.id}</div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <ul className="mt-2">
              {conversations.length === 0 && <li className="px-2 text-sm text-gray-500">No conversations yet</li>}
              {conversations.map((c) => {
                let display = c.title || "Direct message";
                let avatarUrl: string | null = null;
                if (c.participants && currentUserId) {
                  if (c.participants.length === 2) {
                    const other = c.participants.find((p) => p.user && p.user.id !== currentUserId);
                    if (other && other.user) {
                      display = other.user.name || display;
                      avatarUrl = other.user.avatar_url || null;
                    }
                  }
                }

                const avatar = avatarUrl || `https://www.gravatar.com/avatar/?d=mp&s=64`;

                return (
                  <li key={c.id} className={`p-2 rounded my-1 hover:bg-gray-50 cursor-pointer ${selected === c.id ? "bg-gray-100" : ""}`} onClick={() => setSelected(c.id)}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={avatar} alt={display} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{display}</div>
                        <div className="text-sm text-gray-500">{c.last_message_at ? new Date(c.last_message_at).toLocaleString() : "No messages"}</div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Right chat area */}
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white rounded shadow h-[70vh] overflow-hidden">
            {selected ? (
              <ConversationView conversationId={selected} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">Select a conversation to view messages</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
