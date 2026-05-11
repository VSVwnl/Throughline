"use client";

import { useEffect, useRef, useState } from "react";
import type { Archetype } from "@/lib/types";
import type { ChatTurn } from "@/lib/gemini";

export default function ChatPanel({
  archetype,
  paraLeading,
  onClose,
  layout = "docked",
}: {
  archetype: Archetype;
  paraLeading: boolean;
  onClose?: () => void;
  layout?: "docked" | "drawer";
}) {
  const suggestions = paraLeading
    ? archetype.chatSuggestionsPara
    : archetype.chatSuggestionsOlympic;
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim()) return;
    const next: ChatTurn[] = [...messages, { role: "user", text }];
    const assistantIndex = next.length;
    setMessages([...next, { role: "model", text: "" }]);
    setInput("");
    setBusy(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          archetypeId: archetype.id,
          messages: next,
          paraLeading,
        }),
      });
      const ct = r.headers.get("content-type") ?? "";
      if (!r.ok) {
        let errMsg = `Request failed (${r.status})`;
        if (ct.includes("application/json")) {
          const j = (await r.json()) as { error?: string };
          if (j.error) errMsg = j.error;
        }
        setMessages((prev) => {
          const copy = [...prev];
          if (copy[assistantIndex]?.role === "model") {
            copy[assistantIndex] = { role: "model", text: errMsg };
          }
          return copy;
        });
        return;
      }
      if (!r.body) {
        setMessages((prev) => {
          const copy = [...prev];
          if (copy[assistantIndex]?.role === "model") {
            copy[assistantIndex] = { role: "model", text: "(no response body)" };
          }
          return copy;
        });
        return;
      }
      const reader = r.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          if (copy[assistantIndex]?.role === "model") {
            copy[assistantIndex] = { role: "model", text: acc };
          }
          return copy;
        });
      }
      if (!acc.trim()) {
        setMessages((prev) => {
          const copy = [...prev];
          if (copy[assistantIndex]?.role === "model") {
            copy[assistantIndex] = { role: "model", text: "(no response)" };
          }
          return copy;
        });
      }
    } catch (err) {
      setMessages((prev) => {
        const copy = [...prev];
        if (copy[assistantIndex]?.role === "model") {
          copy[assistantIndex] = {
            role: "model",
            text: `Sorry, that failed: ${err instanceof Error ? err.message : String(err)}`,
          };
        }
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }

  const panel = (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-[#0a0d14] shadow-2xl shadow-black/50">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500">
            Analyst chat · {archetype.name}
          </div>
          <div className="mt-1 text-sm font-medium leading-snug">
            {paraLeading ? "Paralympic" : "Olympic"} lens · equal depth for both sides.
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-sm text-stone-500 hover:text-stone-100"
          >
            Close ✕
          </button>
        )}
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="mb-2 text-xs text-stone-500">
              Try one of these about {archetype.name}:
            </p>
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="block w-full rounded-md border border-border px-3 py-2 text-left text-sm transition-colors hover:border-stone-600"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-md px-3 py-2 text-sm leading-relaxed ${
              m.role === "user"
                ? "border border-border bg-surface-2"
                : "border border-paralympic/40 bg-transparent"
            }`}
          >
            <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-stone-500">
              {m.role === "user" ? "You" : "Analyst"}
            </div>
            {m.text}
          </div>
        ))}
        {busy &&
          messages.length > 0 &&
          messages[messages.length - 1]?.role === "model" &&
          messages[messages.length - 1]?.text === "" && (
            <p className="font-mono text-xs text-stone-500">Analyst thinking…</p>
          )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex shrink-0 gap-2 border-t border-border px-3 py-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about an era, a classification, or this archetype…"
          className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-paralympic focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-md bg-stone-100 px-4 py-2 text-sm font-medium text-[#0a0d14] disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );

  if (layout === "drawer") {
    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
        <div className="h-full w-full max-w-md">{panel}</div>
      </div>
    );
  }

  return panel;
}
