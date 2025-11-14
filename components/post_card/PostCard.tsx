import Image from "next/image";
import { type Post } from "@/types";
import ImageContainer from "./ImageContainer";

const PostCard = ({ post, photos }: { post: Post; photos: string[] }) => {
  const isLost = post.type === "lost";
  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-300 overflow-hidden space-y-4">
      {photos.length > 0 ? <ImageContainer urls={photos} /> : null}

      {/* Title and Description Section */}
      <div className="flex flex-col gap-2 p-3 bg-blue-100 rounded-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">{post.title}</h3>
          <div className="flex items-stretch gap-4">
            <span
              className={`px-3 py-1 text-sm font-semibold border rounded-full ${
                isLost
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {isLost ? "Lost item" : "Found item"}
            </span>

            <a
              href={`mailto:${post.user.email}`}
              className={`px-3 py-1 rounded-full text-sm font-medium transition bg-yaleBlue ${
                isLost
                  ? "text-white hover:bg-blue-700"
                  : "text-white hover:bg-blue-700"
              }`}
            >
              {isLost ? "You found it?" : "It's yours?"}
            </a>
          </div>
        </div>

        <p className="text-gray-700">{post.description}</p>
      </div>

      {/* When / Where Bar */}
      <div className="flex justify-between px-4 py-2 bg-yaleBlue text-white rounded-lg text-sm font-medium">
        <span>When: {post.when}</span>
        <span>Where: {post.where}</span>
      </div>

      {/* Resolved Label */}
      {post.resolved && (
        <div className="text-green-600 font-semibold text-center mt-2 rounded-lg">
          Resolved
        </div>
      )}
    </div>
  );
};

export default PostCard;
