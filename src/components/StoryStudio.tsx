"use client";

import { useEffect, useState } from "react";
import type { Archetype } from "@/lib/types";
import SilhouetteFallback from "./SilhouetteFallback";

type AudioState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready"; src: string }
  | { kind: "mock"; text: string }
  | { kind: "error"; message: string };

type ImageState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready"; src: string }
  | { kind: "mock" };

export default function StoryStudio({
  archetype,
  paraLeading,
}: {
  archetype: Archetype;
  paraLeading: boolean;
}) {
  const [narrative, setNarrative] = useState<string>("");
  const [audio, setAudio] = useState<AudioState>({ kind: "idle" });
  const [image, setImage] = useState<ImageState>({ kind: "loading" });

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/narrative", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archetypeId: archetype.id, paraLeading }),
      signal: ctrl.signal,
    })
      .then((r) => r.json())
      .then((d: { text?: string }) => {
        if (d.text) setNarrative(d.text);
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [archetype.id, paraLeading]);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/silhouette", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archetypeId: archetype.id }),
      signal: ctrl.signal,
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.kind === "image") {
          setImage({
            kind: "ready",
            src: `data:${d.mimeType};base64,${d.base64}`,
          });
        } else {
          setImage({ kind: "mock" });
        }
      })
      .catch(() => setImage({ kind: "mock" }));
    return () => ctrl.abort();
  }, [archetype.id]);

  async function playAudio() {
    if (!narrative) return;
    setAudio({ kind: "loading" });
    try {
      const r = await fetch("/api/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: narrative }),
      });
      const d = await r.json();
      if (d?.kind === "audio") {
        const src = pcmBase64ToWavDataUrl(d.base64, d.mimeType);
        setAudio({ kind: "ready", src });
      } else {
        setAudio({ kind: "mock", text: d?.text ?? narrative });
      }
    } catch (err) {
      setAudio({
        kind: "error",
        message: err instanceof Error ? err.message : "Audio failed",
      });
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
      <div>
        {image.kind === "ready" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.src}
            alt={`${archetype.name} silhouette card`}
            width={200}
            height={200}
            className="rounded-md border border-border bg-[#080a10]"
          />
        ) : (
          <SilhouetteFallback archetypeId={archetype.id} />
        )}
        {image.kind !== "ready" && (
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-stone-600">
            {image.kind === "loading" ? "Generating silhouette…" : "Silhouette · fallback"}
          </p>
        )}
      </div>

      <div>
        <div className="rounded-md border border-border bg-surface p-5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500 mb-3">
            Throughline narrative
          </div>
          <p className="text-stone-200 leading-relaxed text-[15px]">
            {narrative || "Generating your throughline…"}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={playAudio}
            disabled={!narrative || audio.kind === "loading"}
            className="px-4 py-2 rounded-md border border-stone-300 text-stone-100 hover:bg-surface-2 transition-colors text-sm disabled:opacity-40"
          >
            {audio.kind === "loading"
              ? "Generating audio…"
              : audio.kind === "ready"
                ? "Replay audio"
                : "Hear your throughline"}
          </button>

          {audio.kind === "ready" && (
            <audio src={audio.src} controls autoPlay className="h-9">
              <track kind="captions" />
            </audio>
          )}
          {audio.kind === "mock" && (
            <span className="text-xs text-stone-500">
              Audio mocked · set GEMINI_API_KEY for live TTS
            </span>
          )}
          {audio.kind === "error" && (
            <span className="text-xs text-olympic">
              {audio.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function pcmBase64ToWavDataUrl(base64: string, mimeType: string): string {
  if (!mimeType.includes("pcm") && !mimeType.includes("L16")) {
    return `data:${mimeType};base64,${base64}`;
  }
  const sampleRateMatch = mimeType.match(/rate=(\d+)/);
  const sampleRate = sampleRateMatch ? Number(sampleRateMatch[1]) : 24000;
  const pcm = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;

  const buffer = new ArrayBuffer(44 + pcm.length);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + pcm.length, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, "data");
  view.setUint32(40, pcm.length, true);

  new Uint8Array(buffer, 44).set(pcm);

  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const b64 = btoa(binary);
  return `data:audio/wav;base64,${b64}`;
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}
