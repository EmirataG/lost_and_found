"use client";

import PostCard from "@/components/post_card/PostCard";

import { type PostInfo } from "@/types";

const MyPostsBoard = ({
  posts,
  photos,
}: {
  posts: PostInfo[];
  photos: Record<string, string[]>;
}) => {
  return (
    <div className="flex flex-wrap">
      {posts.map((post, index) => (
        <PostCard post={post} photos={photos[post.id]} key={index} />
      ))}
    </div>
  );
};

export default MyPostsBoard;
