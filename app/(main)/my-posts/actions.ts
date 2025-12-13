import { createClient } from "@/utils/supabase/server";
import { type PostData } from "@/types";

export async function fetchUserPosts(userId: string): Promise<PostData[]> {
  const supabase = await createClient();

  const { data: userPosts, error: fetchError } = await supabase
    .from("posts")
    .select(
      `
    *,
    user:user_id (name, email),
    photos:photos!photos_post_id_fkey (
      url
    )
  `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (fetchError) {
    console.log(`Error fetching user posts: ${fetchError}`);
    return [];
  }

  return userPosts.map((post) => ({
    ...post,
    photos: post.photos.map((p: any) => p.url),
  }));
}

// export async function updatePost()
