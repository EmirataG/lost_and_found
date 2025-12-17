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
    if (userErr || !user)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    let receiverId = receiver_id;
    if (!receiverId && receiver_email) {
      const { data: found } = await supabase.from("users").select("id").eq("email", receiver_email).single();
      if (!found) return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
      receiverId = found.id;
    }

    if (!receiverId)
      return NextResponse.json({ error: "Missing receiver" }, { status: 400 });

    // prevent sending request to yourself
    if (receiverId === user.id) {
      return NextResponse.json({ success: false, message: "You cannot send a connection request to yourself" }, { status: 400 });
    }

    // prevent creating request if already connected (either direction)
    const { data: existingConn } = await supabase
      .from("connections")
      .select("id")
      .or(
        `and(user_id.eq.${user.id},friend_id.eq.${receiverId}),and(user_id.eq.${receiverId},friend_id.eq.${user.id})`,
      )
      .limit(1);

    if (existingConn && existingConn.length > 0) {
      return NextResponse.json(
        { success: false, message: "Already connected" },
        { status: 400 },
      );
    }

    // prevent duplicate pending requests in either direction
    const { data: existingReq } = await supabase
      .from("connection_requests")
      .select("id,status,requester_id,receiver_id")
      .or(
        `and(requester_id.eq.${user.id},receiver_id.eq.${receiverId}),and(requester_id.eq.${receiverId},receiver_id.eq.${user.id})`,
      )
      .order("created_at", { ascending: false })
      .limit(1);

    if (existingReq && existingReq.length > 0) {
      const req = existingReq[0];
      if (req.status === "pending") {
        return NextResponse.json({ success: false, message: "A connection request has already been sent" }, { status: 400 });
      }
    }

    // Insert request
    const { data, error } = await supabase
      .from("connection_requests")
      .insert({
        requester_id: user.id,
        receiver_id: receiverId,
        message: message || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      // Handle duplicate key constraint violation
      if (error.code === "23505" || error.message?.includes("duplicate key") || error.message?.includes("unique constraint")) {
        return NextResponse.json({ success: false, message: "A connection request has already been sent" }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, request: data, message: "Request created" });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : String(err);
    // Catch any remaining duplicate key errors
    if (
      message.includes("duplicate key") ||
      message.includes("unique constraint")
    ) {
      return NextResponse.json(
        { success: false, message: "A connection request has already been sent" },
        { status: 400 },
      );
    }
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
