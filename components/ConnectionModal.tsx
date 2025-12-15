"use client";

import React, { useEffect, useMemo, useState } from "react";
import SimpleModal from "./SimpleModal";
import type { PostType } from "@/types";

type Props = {
  open: boolean;
  onClose: () => void;
  targetEmail: string;
  targetName?: string;
  postTitle?: string;
  postType?: PostType;
};

export default function ConnectionModal({
  open,
  onClose,
  targetEmail,
  targetName,
  postTitle,
  postType,
}: Props) {
  const defaultMessage = useMemo(() => {
    const titled = postTitle ? ` (${postTitle})` : "";
    if (postType === "lost") {
      return `Hi, I think I found this item${titled}. Can we connect?`;
    }
    if (postType === "found") {
      return `Hi, I think this item${titled} is mine. Can we connect?`;
    }
    return `Hi, I think this item${titled} is related to you. Can we connect?`;
  }, [postTitle, postType]);

  const [message, setMessage] = useState(defaultMessage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) setMessage(defaultMessage);
  }, [open, defaultMessage]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1) Create or find conversation by other user's email, always returns conversation_id
      const convRes = await fetch("/api/conversations/create-or-find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ other_email: targetEmail }),
      });

      if (!convRes.ok) {
        const text = await convRes.text();
        throw new Error(text || "Failed to start conversation");
      }
      const convData = await convRes.json();
      const conversationId = convData.conversation_id;
      if (!conversationId) throw new Error("No conversation id returned");

      // 2) Send initial message
      const msgRes = await fetch(
        `/api/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: message }),
        },
      );

      if (!msgRes.ok) {
        const text = await msgRes.text();
        throw new Error(text || "Failed to send message");
      }

      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title={`Message ${targetName ?? targetEmail}`}
    >
      <form
        onSubmit={handleSend}
        className="flex flex-col gap-3"
      >
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          className="w-full rounded border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-yaleBlue focus:outline-none"
        />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded border px-3 py-1 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-yaleBlue px-3 py-1 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send message"}
          </button>
          <a
            href={`mailto:${targetEmail}`}
            className="rounded bg-yaleBlue px-3 py-1 text-sm font-medium text-white hover:opacity-90"
          >
            Prefer email?
          </a>
        </div>
      </form>
    </SimpleModal>
  );
}
