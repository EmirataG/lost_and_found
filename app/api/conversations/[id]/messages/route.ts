import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request, { params }: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    const convId = (await params).id;
    const supabase = await createClient();
    const { data: messages } = await supabase.from("messages").select("*").eq("conversation_id", convId).order("created_at", { ascending: true });

    // fetch attachments for these messages
    const messageIds = (messages || []).map((m: any) => m.id).filter(Boolean);
    let attachments: any[] = [];
    if (messageIds.length > 0) {
      const { data: atts } = await supabase.from("message_attachments").select("*").in("message_id", messageIds);
      attachments = atts || [];
    }

    const byMessage: Record<string, any[]> = {};
    attachments.forEach((a: any) => {
      byMessage[a.message_id] = byMessage[a.message_id] || [];
      byMessage[a.message_id].push(a);
    });

    const enriched = (messages || []).map((m: any) => ({ ...m, attachments: byMessage[m.id] || [] }));

    return NextResponse.json(enriched || []);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    const convId = (await params).id;
    const body = await request.json();
    const { body: text } = body;
    const attachments = body.attachments || [];
      // allow messages that have body or attachments
      if ((!text || String(text).trim() === "") && (!attachments || attachments.length === 0)) {
        return NextResponse.json({ error: "Missing body or attachments" }, { status: 400 });
      }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    // ensure user is participant
    const { data: part } = await supabase.from("conversation_participants").select("*").eq("conversation_id", convId).eq("user_id", user.id).single();
    if (!part) return NextResponse.json({ error: "Not a participant" }, { status: 403 });

      const { data } = await supabase.from("messages").insert({ conversation_id: convId, sender_id: user.id, body: text || null }).select().single();

    // insert attachments if provided (attachments should include url, filename, content_type)
    if (attachments && attachments.length > 0 && data && data.id) {
      const rows = attachments.map((a: any) => ({ message_id: data.id, url: a.url, filename: a.filename || a.name || null, content_type: a.content_type || a.mime || null }));
      await supabase.from("message_attachments").insert(rows);
      // fetch inserted attachments and attach to response
      const { data: inserted } = await supabase.from("message_attachments").select("*").eq("message_id", data.id);
      (data as any).attachments = inserted || [];
    } else {
      (data as any).attachments = [];
    }

    // update conversation last_message_at
    await supabase.from("conversations").update({ last_message_at: new Date().toISOString() }).eq("id", convId);

    return NextResponse.json(data);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
