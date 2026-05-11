"use client";

import { useEffect, useRef, useState } from "react";
import type { Archetype } from "@/lib/types";
import type { ChatTurn } from "@/lib/gemini";

export default function ChatPanel({
  archetype,
  paraLeading,
  onClose,
}: {
  archetype: Archetype;
  paraLeading: boolean;
  onClose: () => void;
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

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="w-full max-w-md h-full bg-[#0a0d14] border-l border-border flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500">
              Analyst chat · {archetype.name}
            </div>
            <div className="text-sm font-medium mt-1">
              {paraLeading ? "Paralympic" : "Olympic"} lens · equal depth for both sides.
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-100 text-sm"
          >
            Close ✕
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="space-y-2">
              <p className="text-xs text-stone-500 mb-2">
                Try one of these about {archetype.name}:
              </p>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="block w-full text-left text-sm border border-border rounded-md px-3 py-2 hover:border-stone-600 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`text-sm leading-relaxed rounded-md px-3 py-2 ${
                m.role === "user"
                  ? "bg-surface-2 border border-border"
                  : "bg-transparent border border-paralympic/40"
              }`}
            >
              <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                {m.role === "user" ? "You" : "Analyst"}
              </div>
              {m.text}
            </div>
          ))}
          {busy &&
            messages.length > 0 &&
            messages[messages.length - 1]?.role === "model" &&
            messages[messages.length - 1]?.text === "" && (
              <p className="text-xs text-stone-500 font-mono">Analyst thinking…</p>
            )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-border px-4 py-3 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about an era, a classification, or this archetype…"
            className="flex-1 bg-surface border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-paralympic"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="px-4 py-2 rounded-md bg-stone-100 text-[#0a0d14] font-medium text-sm disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
