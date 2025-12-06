import Image from "next/image";
import { type PostData } from "@/types";
import ImageContainer from "./ImageContainer";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import LocationHoverTooltip from "./LocationHoverTooltip";

const PostCard = ({ post }: { post: PostData }) => {
  const isLost = post.type === "lost";
  const photos = post.photos;

  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-xl border border-gray-300 bg-white p-6 shadow-2xl lg:flex-row">
      {/* Image Section */}
      {photos.length > 0 ? (
        <div className="w-full overflow-hidden rounded-lg lg:w-[45%]">
          <ImageContainer urls={photos} />
        </div>
      ) : null}

      {/* Info Section */}
      <div className="flex max-h-[450px] min-h-[250px] flex-1 flex-col gap-2 rounded-lg bg-blue-100 p-4 lg:max-h-full">
        <div className="flex shrink-0 items-center justify-between gap-4">
          <section>
            <h3 className="text-justify text-xl font-semibold">{post.title}</h3>
            <p className="text-sm text-gray-700">
              Posted {new Date(post.created_at).toLocaleDateString()}
            </p>
          </section>
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

            <a
              href={`mailto:${post.user.email}`}
              className="rounded-full border border-transparent bg-yaleBlue px-3 py-1 text-center text-sm font-medium text-white transition hover:border-yaleBlue hover:bg-white hover:text-yaleBlue"
            >
              {isLost ? "Found it?" : "It's yours?"}
            </a>
          </div>
        </div>

        {/* Scrollable Middle Section */}
        <p className="flex-1 overflow-y-auto pr-2 text-justify text-sm text-gray-700">
          {post.description}
        </p>

        {/* When Where */}
        <div className="mt-auto grid grid-cols-2 bg-yaleBlue text-white text-sm font-medium rounded-lg overflow-visible">
          <div className="flex items-center justify-center px-4 py-2 border-r border-white/40">
            <FaClock className="mr-1.5 text-white" size={14} />
            <span className="font-bold mr-1">When:</span> {post.when}
          </div>

          <div className="flex items-center justify-center px-4 py-2 relative">
            <FaMapMarkerAlt className="mr-1.5 text-white" size={14} />
            <span className="font-bold mr-1">Where:</span>
            <LocationHoverTooltip location={post.where} />
          </div>
        </div>

        {post.resolved && (
          <div className="mt-2 text-center font-semibold text-green-600">
            Resolved
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
