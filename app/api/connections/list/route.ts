import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json([], { status: 200 });

    // return friends for the user and include the other user's basic info
    const { data: conns } = await supabase.from("connections").select("*").or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

    const otherIds = (conns || []).map((c: any) => (c.user_id === user.id ? c.friend_id : c.user_id)).filter(Boolean);
    let usersMap: Record<string, any> = {};
    if (otherIds.length > 0) {
      const { data: users } = await supabase.from("users").select("id, name, avatar_url").in("id", otherIds);
      usersMap = (users || []).reduce((acc: any, u: any) => ({ ...acc, [u.id]: u }), {});
    }

    const enriched = (conns || []).map((c: any) => {
      const otherId = c.user_id === user.id ? c.friend_id : c.user_id;
      return { ...c, other: usersMap[otherId] || { id: otherId } };
    });

    return NextResponse.json(enriched || []);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
