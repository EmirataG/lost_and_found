import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("users").select("id,name,email,avatar_url,phone,bio,created_at").eq("id", params.id).single();
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // privacy: only return email/phone when the requester is the same user or connected
    const { data: current } = await supabase.auth.getUser();
    const requesterId = current?.user?.id;
    let isConnected = false;
    if (requesterId && requesterId !== params.id) {
      const { data: conn } = await supabase
        .from("connections")
        .select("id")
        .or(`(user_id.eq.${requesterId},friend_id.eq.${params.id})`)
        .or(`(user_id.eq.${params.id},friend_id.eq.${requesterId})`)
        .limit(1);
      isConnected = !!(conn && conn.length > 0);
    }

    const out: any = { id: data.id, name: data.name, avatar_url: data.avatar_url, created_at: data.created_at };
    if (requesterId && (requesterId === params.id || isConnected)) {
      out.email = data.email;
      out.phone = data.phone;
      out.bio = data.bio;
    } else {
      out.bio = data.bio ? data.bio.substring(0, 200) : null; // short preview for non-connected users
    }

    return NextResponse.json(out);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
