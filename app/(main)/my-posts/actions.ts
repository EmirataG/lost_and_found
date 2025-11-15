import { createClient } from "@/utils/supabase/server";
import { type Photo, type PostInfo } from "@/types";

export async function fetchUserPosts(userId: string): Promise<{
  posts: PostInfo[];
  photos: Record<string, string[]>;
}> {
  const supabase = await createClient();

  const { data: userPosts, error: fetchError } = await supabase
    .from("posts")
    .select("*, user:user_id (name, email)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (fetchError) {
    console.log(`Error fetching user posts: ${fetchError}`);
    return { posts: [], photos: {} };
  }

  const postIds = (userPosts || []).map((p) => p.id);

  if (postIds.length <= 0) {
    return { posts: [], photos: {} };
  }

  const { data: photosData, error: photosError } = await supabase
    .from("photos")
    .select("post_id,url")
    .in("post_id", postIds);

  if (photosError && !photosData) {
    return { posts: [], photos: {} };
  }

  const grouped: Record<string, string[]> = {};
  photosData.forEach((photo: Photo) => {
    if (!grouped[photo.post_id]) grouped[photo.post_id] = [];
    grouped[photo.post_id].push(photo.url);
  });

  return {
    posts: userPosts,
    photos: grouped,
  };
}
