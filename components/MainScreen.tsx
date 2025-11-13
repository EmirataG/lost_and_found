"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PostCard from "@/components/PostCard";
import PostForm from "@/components/PostFrom";
import SideMenu from "@/components/SideMenu";
import { createClient } from "@/utils/supabase/client";
import BoardHeader from "@/components/BoardHeader";

import yaleLogo from "@/public/images/yale_logo.png";

// types
import { type Post, type Photo } from "@/types";

const MainScreen = ({ userId }: { userId: string }) => {
  const [postFormOpen, setPostFormOpen] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [photos, setPhotos] = useState<Record<number, string[]>>({});
  const [loading, setLoading] = useState(false);

  const [menuShown, setMenuShown] = useState<boolean>(true);

  useEffect(() => {
    const showMenuIfNotMobile = () => {
      if (window.innerWidth > 768) {
        setMenuShown(true);
      }
      console.log(window.innerWidth, menuShown);
    };
    showMenuIfNotMobile();
    window.addEventListener("resize", showMenuIfNotMobile);

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
      console.log(postsData);
      setPosts(postsData || []);

      const postIds = (postsData || []).map((p) => p.id);
      if (postIds.length > 0) {
        const { data: photosData, error: photosError } = await supabase
          .from("photos")
          .select("post_id,url")
          .in("post_id", postIds);

        if (!photosError && photosData) {
          const grouped: Record<number, string[]> = {};
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

    return () => window.removeEventListener("resize", showMenuIfNotMobile);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <SideMenu
        openForm={() => setPostFormOpen(true)}
        menuShownOnMobile={menuShown}
        closeMenuOnMobile={() => setMenuShown(false)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-100">
        <BoardHeader
          menuShownOnMobile={menuShown}
          OpenMenuOnMobile={() => setMenuShown(true)}
        />
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
          <div className="space-y-6 max-w-4xl mx-auto">
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
