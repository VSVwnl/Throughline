"use client";

import { useEffect, useRef, useState } from "react";
import type { Archetype } from "@/lib/types";
import type { ChatTurn } from "@/lib/gemini";

export default function ChatPanel({
  archetype,
  onClose,
}: {
  archetype: Archetype;
  onClose: () => void;
}) {
  const suggestions = archetype.chatSuggestions;
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
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archetypeId: archetype.id, messages: next }),
      });
      const d = (await r.json()) as { reply?: string };
      setMessages([...next, { role: "model", text: d.reply ?? "(no response)" }]);
    } catch (err) {
      setMessages([
        ...next,
        {
          role: "model",
          text: `Sorry, that failed: ${err instanceof Error ? err.message : String(err)}`,
        },
      ]);
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
              Equal depth for Olympic + Paralympic context.
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
          {busy && (
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
