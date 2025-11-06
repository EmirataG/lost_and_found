"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import PostForm from "./PostFrom";
import SideMenu from "./SideMenu";
import { createClient } from "@/utils/supabase/client";

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

const MainScreen = ({ userId }: { userId: string }) => {
  const [postFormOpen, setPostFormOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'map' | 'board'>('map');
  const [posts, setPosts] = useState<Post[]>([]);
  const [photos, setPhotos] = useState<Record<number, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab !== 'board') return;

    const supabase = createClient();
    async function fetchData() {
      setLoading(true);
      // Fetch all lost posts
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

      // Fetch all photos for these posts
      const postIds = (postsData || []).map((p: Post) => p.id);
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
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-center space-x-4 p-4 bg-white shadow">
        <button
          onClick={() => setActiveTab('map')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'map' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Post
        </button>
        <button
          onClick={() => setActiveTab('board')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'board' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Live Request Board
        </button>
      </div>

      <div className="flex-1 relative">
        {activeTab === 'map' ? (
          <>
            <SideMenu openForm={() => setPostFormOpen(true)} />
            {postFormOpen && (
              <PostForm userId={userId} closeForm={() => setPostFormOpen(false)} />
            )}
          </>
        ) : (
          <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Live Request Board</h2>
            {loading ? (
              <p>Loading...</p>
            ) : posts.length === 0 ? (
              <p>No lost items found.</p>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                  >
                    <h3 className="text-xl font-semibold">{post.title}</h3>
                    <p className="mt-2 text-gray-600">{post.description}</p>
                    <div className="mt-3 text-sm text-gray-500">
                      <span>When: {post.when}</span>
                      <span className="mx-2">•</span>
                      <span>Where: {post.where}</span>
                    </div>
                    {photos[post.id] && photos[post.id].length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {photos[post.id].map((url, idx) => (
                          <Image
                            key={idx}
                            src={url}
                            alt={`Photo ${idx + 1} for ${post.title}`}
                            width={96}
                            height={96}
                            className="w-24 h-24 object-cover rounded-md"
                          />
                        ))}
                      </div>
                    )}
                    {post.ressolved && (
                      <div className="mt-3 text-green-600 font-semibold">
                        Resolved
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainScreen;
