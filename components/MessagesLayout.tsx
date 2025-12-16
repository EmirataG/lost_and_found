"use client";

import { useEffect, useState } from "react";
import ConversationView from "./ConversationView";
import SimpleModal from "./SimpleModal";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

type Conversation = {
  id: string;
  title?: string;
  last_message_at?: string;
  participants?: Array<{
    user_id: string;
    user?: { id: string; name?: string; avatar_url?: string };
  }>;
};

export default function MessagesLayout() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [requests, setRequests] = useState<
    Array<{
      id: string;
      requester_id: string;
      receiver_id: string;
      status: string;
      message?: string;
      requester?: { id: string; name?: string; avatar_url?: string };
    }>
  >([]);
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [connections, setConnections] = useState<
    Array<{
      id: string;
      user_id: string;
      friend_id: string;
      other?: { id: string; name?: string; avatar_url?: string };
    }>
  >([]);
  const [showNew, setShowNew] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [emailError, setEmailError] = useState("");

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
      const { data } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();
      return !!data;
    } catch (err) {
      return false;
    }
  };

  const showModal = (
    title: string,
    message: string,
    type: "success" | "error",
  ) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalOpen(true);
  };

  const loadData = async () => {
    try {
      const [convRes, reqRes, connRes] = await Promise.all([
        fetch("/api/conversations"),
        fetch("/api/connections/requests"),
        fetch("/api/connections/list"),
      ]);
      const convJson = await convRes.json();
      const reqJson = await reqRes.json();
      const connJson = await connRes.json();
      setConversations(convJson || []);
      setRequests(reqJson || []);
      setConnections(connJson || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendRequest = async () => {
    setEmailError("");

    const validationError = validateEmail(email);
    if (validationError) {
      setEmailError(validationError);
      showModal("Invalid Email", validationError, "error");
      return;
    }

    const userExists = await checkUserExists(email);
    if (!userExists) {
      setEmailError("User does not exist");
      showModal(
        "User Not Found",
        "The email address you entered does not exist in our system.",
        "error",
      );
      return;
    }

    try {
      const res = await fetch("/api/connections/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiver_email: email }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        if (json.message?.includes("already connected")) {
          showModal(
            "Already Connected",
            "You are already connected with this user.",
            "error",
          );
        } else if (
          json.message?.includes("already a pending request") ||
          json.message?.includes("already been sent")
        ) {
          showModal(
            "Request Already Sent",
            "A connection request has already been sent to this user.",
            "error",
          );
        } else {
          showModal(
            "Error",
            json.message || json.error || "Failed to send request",
            "error",
          );
        }
      } else {
        showModal(
          "Success",
          "Connection request sent successfully!",
          "success",
        );
        setEmail("");
        await loadData();
      }
    } catch (e) {
      console.error(e);
      showModal(
        "Error",
        "An unexpected error occurred. Please try again.",
        "error",
      );
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const { data: userData } = await supabase.auth.getUser();
        setCurrentUserId(userData?.user?.id || null);
      } catch (e) {
        // ignore
      }

      await loadData();
    }

    load();
  }, []);

  return (
    <div className="flex h-full flex-col p-6">
      <SimpleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
      >
        <div
          className={`rounded-lg p-4 ${modalType === "success" ? "bg-green-50" : "bg-red-50"}`}
        >
          <p
            className={`text-sm ${modalType === "success" ? "text-green-800" : "text-red-800"}`}
          >
            {modalMessage}
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setModalOpen(false)}
            className={`rounded-lg px-4 py-2 font-semibold text-white ${
              modalType === "success"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            OK
          </button>
        </div>
      </SimpleModal>

      <div className="grid flex-1 grid-cols-1 gap-6 overflow-hidden md:grid-cols-3">
        {/* Left list */}
        <div className="col-span-1 flex flex-col overflow-hidden md:col-span-1">
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-gray-300 bg-white shadow-2xl">
            {/* Requests area */}
            <div className="shrink-0 border-b-2 border-gray-200 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">Requests</h3>
              <div className="mt-2">
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
                            handleSendRequest();
                          }
                        }}
                        placeholder="User email"
                        className={`w-full rounded-lg border p-3 placeholder-gray-400 transition focus:ring-2 focus:outline-none ${
                          emailError
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                      />
                      {emailError && (
                        <p className="mt-1 text-xs text-red-600">
                          {emailError}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleSendRequest}
                      disabled={!email.trim()}
                      className="rounded-lg bg-yaleBlue px-4 py-3 font-semibold text-white transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                    >
                      Send
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900">Pending</h4>
                  {requests.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      No pending requests
                    </div>
                  ) : (
                    <ul className="mt-2">
                      {requests.map((r) => (
                        <li
                          key={r.id}
                          className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50"
                        >
                          <div className="flex flex-1 items-center gap-3">
                            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-200">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={
                                  r.requester?.avatar_url ||
                                  `https://www.gravatar.com/avatar/?d=mp&s=48`
                                }
                                alt={r.requester?.name || r.requester_id}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="text-sm">
                              From: {r.requester?.name || r.requester_id}
                            </div>
                          </div>
                          <button
                            onClick={async () => {
                              try {
                                const res = await fetch(
                                  "/api/connections/respond",
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      request_id: r.id,
                                      action: "accept",
                                    }),
                                  },
                                );
                                const json = await res.json();
                                if (!res.ok) {
                                  showModal(
                                    "Error",
                                    json.message ||
                                      json.error ||
                                      "Failed to accept request",
                                    "error",
                                  );
                                } else {
                                  showModal(
                                    "Success",
                                    "Connection request accepted successfully!",
                                    "success",
                                  );
                                  await loadData();
                                }
                              } catch (e) {
                                console.error(e);
                                showModal(
                                  "Error",
                                  "An unexpected error occurred. Please try again.",
                                  "error",
                                );
                              }
                            }}
                            className="rounded-lg bg-green-500 px-3 py-2 font-semibold text-white transition-transform hover:scale-105 active:scale-95"
                          >
                            Accept
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                const res = await fetch(
                                  "/api/connections/respond",
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      request_id: r.id,
                                      action: "reject",
                                    }),
                                  },
                                );
                                const json = await res.json();
                                if (!res.ok) {
                                  showModal(
                                    "Error",
                                    json.message ||
                                      json.error ||
                                      "Failed to reject request",
                                    "error",
                                  );
                                } else {
                                  showModal(
                                    "Success",
                                    "Connection request rejected.",
                                    "success",
                                  );
                                  await loadData();
                                }
                              } catch (e) {
                                console.error(e);
                                showModal(
                                  "Error",
                                  "An unexpected error occurred. Please try again.",
                                  "error",
                                );
                              }
                            }}
                            className="rounded-lg bg-red-500 px-3 py-2 font-semibold text-white transition-transform hover:scale-105 active:scale-95"
                          >
                            Reject
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-between border-b-2 border-gray-200 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">Conversations</h3>
              <div className="relative">
                <button
                  onClick={() => setShowNew((s) => !s)}
                  className="rounded-lg bg-yaleBlue px-4 py-2 font-semibold text-white transition-transform hover:scale-105 active:scale-95"
                >
                  +
                </button>
                {showNew ? (
                  <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-gray-300 bg-white shadow-2xl">
                    <div className="p-2 text-sm font-semibold">
                      Start conversation
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {connections.length === 0 ? (
                        <div className="p-2 text-sm text-gray-500">
                          No connections
                        </div>
                      ) : (
                        connections.map((c) => {
                          const other = c.other || {
                            id:
                              c.user_id === currentUserId
                                ? c.friend_id
                                : c.user_id,
                          };
                          return (
                            <div
                              key={c.id}
                              className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition hover:bg-gray-100"
                              onClick={async () => {
                                try {
                                  const res = await fetch(
                                    "/api/conversations/create-or-find",
                                    {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        other_user_id: other.id,
                                      }),
                                    },
                                  );
                                  const json = await res.json();
                                  if (json.conversation_id) {
                                    setSelected(json.conversation_id);
                                    setShowNew(false);
                                    const convRes2 =
                                      await fetch("/api/conversations");
                                    setConversations(
                                      (await convRes2.json()) || [],
                                    );
                                  } else if (json.requestCreated) {
                                    showModal(
                                      "Request Sent",
                                      json.message ||
                                        "Connection request created. Once accepted you can message.",
                                      "success",
                                    );
                                  } else {
                                    showModal(
                                      "Error",
                                      json.message ||
                                        "Unable to open conversation",
                                      "error",
                                    );
                                  }
                                } catch (e) {
                                  console.error(e);
                                  showModal(
                                    "Error",
                                    "An unexpected error occurred while starting conversation.",
                                    "error",
                                  );
                                }
                              }}
                            >
                              <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={
                                    other.avatar_url ||
                                    `https://www.gravatar.com/avatar/?d=mp&s=48`
                                  }
                                  alt={other.name || other.id}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="text-sm">
                                {other.name || other.id}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6">
              <ul className="mt-2">
                {conversations.length === 0 && (
                  <li className="px-2 text-sm text-gray-500">
                    No conversations yet
                  </li>
                )}
                {conversations.map((c) => {
                  let display = c.title || "Direct message";
                  let avatarUrl: string | null = null;
                  if (c.participants && currentUserId) {
                    if (c.participants.length === 2) {
                      const other = c.participants.find(
                        (p) => p.user && p.user.id !== currentUserId,
                      );
                      if (other && other.user) {
                        display = other.user.name || display;
                        avatarUrl = other.user.avatar_url || null;
                      }
                    }
                  }

                  const avatar =
                    avatarUrl || `https://www.gravatar.com/avatar/?d=mp&s=64`;

                  return (
                    <li
                      key={c.id}
                      className={`my-2 cursor-pointer rounded-lg border p-4 transition hover:bg-gray-50 ${selected === c.id ? "border-yaleBlue bg-blue-50" : "border-transparent hover:border-gray-200"}`}
                      onClick={() => setSelected(c.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={avatar}
                            alt={display}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            {display}
                          </div>
                          <div className="text-sm text-gray-500">
                            {c.last_message_at
                              ? new Date(c.last_message_at).toLocaleString()
                              : "No messages"}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Right chat area */}
        <div className="col-span-1 flex flex-col overflow-hidden md:col-span-2">
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-gray-300 bg-white shadow-2xl">
            {selected ? (
              <ConversationView conversationId={selected} />
            ) : (
              <div className="flex h-full items-center justify-center font-medium text-gray-600">
                Select a conversation to view messages
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
