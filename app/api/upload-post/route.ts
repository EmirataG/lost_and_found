import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

import { type Photo } from "@/types";

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const formData = await request.formData();
    const photos = formData.getAll("photo") as File[] | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const when = formData.get("when") as string;
    const where = formData.get("where") as string;
    const postType = formData.get("type") as string;
    // const userId = formData.get("user_id") as string;

    // const postType = "lost";
    const userId = "1da4a0fe-5cd8-418b-93f0-5d38030d90d9";

    if (!photos || !userId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        user_id: userId,
        title: title,
        description: description,
        when: when,
        where: where,
        ressolved: false,
        type: postType,
      })
      .select()
      .single();

    if (postError) {
      throw postError;
    }

    const photoPublicUrls: Photo[] = await Promise.all(
      photos.map(async (photo) => {
        const sanitizedName = photo.name
          .replaceAll(" ", "_")
          .replace(/[^\w.-]/g, "");
        const photoPath = `${post.id}/${encodeURIComponent(sanitizedName)}`;
        const { error: photoUploadError } = await supabase.storage
          .from("photos")
          .upload(photoPath, photo);

        if (photoUploadError) {
          throw photoUploadError;
        }

        const { data: photoPublicUrlData } = await supabase.storage
          .from("photos")
          .getPublicUrl(photoPath);

        return { post_id: post.id, url: photoPublicUrlData.publicUrl };
      })
    );

    const { error: photosError } = await supabase
      .from("photos")
      .insert(photoPublicUrls);

    if (photosError) {
      throw photosError;
    }

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
