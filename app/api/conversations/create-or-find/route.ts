import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { other_user_id, other_email } = body || {};

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    // resolve other user id by email if needed
    let otherId = other_user_id as string | undefined;
    if (!otherId && other_email) {
      const { data: found } = await supabase.from("users").select("id").eq("email", other_email).single();
      if (!found) return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
      otherId = found.id;
    }
    if (!otherId) return NextResponse.json({ error: "Missing other_user_id or other_email" }, { status: 400 });

    // if not connected, ensure a pending connection request exists (create if missing)
    const { data: connA } = await supabase
      .from("connections")
      .select("id,user_id,friend_id")
      .eq("user_id", user.id)
      .eq("friend_id", otherId)
      .limit(1);
    const { data: connB } = await supabase
      .from("connections")
      .select("id,user_id,friend_id")
      .eq("user_id", otherId)
      .eq("friend_id", user.id)
      .limit(1);

    const isConnected = !!((connA && connA.length > 0) || (connB && connB.length > 0));
    if (!isConnected) {
      const { data: existingReq } = await supabase
        .from("connection_requests")
        .select("id,status,requester_id,receiver_id")
        .or(`(requester_id.eq.${user.id},receiver_id.eq.${otherId})`)
        .or(`(requester_id.eq.${otherId},receiver_id.eq.${user.id})`)
        .limit(1);
      if (!existingReq || existingReq.length === 0) {
        await supabase
          .from("connection_requests")
          .insert({ requester_id: user.id, receiver_id: otherId, status: "pending" });
      }
    }

    // find existing direct conversation for these two users
    const { data: parts } = await supabase
      .from("conversation_participants")
      .select("conversation_id,user_id")
      .in("user_id", [user.id, otherId]);

    const grouped: Record<string, string[]> = {};
    (parts || []).forEach((p: any) => {
      grouped[p.conversation_id] = grouped[p.conversation_id] || [];
      grouped[p.conversation_id].push(p.user_id);
    });

    for (const convId of Object.keys(grouped)) {
      const users = grouped[convId];
      if (users.length === 2 && users.includes(user.id) && users.includes(otherId)) {
        return NextResponse.json({ conversation_id: convId });
      }
    }

    // create conversation regardless of connection status
    const { data: conv, error: convErr } = await supabase
      .from("conversations")
      .insert({ kind: "direct", created_by: user.id })
      .select()
      .single();
    if (convErr || !conv) throw new Error(convErr?.message || "Unable to create conversation");

    await supabase.from("conversation_participants").insert([
      { conversation_id: conv.id, user_id: user.id },
      { conversation_id: conv.id, user_id: otherId },
    ]);

    return NextResponse.json({ conversation_id: conv.id });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

