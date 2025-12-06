import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { receiver_email, receiver_id, message } = body;

    const supabase = await createClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    let receiverId = receiver_id;
    if (!receiverId && receiver_email) {
      const { data: found } = await supabase.from("users").select("id").eq("email", receiver_email).single();
      if (!found) return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
      receiverId = found.id;
    }

    if (!receiverId) return NextResponse.json({ error: "Missing receiver" }, { status: 400 });

    // prevent creating request if already connected
    const { data: existingConn } = await supabase
      .from("connections")
      .select("id")
      .or(`(user_id.eq.${user.id},friend_id.eq.${user.id})`)
      .or(`(user_id.eq.${receiverId},friend_id.eq.${receiverId})`);

    const alreadyConnected = (existingConn || []).some((r: any) => (r.user_id === user.id && r.friend_id === receiverId) || (r.user_id === receiverId && r.friend_id === user.id));
    if (alreadyConnected) {
      return NextResponse.json({ success: false, message: "You are already connected" }, { status: 400 });
    }

    // prevent duplicate pending requests in either direction
    const { data: existingReq } = await supabase
      .from("connection_requests")
      .select("id,status,requester_id,receiver_id")
      .or(`(requester_id.eq.${user.id},receiver_id.eq.${receiverId})`)
      .or(`(requester_id.eq.${receiverId},receiver_id.eq.${user.id})`)
      .limit(1);

    if (existingReq && existingReq.length > 0) {
      const req = existingReq[0];
      if (req.status === "pending") {
        return NextResponse.json({ success: false, message: "There is already a pending request between you and this user" }, { status: 400 });
      }
    }

    // Insert request
    const { data, error } = await supabase.from("connection_requests").insert({
      requester_id: user.id,
      receiver_id: receiverId,
      message: message || null,
      status: "pending",
    }).select().single();

    if (error) throw error;

    return NextResponse.json({ success: true, request: data, message: "Request created" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
