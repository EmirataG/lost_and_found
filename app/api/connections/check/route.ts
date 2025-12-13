import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { other_user_id } = await request.json();
    if (!other_user_id) return NextResponse.json({ connected: false });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ connected: false });

    const { data } = await supabase
      .from("connections")
      .select("id,user_id,friend_id")
      .or(`(user_id.eq.${user.id},friend_id.eq.${other_user_id})`)
      .or(`(user_id.eq.${other_user_id},friend_id.eq.${user.id})`)
      .limit(1);

    const connected = !!(data && data.length > 0);
    return NextResponse.json({ connected });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ connected: false });
  }
}
