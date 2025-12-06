"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewMessagePage() {
  const router = useRouter();
  const params = useSearchParams();
  const otherId = params?.get("userId");

  useEffect(() => {
    async function start() {
      if (!otherId) {
        alert("No user specified");
        router.push("/messages");
        return;
      }

      const res = await fetch("/api/conversations/create-or-find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ other_user_id: otherId }),
      });
      const json = await res.json();
      if (json.conversation_id) {
        router.push(`/messages/${json.conversation_id}`);
      } else if (json.requestCreated) {
        alert("Connection request sent. Once accepted you can message.");
        router.push("/messages");
      } else {
        alert(json.message || "Unable to start conversation");
        router.push("/messages");
      }
    }
    start();
  }, [otherId, router]);

  return <div className="p-6">Starting conversation...</div>;
}
