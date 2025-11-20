import { Dispatch, SetStateAction } from "react";
import { type PostFilter } from "@/types";

const FilterToggle = ({
  filter,
  setFilter,
}: {
  filter: PostFilter;
  setFilter: Dispatch<SetStateAction<PostFilter>>;
}) => {
  return (
    <div className="bg-gray-300 duration-400 rounded-xl flex w-84">
      <button
        className={`transition-all duration-400 py-1 rounded-xl flex-1 ${
          filter === "all"
            ? "yale-blue-bg text-white"
            : "text-black hover:bg-gray-400"
        }`}
        onClick={() => {
          if (filter != "all") {
            setFilter("all");
          }
        }}
      >
        All
      </button>
      <button
        className={`transition-all py-1 rounded-xl flex-1 ${
          filter === "unresolved"
            ? "yale-blue-bg text-white"
            : "text-black hover:bg-gray-400"
        }`}
        onClick={() => {
          if (filter != "unresolved") {
            setFilter("unresolved");
          }
        }}
      >
        Unresolved
      </button>
      <button
        className={`transition-all duration-400 py-1 rounded-xl flex-1 ${
          filter === "resolved"
            ? "yale-blue-bg text-white"
            : "text-black hover:bg-gray-400"
        }`}
        onClick={() => {
          if (filter != "resolved") {
            setFilter("resolved");
          }
        }}
      >
        Resolved
      </button>
    </div>
  );
};

export default FilterToggle;
