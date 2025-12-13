import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json([], { status: 200 });

    const { data: requests } = await supabase
      .from("connection_requests")
      .select("*")
      .eq("receiver_id", user.id)
      .eq("status", "pending");

    const requesterIds = (requests || []).map((r: any) => r.requester_id).filter(Boolean);
    let usersMap: Record<string, any> = {};
    if (requesterIds.length > 0) {
      const { data: users } = await supabase.from("users").select("id, name, avatar_url").in("id", requesterIds);
      usersMap = (users || []).reduce((acc: any, u: any) => ({ ...acc, [u.id]: u }), {});
    }

    const enriched = (requests || []).map((r: any) => ({
      ...r,
      requester: usersMap[r.requester_id] || null,
    }));

    return NextResponse.json(enriched || []);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
