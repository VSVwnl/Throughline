import { NextResponse } from "next/server";
import { ARCHETYPE_BY_ID } from "@/data/archetypes";
import { chatReply, type ChatTurn } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    archetypeId?: string;
    messages?: ChatTurn[];
  };

  const archetype = body.archetypeId ? ARCHETYPE_BY_ID[body.archetypeId] : undefined;
  if (!archetype) {
    return NextResponse.json({ error: "Unknown archetype" }, { status: 400 });
  }
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const reply = await chatReply(messages, archetype);
  return NextResponse.json({ reply });
}
