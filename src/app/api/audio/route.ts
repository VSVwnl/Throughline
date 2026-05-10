import { NextResponse } from "next/server";
import { generateNarrationAudio } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { text?: string };
  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }
  const result = await generateNarrationAudio(text);
  return NextResponse.json(result);
}
