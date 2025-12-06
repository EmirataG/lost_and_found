import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  try {
    const formData = await req.formData();
    const postId = formData.get("post_id") as string;

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const when = formData.get("when") as string;
    const where = formData.get("where") as string;

    const newPhotos = formData.getAll("photo") as File[];
    const deletedPhotos = formData.getAll("deleted_photo") as string[];

    // Update text fields
    const { error: postUpdateError } = await supabase
      .from("posts")
      .update({ title, description, when, where })
      .eq("id", postId);

    if (postUpdateError) throw postUpdateError;

    // Upload any new new photos
    if (newPhotos.length > 0) {
      const photoUrls = await Promise.all(
        newPhotos.map(async (photo) => {
          const sanitized = photo.name.replaceAll(" ", "_");
          const filePath = `${postId}/${sanitized}`;

          await supabase.storage.from("photos").upload(filePath, photo);

          const { data } = await supabase
            .from("photos")
            .insert({ post_id: postId, url: filePath })
            .select("url")
            .single();

          return data?.url;
        }),
      );
      console.log("Uploaded:", photoUrls);
    }

    // Delete photos if needed
    if (deletedPhotos.length > 0) {
      console.log(deletedPhotos);
      const { error } = await supabase.storage
        .from("posts")
        .remove(deletedPhotos);

      if (error) {
        console.error(`Error deleting photos from storage: ${error}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
