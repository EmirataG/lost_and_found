"use client";
import { useEffect, useState } from "react";
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

export default function BoardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [photos, setPhotos] = useState<Record<number, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    async function fetchData() {
      setLoading(true);
      // Fetch all lost posts (type === 'lost')
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
          // Group photos by post_id
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
    // Optionally, poll every 10 seconds for live updates
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Lost Items Board</h1>
      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p>No lost items found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {posts.map((post) => (
            <li
              key={post.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                marginBottom: 20,
                padding: 20,
                background: "#fafbfc",
              }}
            >
              <h2 style={{ margin: 0 }}>{post.title}</h2>
              <p style={{ margin: "8px 0" }}>{post.description}</p>
              <div style={{ color: "#555", fontSize: 14 }}>
                <span>When: {post.when}</span> | <span>Where: {post.where}</span>
              </div>
              {photos[post.id] && photos[post.id].length > 0 && (
                <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {photos[post.id].map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Lost item photo"
                      style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 6 }}
                    />
                  ))}
                </div>
              )}
              {post.ressolved && (
                <div style={{ color: "green", fontWeight: 600, marginTop: 8 }}>Resolved</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}