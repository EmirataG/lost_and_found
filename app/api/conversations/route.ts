import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json([], { status: 200 });

    // 1) find conversation ids where the user participates
    const { data: parts } = await supabase.from("conversation_participants").select("conversation_id").eq("user_id", user.id);
    const convIds = (parts || []).map((p: any) => p.conversation_id);
    if (convIds.length === 0) return NextResponse.json([]);

    // 2) fetch conversations
    const { data: convs } = await supabase.from("conversations").select("id,title,last_message_at,created_by").in("id", convIds).order("last_message_at", { ascending: false });

    // 3) fetch participants for those conversations
    const { data: participants } = await supabase.from("conversation_participants").select("conversation_id,user_id").in("conversation_id", convIds);
    const userIds = Array.from(new Set((participants || []).map((p: any) => p.user_id)));

    // 4) fetch user info for participants
    let usersMap: Record<string, any> = {};
    if (userIds.length > 0) {
      const { data: users } = await supabase.from("users").select("id,name,email,avatar_url").in("id", userIds);
      (users || []).forEach((u: any) => (usersMap[u.id] = u));
    }

    const convsWithParticipants = (convs || []).map((c: any) => {
      const partsForConv = (participants || []).filter((p: any) => p.conversation_id === c.id).map((p: any) => ({ user_id: p.user_id, user: usersMap[p.user_id] || null }));
      return { ...c, participants: partsForConv };
    });

    return NextResponse.json(convsWithParticipants || []);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
