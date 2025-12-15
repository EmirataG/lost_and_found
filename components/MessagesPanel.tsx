"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import SimpleModal from "./SimpleModal";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [emailError, setEmailError] = useState("");

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

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const checkUserExists = async (email: string) => {
    try {
      const { data } = await supabase.from("users").select("id").eq("email", email).single();
      return !!data;
    } catch (err) {
      return false;
    }
  };

  const showModal = (title: string, message: string, type: "success" | "error") => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalOpen(true);
  };

  const sendRequest = async () => {
    console.log("sendRequest called with email:", email);
    
    // Clear previous error
    setEmailError("");
    
    // Validate email format
    const validationError = validateEmail(email);
    if (validationError) {
      console.log("Validation error:", validationError);
      setEmailError(validationError);
      showModal("Invalid Email", validationError, "error");
      return;
    }

    // Check if user exists
    const userExists = await checkUserExists(email);
    console.log("User exists:", userExists);
    if (!userExists) {
      setEmailError("User does not exist");
      showModal("User Not Found", "The email address you entered does not exist in our system.", "error");
      return;
    }

    try {
      const res = await fetch("/api/connections/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiver_email: email }),
      });
      const json = await res.json();
      console.log("API response:", { ok: res.ok, json });
      
      if (!res.ok || !json.success) {
        // Handle specific error cases
        if (json.message?.includes("already connected")) {
          showModal("Already Connected", "You are already connected with this user.", "error");
        } else if (json.message?.includes("already a pending request") || json.message?.includes("already been sent")) {
          showModal("Request Already Sent", "A connection request has already been sent to this user.", "error");
        } else {
          showModal("Error", json.message || json.error || "Failed to send request", "error");
        }
      } else {
        showModal("Success", "Connection request sent successfully!", "success");
        setEmail("");
        load();
      }
    } catch (err) {
      console.error("sendRequest error:", err);
      showModal("Error", "An unexpected error occurred. Please try again.", "error");
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
      
      if (!res.ok) {
        showModal("Error", json.message || json.error || "Failed to respond to request", "error");
      } else {
        const actionText = action === "accept" ? "accepted" : "rejected";
        showModal("Success", `Connection request ${actionText} successfully!`, "success");
        load();
      }
    } catch (err) {
      console.error(err);
      showModal("Error", "An unexpected error occurred. Please try again.", "error");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <SimpleModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={modalTitle}
      >
        <div className={`p-4 rounded-lg ${modalType === "success" ? "bg-green-50" : "bg-red-50"}`}>
          <p className={`text-sm ${modalType === "success" ? "text-green-800" : "text-red-800"}`}>
            {modalMessage}
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <button 
            onClick={() => setModalOpen(false)} 
            className={`px-4 py-2 rounded-lg font-semibold text-white ${
              modalType === "success" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            OK
          </button>
        </div>
      </SimpleModal>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Messages</h2>

      <section className="mb-6">
        <h3 className="font-bold text-gray-900 mb-3">Start a connection</h3>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <input 
                value={email} 
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }} 
                onKeyDown={(e) => {
                  if (e.key === "Enter" && email.trim()) {
                    sendRequest();
                  }
                }}
                placeholder="User email" 
                className={`w-full border rounded-lg p-3 focus:ring-2 focus:outline-none transition placeholder-gray-400 ${
                  emailError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {emailError && (
                <p className="text-sm text-red-600 mt-1">{emailError}</p>
              )}
            </div>
            <button 
              onClick={sendRequest} 
              disabled={!email.trim()}
              className="px-4 py-3 bg-yaleBlue text-white rounded-lg font-semibold transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Send request
            </button>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="font-bold text-gray-900 mb-3">Pending requests</h3>
        {requests.length === 0 && <div className="text-sm text-gray-600">No pending requests</div>}
        <ul>
          {requests.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition my-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.requester?.avatar_url || `https://www.gravatar.com/avatar/?d=mp&s=48`} alt={r.requester?.name || r.requester_id} className="w-full h-full object-cover" />
                </div>
                <div className="">From: {r.requester?.name || r.requester_id}</div>
              </div>
              <button onClick={() => respond(r.id, "accept")} className="px-3 py-2 bg-green-500 text-white rounded-lg font-semibold transition-transform hover:scale-105 active:scale-95">Accept</button>
              <button onClick={() => respond(r.id, "reject")} className="px-3 py-2 bg-red-500 text-white rounded-lg font-semibold transition-transform hover:scale-105 active:scale-95">Reject</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-gray-900 mb-3">Conversations</h3>
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
                <Link href={`/messages/${c.id}`} className="block p-4 border border-gray-300 rounded-xl hover:bg-blue-50 hover:border-yaleBlue flex items-center gap-4 transition">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatar} alt={display} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{display}</div>
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
