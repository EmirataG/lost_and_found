import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { request_id, action } = await request.json();
    if (!request_id || !action) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const supabase = await createClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { data: reqRow, error: fetchErr } = await supabase.from("connection_requests").select("*").eq("id", request_id).single();
    if (fetchErr || !reqRow) return NextResponse.json({ error: "Request not found" }, { status: 404 });

    if (reqRow.receiver_id !== user.id) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    if (action === "accept") {
      // update request
      await supabase.from("connection_requests").update({ status: "accepted", responded_at: new Date().toISOString() }).eq("id", request_id);
      // create connection if not exists
      const u1 = reqRow.requester_id;
      const u2 = reqRow.receiver_id;
      const { data: existing } = await supabase
        .from("connections")
        .select("id,user_id,friend_id")
        .or(`(user_id.eq.${u1},friend_id.eq.${u2})`)
        .or(`(user_id.eq.${u2},friend_id.eq.${u1})`)
        .limit(1);

      if (!existing || existing.length === 0) {
        await supabase.from("connections").insert({ user_id: u1, friend_id: u2 });
      }

      return NextResponse.json({ success: true, message: "Request accepted" });
    } else if (action === "reject") {
      await supabase.from("connection_requests").update({ status: "rejected", responded_at: new Date().toISOString() }).eq("id", request_id);
      return NextResponse.json({ success: true, message: "Request rejected" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
