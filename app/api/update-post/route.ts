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
          const sanitizedName = photo.name
            .replaceAll(" ", "_")
            .replace(/[^\w.-]/g, "");
          const filePath = `${postId}/${sanitizedName}`;

          const { error: uploadError } = await supabase.storage
            .from("photos")
            .upload(filePath, photo);

          if (uploadError) {
            console.error(`Error uploading photo ${photo.name}:`, uploadError);
            throw uploadError;
          }

          const { data: publicUrl } = supabase.storage
            .from("photos")
            .getPublicUrl(filePath);

          const { data, error: insertError } = await supabase
            .from("photos")
            .insert({ post_id: postId, url: publicUrl.publicUrl })
            .select("url")
            .single();

          if (insertError) {
            console.error(
              `Error inserting photo URL to database:`,
              insertError,
            );
            throw insertError;
          }

          return data?.url;
        }),
      );
      console.log("Uploaded:", photoUrls);
    }

    // Delete photos if needed
    if (deletedPhotos.length > 0) {
      const deleteUrls = deletedPhotos.map((photoUrl) => {
        const index = photoUrl.indexOf("photos/");
        if (index === -1) {
          return photoUrl;
        }
        const cutUrl = photoUrl.substring(index + 7);
        return cutUrl;
      });
      console.log(deleteUrls);
      const { error } = await supabase.storage
        .from("photos")
        .remove(deleteUrls);

      if (error) {
        console.error(`Error deleting photos from storage: ${error}`);
      }

      deletedPhotos.forEach(async (photo) => {
        const { error } = await supabase
          .from("photos")
          .delete()
          .eq("url", photo)
          .eq("post_id", postId);

        if (error) {
          console.error(`Error deleting photos from database: ${error}`);
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
