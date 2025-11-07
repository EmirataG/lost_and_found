import { Dispatch, SetStateAction } from "react";
import { type PostType } from "@/types";

const PostTypeToggle = ({
  isLost,
  changePostType,
}: {
  isLost: boolean;
  changePostType: Dispatch<SetStateAction<PostType>>;
}) => {
  return (
    <div className="bg-gray-300 duration-400 rounded-xl flex w-84">
      <button
        className={`transition-all py-1 rounded-xl flex-1 ${
          isLost ? "yale-blue-bg text-white" : "text-black hover:bg-gray-400"
        }`}
        onClick={() => {
          if (!isLost) {
            changePostType("lost");
          }
        }}
      >
        I lost something
      </button>
      <button
        className={`transition-all duration-400 py-1 rounded-xl flex-1 ${
          !isLost ? "yale-blue-bg text-white" : "text-black hover:bg-gray-400"
        }`}
        onClick={() => {
          if (isLost) {
            changePostType("found");
          }
        }}
      >
        I found something
      </button>
    </div>
  );
};

export default PostTypeToggle;
