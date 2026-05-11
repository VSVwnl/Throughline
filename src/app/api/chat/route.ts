import { ARCHETYPE_BY_ID } from "@/data/archetypes";
import { streamChatReply, type ChatTurn } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    archetypeId?: string;
    messages?: ChatTurn[];
    paraLeading?: boolean;
  };

  const archetype = body.archetypeId ? ARCHETYPE_BY_ID[body.archetypeId] : undefined;
  if (!archetype) {
    return new Response(JSON.stringify({ error: "Unknown archetype" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const paraLeading = body.paraLeading ?? archetype.paraLeaning;
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const delta of streamChatReply(messages, archetype, {
          signal: req.signal,
          paraLeading,
        })) {
          if (req.signal.aborted) break;
          controller.enqueue(encoder.encode(delta));
        }
      } finally {
        try {
          controller.close();
        } catch {
          // ignore double-close / abort races
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
