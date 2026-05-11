"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { matchArchetypes } from "@/lib/match";
import type {
  ArchetypeId,
  ArchetypeMatch,
  BiometricInput,
} from "@/lib/types";
import ChatPanel from "@/components/ChatPanel";
import StoryStudio from "@/components/StoryStudio";
import SilhouetteFallback from "@/components/SilhouetteFallback";
import ClusterScatter from "@/components/ClusterScatter";
import MyOlympianGraph from "@/components/MyOlympianGraph";
import {
  formatHeightImperialFromCm,
  formatWeightImperialFromKg,
} from "@/lib/units";

const ARCHETYPE_COLORS: Record<ArchetypeId, string> = {
  "reach-rhythm": "#5fb3b3",
  "compact-power": "#e85a4f",
  "aerobic-engine": "#7dd3a0",
  "precision-control": "#d4af37",
  "explosive-pivot": "#c084fc",
};

const AGE_BANDS: BiometricInput["ageBand"][] = ["youth", "20s", "30s", "40plus"];
const MOVEMENTS: BiometricInput["movement"][] = [
  "endurance",
  "power",
  "precision",
  "agility",
];

function clampNumber(raw: string | null, fallback: number, min: number, max: number): number {
  if (raw === null || raw.trim() === "") return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(n, min), max);
}

function pickEnum<T extends string>(raw: string | null, allowed: T[], fallback: T): T {
  if (raw && (allowed as string[]).includes(raw)) return raw as T;
  return fallback;
}

export default function ResultView() {
  const sp = useSearchParams();
  const input = useMemo<BiometricInput>(() => {
    return {
      heightCm: clampNumber(sp.get("h"), 178, 140, 220),
      weightKg: clampNumber(sp.get("w"), 75, 40, 160),
      ageBand: pickEnum(sp.get("a"), AGE_BANDS, "20s"),
      movement: pickEnum(sp.get("m"), MOVEMENTS, "endurance"),
    };
  }, [sp]);

  const result = useMemo(() => matchArchetypes(input), [input]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [paraLens, setParaLens] = useState(true);
  const paraLeading = paraLens;

  const active: ArchetypeMatch =
    result.allRanked.find((m) => m.archetype.id === activeId) ??
    result.paraFirstOrder[0];

  const heroIds = new Set(result.paraFirstOrder.map((m) => m.archetype.id));
  const otherArchetypes = result.allRanked.filter(
    (m) => !heroIds.has(m.archetype.id),
  );

  return (
    <main className="relative flex-1 px-6 py-12 pb-28 md:pb-12 md:pr-[calc(20rem+2.5rem)] max-w-6xl mx-auto w-full">
      <header className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.2em] text-stone-500 hover:text-stone-300"
        >
          ← My Olympian
        </Link>
        <p className="font-mono text-xs uppercase tracking-wider text-stone-500">
          {formatHeightImperialFromCm(input.heightCm)} ·{" "}
          {formatWeightImperialFromKg(input.weightKg)} · {labelAge(input.ageBand)} ·{" "}
          {labelMovement(input.movement)}
        </p>
      </header>

      <section>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-paralympic mb-3">
          Your Olympian story begins
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          You could align with{" "}
          <span
            className={
              result.paraFirstOrder[0].archetype.paraLeaning
                ? "text-paralympic"
                : "text-olympic"
            }
          >
            {result.paraFirstOrder[0].archetype.name}
          </span>
          {" "}and{" "}
          <span
            className={
              result.paraFirstOrder[1].archetype.paraLeaning
                ? "text-paralympic"
                : "text-olympic"
            }
          >
            {result.paraFirstOrder[1].archetype.name}
          </span>
          .
        </h1>
        <p className="mt-3 text-stone-400 max-w-2xl text-sm leading-relaxed">
          Two Team USA archetypes appear closest to the build you described.
          Both are shown with equal Olympic and Paralympic depth.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
        {result.paraFirstOrder.map((m, i) => (
          <ArchetypeCard
            key={m.archetype.id}
            match={m}
            active={active.archetype.id === m.archetype.id}
            onSelect={() => setActiveId(m.archetype.id)}
            isPrimary={i === 0}
          />
        ))}
      </section>

      <section className="mt-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-3">
          Also explore · the remaining three archetypes
        </p>
        <div className="flex flex-wrap gap-2">
          {otherArchetypes.map((m) => (
            <ArchetypePill
              key={m.archetype.id}
              match={m}
              active={active.archetype.id === m.archetype.id}
              color={ARCHETYPE_COLORS[m.archetype.id]}
              onSelect={() => setActiveId(m.archetype.id)}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-stone-500 leading-relaxed max-w-2xl">
          Tap any of the five to swap the story, timeline, and analyst chat.
          Olympic and Paralympic depth stays equal across all archetypes.
        </p>
      </section>

      <section className="mt-10">
        <ClusterScatter input={input} primaryArchetypeId={active.archetype.id} />
      </section>

      <section className="mt-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-3">
          Lens
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <LensToggle paraLens={paraLens} onChange={setParaLens} />
          <p className="text-xs text-stone-500 leading-relaxed max-w-xl">
            {paraLens
              ? "Paralympic lens opens the story, silhouette, and analyst prompts with Para sport families and classifications."
              : "Olympic lens opens with Olympic sport families while keeping Paralympic depth in the narrative and chat."}
          </p>
        </div>
      </section>

      <section className="mt-16">
        <SectionHeader
          eyebrow="Story"
          title={`Hear your story as ${active.archetype.name}.`}
        />
        <StoryStudio
          key={`${active.archetype.id}-${paraLeading ? "para" : "oly"}`}
          archetype={active.archetype}
          paraLeading={paraLeading}
        />
      </section>

      <section className="mt-16 mb-24 md:mb-12">
        <SectionHeader
          eyebrow="My Olympian"
          title={`${active.archetype.name} across 120 years of Team USA.`}
        />
        <MyOlympianGraph key={active.archetype.id} archetype={active.archetype} />
      </section>

      <aside
        className="hidden md:flex fixed top-24 right-6 bottom-6 z-40 w-80"
        aria-label="Analyst chat"
      >
        <ChatPanel
          key={`${active.archetype.id}-${paraLeading ? "para" : "oly"}`}
          archetype={active.archetype}
          paraLeading={paraLeading}
        />
      </aside>

      {!mobileChatOpen && (
        <button
          type="button"
          onClick={() => setMobileChatOpen(true)}
          className="md:hidden fixed bottom-5 right-5 z-40 rounded-full border border-paralympic/50 bg-[#0a0d14] px-4 py-3 text-sm font-medium text-stone-100 shadow-lg shadow-black/40"
        >
          Analyst chat
        </button>
      )}

      {mobileChatOpen && (
        <ChatPanel
          key={`${active.archetype.id}-${paraLeading ? "para" : "oly"}-mobile`}
          archetype={active.archetype}
          paraLeading={paraLeading}
          layout="drawer"
          onClose={() => setMobileChatOpen(false)}
        />
      )}
    </main>
  );
}

function LensToggle({
  paraLens,
  onChange,
}: {
  paraLens: boolean;
  onChange: (para: boolean) => void;
}) {
  return (
    <div
      className="inline-flex rounded-md border border-border bg-surface p-1"
      role="group"
      aria-label="Olympic or Paralympic lens"
    >
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
          paraLens
            ? "bg-paralympic/20 text-paralympic border border-paralympic/40"
            : "text-stone-400 hover:text-stone-200"
        }`}
        aria-pressed={paraLens}
      >
        Para lens
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
          !paraLens
            ? "bg-olympic/20 text-olympic border border-olympic/40"
            : "text-stone-400 hover:text-stone-200"
        }`}
        aria-pressed={!paraLens}
      >
        Olympic lens
      </button>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-500 mb-2">
        {eyebrow}
      </p>
      <h2 className="text-xl sm:text-2xl font-medium tracking-tight">{title}</h2>
    </div>
  );
}

function ArchetypeCard({
  match,
  active,
  onSelect,
  isPrimary,
}: {
  match: ArchetypeMatch;
  active: boolean;
  onSelect: () => void;
  isPrimary: boolean;
}) {
  const a = match.archetype;
  const accent = a.paraLeaning ? "paralympic" : "olympic";
  const eyebrow = isPrimary
    ? a.paraLeaning
      ? "First card · Paralympic-leaning"
      : "First card · Olympic-leaning"
    : a.paraLeaning
      ? "Second card · Paralympic-leaning"
      : "Second card · Olympic-leaning";
  return (
    <button
      onClick={onSelect}
      className={`text-left p-6 rounded-lg border transition-colors ${
        active
          ? "border-stone-200 bg-surface-2"
          : "border-border bg-surface hover:border-stone-700"
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className={`font-mono text-xs uppercase tracking-wider mb-1 text-${accent}`}>
            {eyebrow}
          </div>
          <h3 className="text-2xl font-semibold tracking-tight">{a.name}</h3>
          <p className="text-sm text-stone-400 mt-1">{a.tagline}</p>
        </div>
        <div className="font-mono text-xs text-stone-500 whitespace-nowrap">
          {(match.confidence * 100).toFixed(0)}% match
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-olympic mb-2">
            Olympic families
          </div>
          <ul className="space-y-1 text-stone-300">
            {a.olympicFamilies.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-paralympic mb-2">
            Paralympic families
          </div>
          <ul className="space-y-1 text-stone-300">
            {a.paralympicFamilies.map((p) => (
              <li key={p.sport}>
                {p.sport}{" "}
                <span className="text-stone-500">({p.classification})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-border">
        <SilhouetteFallback archetypeId={a.id} small />
      </div>
    </button>
  );
}

function ArchetypePill({
  match,
  active,
  color,
  onSelect,
}: {
  match: ArchetypeMatch;
  active: boolean;
  color: string;
  onSelect: () => void;
}) {
  const a = match.archetype;
  const accent = a.paraLeaning ? "paralympic" : "olympic";
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`group inline-flex items-center gap-2.5 pl-3 pr-3.5 py-2 rounded-md border text-sm transition-colors ${
        active
          ? "border-stone-200 bg-surface-2 text-stone-100"
          : "border-border bg-surface text-stone-300 hover:border-stone-600 hover:text-stone-100"
      }`}
    >
      <span
        className="size-2 rounded-full shrink-0"
        style={{ background: color }}
        aria-hidden="true"
      />
      <span className="font-medium">{a.name}</span>
      <span
        className={`font-mono text-[10px] uppercase tracking-wider text-${accent}`}
      >
        {a.paraLeaning ? "Para-leaning" : "Olympic-leaning"}
      </span>
      <span className="font-mono text-[11px] text-stone-500">
        {(match.confidence * 100).toFixed(0)}%
      </span>
    </button>
  );
}

function labelAge(a: BiometricInput["ageBand"]) {
  return { youth: "<20", "20s": "20s", "30s": "30s", "40plus": "40+" }[a];
}
function labelMovement(m: BiometricInput["movement"]) {
  return m.charAt(0).toUpperCase() + m.slice(1);
}
