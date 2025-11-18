import Image from "next/image";
import { type PostInfo } from "@/types";
import ImageContainer from "./ImageContainer";

const PostCard = ({ post, photos }: { post: PostInfo; photos: string[] }) => {
  const isLost = post.type === "lost";

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
        {/* Top Section (fixed) */}
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
