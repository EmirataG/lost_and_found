"use client";

import MyPostCard from "@/components/post_card/MyPostCard";
import UpdatePostForm from "./post_form/UpdatePostForm";
import { Dispatch, SetStateAction, useState } from "react";

import { type PostInfo } from "@/types";

type PostFilter = "all" | "unresolved" | "resolved";

const MyPostsBoard = ({
  posts,
  photos,
}: {
  posts: PostInfo[];
  photos: Record<string, string[]>;
}) => {
  const [filter, setFilter] = useState<PostFilter>("unresolved");
  const [updatePostFormShown, setUpdatePostFormShown] =
    useState<boolean>(false);

  let postsShown: PostInfo[];
  if (filter === "unresolved") {
    postsShown = posts.filter((post) => !post.resolved);
  } else if (filter === "all") {
    postsShown = posts;
  } else {
    postsShown = posts.filter((post) => post.resolved);
  }

  return (
    <>
      {updatePostFormShown ? (
        <UpdatePostForm post={{ ...posts[0], photos: photos[posts[0].id] }} />
      ) : null}
      <div className="flex-1 flex flex-col items-center gap-4">
        <FilterToggle filter={filter} setFilter={setFilter} />
        {postsShown.length > 0 ? (
          <div className="space-y-6 max-w-4xl mx-auto">
            {postsShown.map((post, index) => (
              <MyPostCard post={post} photos={photos[post.id]} key={index} />
            ))}
          </div>
        ) : (
          <NoPostsFound />
        )}
      </div>
    </>
  );
};

const FilterToggle = ({
  filter,
  setFilter,
}: {
  filter: PostFilter;
  setFilter: Dispatch<SetStateAction<PostFilter>>;
}) => {
  return (
    <div className="duration-400 rounded-xl flex w-84">
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
