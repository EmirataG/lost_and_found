import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> },
) {
  try {
    const { id: convId } = await params;
    const supabase = await createClient();
    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });

    return NextResponse.json(messages || []);
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> },
) {
  try {
    const { id: convId } = await params;
    const body = await request.json();
    const { body: text } = body;
    if (!text || String(text).trim() === "") {
      return NextResponse.json(
        { error: "Missing body" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    // ensure user is participant
    const { data: part } = await supabase
      .from("conversation_participants")
      .select("*")
      .eq("conversation_id", convId)
      .eq("user_id", user.id)
      .single();
    if (!part)
      return NextResponse.json({ error: "Not a participant" }, { status: 403 });

    const { data } = await supabase
      .from("messages")
      .insert({
        conversation_id: convId,
        sender_id: user.id,
        body: text || null,
      })
      .select()
      .single();

    // update conversation last_message_at
    await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", convId);

    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
