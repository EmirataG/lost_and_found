import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Disabled: server upsert was reverted" }, { status: 501 });
}
