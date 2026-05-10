import { NextResponse } from "next/server";
import { ARCHETYPE_BY_ID } from "@/data/archetypes";
import { generateNarrative } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    archetypeId?: string;
    paraLeading?: boolean;
  };

  const archetype = body.archetypeId ? ARCHETYPE_BY_ID[body.archetypeId] : undefined;
  if (!archetype) {
    return NextResponse.json({ error: "Unknown archetype" }, { status: 400 });
  }

  const text = await generateNarrative({
    archetype,
    paraLeading: body.paraLeading ?? archetype.paraLeaning,
  });

  return NextResponse.json({ text });
}
