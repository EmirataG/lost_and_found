"use client";

import Image from "next/image";
import { type PostInfo } from "@/types";
import ImageContainer from "./ImageContainer";
import { useState, useEffect } from "react";
import SimpleModal from "@/components/SimpleModal";

const PostCard = ({ post, photos }: { post: PostInfo; photos: string[] }) => {
  const isLost = post.type === "lost";
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/connections/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ other_user_id: post.user_id }),
        });
        const json = await res.json();
        setConnected(!!json.connected);
      } catch (err) {
        setConnected(false);
      }
    }
    check();
  }, [post.user_id]);

  return (
    <div
      className="
        bg-white rounded-xl shadow-2xl border border-gray-300 
        p-6 overflow-hidden
        flex flex-col lg:flex-row gap-4
      "
    >
      {/* Image Section */}
      {photos.length > 0 ? (
        <div className="w-full lg:w-[45%] overflow-hidden rounded-lg">
          <ImageContainer urls={photos} />
        </div>
      ) : null}

      {/* Info Section */}
      <div
        className="
          flex flex-col gap-2 bg-blue-100 rounded-lg p-4 flex-1 min-h-[250px] 
          max-h-[450px] lg:max-h-full
        "
      >
        <div className="flex justify-between items-center gap-4 shrink-0">
          <section>
            <h3 className="text-xl text-justify font-semibold">{post.title}</h3>
            <p className="text-gray-700 text-sm">
              Posted {new Date(post.created_at).toLocaleDateString()}
            </p>
          </section>
          <div className="flex flex-col gap-2 shrink-0">
            <span
              className={`
                px-3 py-1 text-sm text-center font-semibold border rounded-full
                ${
                  isLost
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }
              `}
            >
              {isLost ? "Lost" : "Found"}
            </span>

            <a
              href={`mailto:${post.user.email}`}
              className="
                px-3 py-1 rounded-full text-sm font-medium bg-yaleBlue 
                text-white text-center hover:bg-white hover:text-yaleBlue border border-transparent hover:border-yaleBlue transition
              "
            >
              {isLost ? "Found it?" : "It's yours?"}
            </a>

            {!isLost && (
              <>
                <button
                  onClick={() => setOpen(true)}
                  className="mt-2 inline-block w-full text-center px-3 py-1 rounded-full text-sm font-medium bg-white text-yaleBlue border border-yaleBlue hover:bg-yaleBlue hover:text-white transition"
                >
                  Contact Finder
                </button>

                <SimpleModal open={open} onClose={() => setOpen(false)} title="Contact Finder">
                  <div className="space-y-3">
                    {connected === null && <div>Checking connection status...</div>}
                    {connected === false && (
                      <div>
                        <p className="mb-2">You are not connected with this user.</p>
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch("/api/connections/request", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ receiver_id: post.user_id }),
                              });
                              const json = await res.json();
                              alert(json.message || "Request sent");
                              setOpen(false);
                            } catch (err) {
                              alert("Failed to send request");
                            }
                          }}
                          className="px-4 py-2 bg-yaleBlue text-white rounded"
                        >
                          Send Connection Request
                        </button>
                      </div>
                    )}

                    {connected === true && (
                      <div>
                        <p className="mb-2">You are connected — start a conversation.</p>
                        <a
                          href={`/messages/new?userId=${post.user_id}`}
                          className="px-4 py-2 bg-yaleBlue text-white rounded inline-block"
                        >
                          Open Chat
                        </a>
                      </div>
                    )}
                  </div>
                </SimpleModal>
              </>
            )}
          </div>
        </div>

        {/* Scrollable Middle Section */}
        <p className="text-gray-700 text-justify text-sm flex-1 overflow-y-auto pr-2">
          {post.description}
        </p>

        {/* When Where */}
        <div className="mt-auto grid grid-cols-2 bg-yaleBlue text-white text-sm font-medium rounded-lg overflow-hidden">
          <div className="flex items-center justify-center px-4 py-2 border-r border-white/40">
            <span className="font-bold mr-1">When:</span> {post.when}
          </div>

          <div className="flex items-center justify-center px-4 py-2">
            <span className="font-bold mr-1">Where:</span> {post.where}
          </div>
        </div>

        {post.resolved && (
          <div className="text-green-600 font-semibold text-center mt-2">
            Resolved
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
