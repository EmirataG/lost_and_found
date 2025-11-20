import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  try {
    const formData = await req.formData();
    const post_id = formData.get("post_id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const when = formData.get("when") as string;
    const where = formData.get("where") as string;

    // update post info
    const { error: updateError } = await supabase
      .from("posts")
      .update({ title, description, when, where })
      .eq("id", post_id);

    if (updateError) throw updateError;

    // remove photos if requested
    const removePhotos = formData.getAll("remove_photos") as string[];
    for (const url of removePhotos) {
      const filePath = url.split("/").slice(-2).join("/");
      await supabase.storage.from("photos").remove([filePath]);
      await supabase.from("photos").delete().eq("url", url);
    }

    // upload new photos
    const photos = formData.getAll("photo") as File[];
    for (const photo of photos) {
      const path = `${post_id}/${photo.name.replace(/\s+/g, "_")}`;
      await supabase.storage.from("photos").upload(path, photo);

      const {
        data: { publicUrl },
      } = await supabase.storage.from("photos").getPublicUrl(path);

      await supabase.from("photos").insert({ post_id, url: publicUrl });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
