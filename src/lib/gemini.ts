import type { Archetype } from "@/lib/types";

const MODEL_TEXT = process.env.GEMINI_CHAT_MODEL ?? "gemini-2.5-flash";
const MODEL_NARRATIVE =
  process.env.GEMINI_NARRATIVE_MODEL ?? "gemini-2.5-pro";
const MODEL_TTS = process.env.GEMINI_TTS_MODEL ?? "gemini-2.5-flash-preview-tts";
const MODEL_IMAGE =
  process.env.GEMINI_IMAGE_MODEL ?? "imagen-4.0-generate-001";

const SYSTEM_RULES = `You are the Throughline analyst for Team USA.

Hard rules — never break these:
1. Use conditional phrasing only ("could align with", "historically appears near", "may resemble"). Never "you should", "you will", or any guarantee.
2. Paralympic and Olympic responses must be the same length and analytical depth.
3. Never name a specific real athlete. Refer only to sport families, classifications, and eras.
4. Refuse questions that ask for performance predictions, training prescriptions, or medical advice.
5. Do not invent data. If unsure, say so plainly.`;

function hasApiKey(): boolean {
  return !!process.env.GEMINI_API_KEY || !!process.env.GOOGLE_API_KEY;
}

async function getClient() {
  const mod = await import("@google/genai");
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  return new mod.GoogleGenAI({ apiKey });
}

export type NarrativeRequest = {
  archetype: Archetype;
  paraLeading: boolean;
};

function mockNarrative({ archetype, paraLeading }: NarrativeRequest): string {
  const para = archetype.paralympicFamilies[0];
  const oly = archetype.olympicFamilies[0];
  const first = paraLeading
    ? `In Paralympic ${para?.sport ?? "history"} (${para?.classification ?? ""}), the ${archetype.name} pattern historically appears near US athletes who combine ${archetype.movementVibe.toLowerCase()}.`
    : `In Olympic ${oly} history, the ${archetype.name} pattern has long appeared among US athletes whose builds favor ${archetype.movementVibe.toLowerCase()}.`;
  const second = paraLeading
    ? `On the Olympic side, the same pattern could align with ${oly} families across multiple eras of Team USA participation.`
    : `On the Paralympic side, this pattern could align with ${para?.sport ?? "Para sport"} (${para?.classification ?? "classification varies"}), with US programs developing across recent cycles.`;
  return `${first} ${second} Across roughly 120 years, the ${archetype.name.toLowerCase()} build has surfaced in Team USA wherever ${archetype.movementVibe.toLowerCase()} mattered — a throughline you can follow without anyone needing to be a champion to belong to it.`;
}

export async function generateNarrative(req: NarrativeRequest): Promise<string> {
  if (!hasApiKey()) return mockNarrative(req);
  try {
    const ai = await getClient();
    const prompt = `${SYSTEM_RULES}

Write a 90–110 word personalized "throughline" narrative for a Team USA fan whose archetype is "${req.archetype.name}".
Build profile: ${req.archetype.buildProfile}
Movement vibe: ${req.archetype.movementVibe}
Olympic sport families: ${req.archetype.olympicFamilies.join(", ")}
Paralympic sport families: ${req.archetype.paralympicFamilies.map((p) => `${p.sport} (${p.classification})`).join(", ")}

The narrative must:
- Open with a ${req.paraLeading ? "Paralympic" : "Olympic"} reference, then move to the other side with equal depth.
- Reference specific eras (e.g. 1960s, 1980s, 2010s, 2020s) without naming individual athletes.
- Use conditional phrasing throughout.
- End with a sentence about how the archetype "could align with" Team USA across 120 years.`;

    const res = await ai.models.generateContent({
      model: MODEL_NARRATIVE,
      contents: prompt,
    });
    return res.text ?? mockNarrative(req);
  } catch (err) {
    console.warn("[gemini] narrative fell back to mock:", err);
    return mockNarrative(req);
  }
}

export type ChatTurn = { role: "user" | "model"; text: string };

function mockChat(messages: ChatTurn[], archetype: Archetype): string {
  const last = messages[messages.length - 1]?.text ?? "";
  const para = archetype.paralympicFamilies[0];
  return `Good question. For the ${archetype.name} archetype, the ${archetype.olympicFamilies[0]} family historically appears across multiple Olympic cycles, and the ${para?.sport ?? "matched Para sport"} family (${para?.classification ?? ""}) appears with comparable depth in Paralympic competition. (You asked: "${last.slice(0, 80)}…") Note: this is mock content — set GEMINI_API_KEY to enable the live agent.`;
}

export async function chatReply(
  messages: ChatTurn[],
  archetype: Archetype,
): Promise<string> {
  if (!hasApiKey()) return mockChat(messages, archetype);
  try {
    const ai = await getClient();
    const context = `${SYSTEM_RULES}

You are answering questions for a fan whose archetype is "${archetype.name}".
Olympic sport families: ${archetype.olympicFamilies.join(", ")}
Paralympic sport families: ${archetype.paralympicFamilies.map((p) => `${p.sport} (${p.classification})`).join(", ")}
Always include both Olympic and Paralympic context when relevant, with equal depth.`;

    const res = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: [
        { role: "user", parts: [{ text: context }] },
        ...messages.map((m) => ({
          role: m.role === "model" ? "model" : "user",
          parts: [{ text: m.text }],
        })),
      ],
    });
    return res.text ?? mockChat(messages, archetype);
  } catch (err) {
    console.warn("[gemini] chat fell back to mock:", err);
    return mockChat(messages, archetype);
  }
}

export type AudioResult =
  | { kind: "audio"; mimeType: string; base64: string }
  | { kind: "mock"; text: string };

export async function generateNarrationAudio(text: string): Promise<AudioResult> {
  if (!hasApiKey()) return { kind: "mock", text };
  try {
    const ai = await getClient();
    const res = await ai.models.generateContent({
      model: MODEL_TTS,
      contents: text,
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" },
          },
        },
      },
    });
    const part = res.candidates?.[0]?.content?.parts?.[0];
    const inline = part?.inlineData;
    if (inline?.data && inline.mimeType) {
      return { kind: "audio", mimeType: inline.mimeType, base64: inline.data };
    }
    return { kind: "mock", text };
  } catch (err) {
    console.warn("[gemini] tts fell back to mock:", err);
    return { kind: "mock", text };
  }
}

export type ImageResult =
  | { kind: "image"; mimeType: string; base64: string }
  | { kind: "mock"; archetypeId: string };

export async function generateSilhouette(archetype: Archetype): Promise<ImageResult> {
  if (!hasApiKey()) return { kind: "mock", archetypeId: archetype.id };
  try {
    const ai = await getClient();
    const prompt = `An abstract, stylized silhouette representing the "${archetype.name}" Team USA athlete archetype: ${archetype.buildProfile}. Movement vibe: ${archetype.movementVibe}. Flat geometric design, single accent color on a deep navy background (#0a0d14), no faces, no text, no logos, no real people, no identifying features, square 1:1 aspect ratio, museum-infographic style.`;

    const isImagen = MODEL_IMAGE.startsWith("imagen");
    if (isImagen) {
      const res = await ai.models.generateImages({
        model: MODEL_IMAGE,
        prompt,
        config: { numberOfImages: 1, aspectRatio: "1:1" },
      });
      const img = res.generatedImages?.[0]?.image;
      if (img?.imageBytes) {
        return {
          kind: "image",
          mimeType: img.mimeType ?? "image/png",
          base64: img.imageBytes,
        };
      }
    } else {
      const res = await ai.models.generateContent({
        model: MODEL_IMAGE,
        contents: prompt,
        config: { responseModalities: ["IMAGE"] },
      });
      const parts = res.candidates?.[0]?.content?.parts ?? [];
      for (const part of parts) {
        const inline = part?.inlineData;
        if (inline?.data && inline.mimeType?.startsWith("image/")) {
          return {
            kind: "image",
            mimeType: inline.mimeType,
            base64: inline.data,
          };
        }
      }
    }
    return { kind: "mock", archetypeId: archetype.id };
  } catch (err) {
    console.warn("[gemini] image fell back to mock:", err);
    return { kind: "mock", archetypeId: archetype.id };
  }
}

export const __MODELS = {
  text: MODEL_TEXT,
  narrative: MODEL_NARRATIVE,
  tts: MODEL_TTS,
  image: MODEL_IMAGE,
};
