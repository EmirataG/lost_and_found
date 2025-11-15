"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PostCard from "@/components/post_card/PostCard";
import PostForm from "@/components/post_form/PostFrom";
import SideMenu from "@/components/main_screen/SideMenu";
import { createClient } from "@/utils/supabase/client";
import BoardHeader from "@/components/main_screen/BoardHeader";

import yaleLogo from "@/public/images/yale_logo.png";

// types
import { type PostInfo, type Photo } from "@/types";
import { User } from "@supabase/supabase-js";

const MainScreen = ({ user }: { user: User }) => {
  const [postFormOpen, setPostFormOpen] = useState<boolean>(false);
  const [posts, setPosts] = useState<PostInfo[]>([]);
  const [photos, setPhotos] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const userId = user.id;
  const userName = user.user_metadata.name;

  useEffect(() => {
    const supabase = createClient();

    async function fetchData() {
      setLoading(true);

      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*, user:user_id (name, email)")
        .order("created_at", { ascending: false });

      if (postsError) {
        setLoading(false);
        return;
      }
      setPosts(postsData || []);

      const postIds = (postsData || []).map((p) => p.id);
      if (postIds.length > 0) {
        const { data: photosData, error: photosError } = await supabase
          .from("photos")
          .select("post_id,url")
          .in("post_id", postIds);

        if (!photosError && photosData) {
          const grouped: Record<string, string[]> = {};
          photosData.forEach((photo: Photo) => {
            if (!grouped[photo.post_id]) grouped[photo.post_id] = [];
            grouped[photo.post_id].push(photo.url);
          });
          setPhotos(grouped);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-100">
        <BoardHeader />
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <Image
              src={yaleLogo}
              alt="Lale logo"
              width={64}
              className="animate-spin"
            />
          </div>
        ) : posts.length === 0 ? (
          <p>No lost items found.</p>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto p-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                photos={photos[post.id] || []}
              />
            ))}
          </div>
        )}
      </main>

      {/* PostForm */}
      {postFormOpen && (
        <PostForm userId={userId} closeForm={() => setPostFormOpen(false)} />
      )}
    </div>
  );
};

export default MainScreen;
