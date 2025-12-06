import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { other_user_id } = await request.json();
    if (!other_user_id) return NextResponse.json({ error: "Missing other_user_id" }, { status: 400 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    // check if connected (search both directions). Use two explicit checks for reliability.
    const { data: connA } = await supabase.from("connections").select("id,user_id,friend_id").eq("user_id", user.id).eq("friend_id", other_user_id).limit(1);
    const { data: connB } = await supabase.from("connections").select("id,user_id,friend_id").eq("user_id", other_user_id).eq("friend_id", user.id).limit(1);

    const isConnected = !!((connA && connA.length > 0) || (connB && connB.length > 0));

    if (!isConnected) {
      // create connection request instead (if none exists)
      const { data: existingReq } = await supabase
        .from("connection_requests")
        .select("id,status")
        .or(`(requester_id.eq.${user.id},receiver_id.eq.${other_user_id})`)
        .or(`(requester_id.eq.${other_user_id},receiver_id.eq.${user.id})`)
        .limit(1);

      if (existingReq && existingReq.length > 0 && existingReq[0].status === "pending") {
        return NextResponse.json({ requestCreated: false, message: "A pending request already exists" });
      }

      const { data: req } = await supabase.from("connection_requests").insert({ requester_id: user.id, receiver_id: other_user_id, status: "pending" }).select().single();
      return NextResponse.json({ requestCreated: true, request: req });
    }

    // find existing direct conversation with exactly these two participants
    const { data: parts } = await supabase.from("conversation_participants").select("conversation_id,user_id").in("user_id", [user.id, other_user_id]);
    const grouped: Record<string, string[]> = {};
    (parts || []).forEach((p: any) => {
      grouped[p.conversation_id] = grouped[p.conversation_id] || [];
      grouped[p.conversation_id].push(p.user_id);
    });

    for (const convId of Object.keys(grouped)) {
      const users = grouped[convId];
      if (users.length === 2 && users.includes(user.id) && users.includes(other_user_id)) {
        return NextResponse.json({ conversation_id: convId });
      }
    }

    // create conversation
    const { data: conv } = await supabase.from("conversations").insert({ kind: "direct", created_by: user.id }).select().single();
    if (!conv) throw new Error("Unable to create conversation");

    await supabase.from("conversation_participants").insert([{ conversation_id: conv.id, user_id: user.id }, { conversation_id: conv.id, user_id: other_user_id }]);

    return NextResponse.json({ conversation_id: conv.id });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

