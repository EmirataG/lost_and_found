"use client";

import { FiEdit3 } from "react-icons/fi";
import { FiCheck } from "react-icons/fi";

import { type PostData } from "@/types";
import ImageContainer from "./ImageContainer";
import UpdatePostForm from "@/components/post_form/UpdateForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import LocationHoverTooltip from "./LocationHoverTooltip";

const MyPostCard = ({ post }: { post: PostData }) => {
  const router = useRouter();
  const [isUpdateFormShown, setIsUpdateFormShown] = useState<boolean>(false);
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const isLost = post.type === "lost";

  const handleMarkAsResolved = async () => {
    if (post.resolved || isResolving) return;

    setIsResolving(true);
    try {
      const res = await fetch("/api/resolve-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: post.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Trigger refetch of server component data
      router.refresh();
    } catch (err) {
      console.error("Error marking post as resolved:", err);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 overflow-hidden rounded-xl border border-gray-300 bg-white p-6 shadow-2xl lg:flex-row">
        {/* Image Section */}
        {post.photos.length > 0 ? (
          <div className="w-full overflow-hidden rounded-lg lg:w-[45%]">
            <ImageContainer urls={post.photos} />
          </div>
        ) : null}

        {/* Info Section */}
        <div className="flex max-h-[450px] min-h-[250px] flex-1 flex-col gap-2 rounded-lg bg-blue-100 p-4 lg:max-h-full">
          {/* Top Section (fixed) */}
          <div className="flex shrink-0 items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {post.resolved ? (
                <FiCheck className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-yaleBlue bg-yaleBlue p-2 text-white transition-all hover:scale-103 hover:bg-white hover:text-yaleBlue" />
              ) : (
                <FiEdit3
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-yaleBlue bg-yaleBlue p-2 text-white transition-all hover:scale-103 hover:bg-white hover:text-yaleBlue"
                  onClick={() => {
                    setIsUpdateFormShown(true);
                  }}
                />
              )}
              <section>
                <h3 className="text-justify text-xl font-semibold">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-700">
                  Posted {new Date(post.created_at).toLocaleDateString()}
                </p>
              </section>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-center text-sm font-semibold ${
                  isLost
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                } `}
              >
                {isLost ? "Lost" : "Found"}
              </span>

              <button
                onClick={handleMarkAsResolved}
                disabled={post.resolved || isResolving}
                className="rounded-full border border-transparent bg-yaleBlue px-3 py-1 text-center text-sm font-medium text-white transition hover:border-yaleBlue hover:bg-white hover:text-yaleBlue disabled:cursor-not-allowed disabled:opacity-50"
              >
                {post.resolved
                  ? "Resolved 🎉"
                  : isResolving
                    ? "Resolving..."
                    : "Mark as resolved"}
              </button>
            </div>
          </div>

          {/* Scrollable Middle Section */}
          <p className="flex-1 overflow-y-auto pr-2 text-justify text-sm text-gray-700">
            {post.description}
          </p>

          {/* When Where */}
          <div className="mt-auto grid grid-cols-2 overflow-visible rounded-lg bg-yaleBlue text-sm font-medium text-white">
            <div className="flex items-center justify-center border-r border-white/40 px-4 py-2">
              <FaClock
                className="mr-1.5 text-white"
                size={14}
              />
              <span className="mr-1 font-bold">When:</span> {post.when}
            </div>

            <div className="relative flex items-center justify-center px-4 py-2">
              <FaMapMarkerAlt
                className="mr-1.5 text-white"
                size={14}
              />
              <span className="mr-1 font-bold">Where:</span>
              <LocationHoverTooltip location={post.where} />
            </div>
          </div>
        </div>
      </div>

      {isUpdateFormShown && (
        <UpdatePostForm
          post={post}
          closeForm={() => setIsUpdateFormShown(false)}
        />
      )}
    </>
  );
};

export default MyPostCard;
