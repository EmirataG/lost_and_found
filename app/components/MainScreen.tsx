"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PostForm from "./PostFrom";
import { createClient } from "@/utils/supabase/client";
import SideMenu from "./SideMenu";

type Post = {
  id: number;
  user_id: string;
  title: string;
  description: string;
  when: string;
  where: string;
  ressolved: boolean;
  type: string;
};

type Photo = {
  post_id: number;
  url: string;
};

const PostCard = ({ post, photos }: { post: Post; photos: string[] }) => (
  <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-300 overflow-hidden space-y-4">
    {/* Photos Section */}
    {photos.length > 0 && (
      <div className="flex flex-col gap-2">
        {photos.map((url, idx) => (
          <Image
            key={idx}
            src={url}
            alt={`Photo ${idx + 1} for ${post.title}`}
            width={400}
            height={400}
            className="w-full h-auto object-cover rounded-lg"
          />
        ))}
      </div>
    )}

    {/* Title and Description Section */}
    <div className="flex flex-col gap-2 p-3 bg-gray-200 rounded-lg">
      <h3 className="text-xl font-semibold">{post.title}</h3>
      <p className="text-gray-700">{post.description}</p>
    </div>

    {/* When / Where Bar */}
    <div className="flex justify-between px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
      <span>When: {post.when}</span>
      <span>Where: {post.where}</span>
    </div>

    {/* Resolved Label */}
    {post.ressolved && (
      <div className="text-green-600 font-semibold text-center mt-2 rounded-lg">
        Resolved
      </div>
    )}
  </div>
);



const MainScreen = ({ userId }: { userId: string }) => {
  const [postFormOpen, setPostFormOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"map" | "board">("map");
  const [posts, setPosts] = useState<Post[]>([]);
  const [photos, setPhotos] = useState<Record<number, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchData() {
      setLoading(true);

      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .eq("type", "lost")
        .order("when", { ascending: false });

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
    // const interval = setInterval(fetchData, 10000);
    // return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <SideMenu openForm={() => setPostFormOpen(true)} />
      {/* <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col items-start space-y-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <button
          onClick={() => setPostFormOpen(true)}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition"
        >
          New Post
        </button>
        <button
          onClick={() => console.log("Show your posts")}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition"
        >
          Your Posts
        </button>
      </aside> */}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Live Request Board</h1>
        {loading ? (
          <p>Loading...</p>
        ) : posts.length === 0 ? (
          <p>No lost items found.</p>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} photos={photos[post.id] || []} />
            ))}
          </div>
        )}
      </main>

      {/* Slide-in PostForm */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          postFormOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {postFormOpen && <PostForm userId={userId} closeForm={() => setPostFormOpen(false)} />}
      </div>

      {/* Overlay */}
      {postFormOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setPostFormOpen(false)}
        />
      )}
    </div>

  );
};

export default MainScreen;
