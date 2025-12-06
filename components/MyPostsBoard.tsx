"use client";

import MyPostCard from "@/components/post_card/MyPostCard";
import FilterToggle from "./FilterToggle";

import { useState } from "react";
import { type PostData, PostFilter } from "@/types";

const MyPostsBoard = ({ posts }: { posts: PostData[] }) => {
  const [filter, setFilter] = useState<PostFilter>("unresolved");

  let postsShown: PostData[];
  if (filter === "unresolved") {
    postsShown = posts.filter((post) => !post.resolved);
  } else if (filter === "all") {
    postsShown = posts;
  } else {
    postsShown = posts.filter((post) => post.resolved);
  }

  return (
    <div className="flex-1 flex flex-col items-center gap-4">
      <FilterToggle filter={filter} setFilter={setFilter} />
      {postsShown.length > 0 ? (
        <div className="space-y-6 max-w-4xl mx-auto">
          {postsShown.map((post, index) => (
            <MyPostCard post={post} key={index} />
          ))}
        </div>
      ) : (
        <NoPostsFound />
      )}
    </div>
  );
};

const NoPostsFound = () => {
  return (
    <div className="flex-1 flex flex-col justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="size-32 text-gray-400 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <span className="text-gray-400">No posts to see here...</span>
    </div>
  );
};

export default MyPostsBoard;
