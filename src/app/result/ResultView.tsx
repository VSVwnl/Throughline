"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { matchArchetypes } from "@/lib/match";
import type {
  Archetype,
  ArchetypeId,
  ArchetypeMatch,
  BiometricInput,
  Era,
} from "@/lib/types";
import ChatPanel from "@/components/ChatPanel";
import StoryStudio from "@/components/StoryStudio";
import SilhouetteFallback from "@/components/SilhouetteFallback";
import ClusterScatter from "@/components/ClusterScatter";

const ARCHETYPE_COLORS: Record<ArchetypeId, string> = {
  "reach-rhythm": "#5fb3b3",
  "compact-power": "#e85a4f",
  "aerobic-engine": "#7dd3a0",
  "precision-control": "#d4af37",
  "explosive-pivot": "#c084fc",
};

export default function ResultView() {
  const sp = useSearchParams();
  const input = useMemo<BiometricInput>(() => {
    return {
      heightCm: Number(sp.get("h") ?? 178),
      weightKg: Number(sp.get("w") ?? 75),
      ageBand: (sp.get("a") as BiometricInput["ageBand"]) ?? "20s",
      movement:
        (sp.get("m") as BiometricInput["movement"]) ?? "endurance",
    };
  }, [sp]);

  const result = useMemo(() => matchArchetypes(input), [input]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const active: ArchetypeMatch =
    result.allRanked.find((m) => m.archetype.id === activeId) ??
    result.paraFirstOrder[0];

  const heroIds = new Set(result.paraFirstOrder.map((m) => m.archetype.id));
  const otherArchetypes = result.allRanked.filter(
    (m) => !heroIds.has(m.archetype.id),
  );

  return (
    <main className="flex-1 px-6 py-12 max-w-6xl mx-auto w-full">
      <header className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.2em] text-stone-500 hover:text-stone-300"
        >
          ← Throughline
        </Link>
        <p className="font-mono text-xs uppercase tracking-wider text-stone-500">
          {input.heightCm}cm · {input.weightKg}kg · {labelAge(input.ageBand)} ·{" "}
          {labelMovement(input.movement)}
        </p>
      </header>

      <section>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-paralympic mb-3">
          Your throughline begins
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
          Tap any of the five to swap the story, timeline, and analyst chat
          below. Olympic and Paralympic depth stays equal across all archetypes.
        </p>
      </section>

      <section className="mt-10">
        <ClusterScatter input={input} primaryArchetypeId={active.archetype.id} />
      </section>

      <section className="mt-16">
        <SectionHeader
          eyebrow="Story"
          title={`Hear your throughline as ${active.archetype.name}.`}
        />
        <StoryStudio
          key={active.archetype.id}
          archetype={active.archetype}
          paraLeading={active.archetype.paraLeaning}
        />
      </section>

      <section className="mt-16">
        <SectionHeader
          eyebrow="Timeline"
          title={`${active.archetype.name} across 120 years of Team USA.`}
        />
        <Timeline archetype={active.archetype} />
      </section>

      <section className="mt-16 mb-24">
        <SectionHeader
          eyebrow="Ask the analyst"
          title="Have a question about this archetype, an era, or a Paralympic classification?"
        />
        <button
          onClick={() => setChatOpen(true)}
          className="px-5 py-3 rounded-md bg-stone-100 text-[#0a0d14] font-medium hover:bg-white transition-colors"
        >
          Open analyst chat →
        </button>
      </section>

      {chatOpen && (
        <ChatPanel
          key={active.archetype.id}
          archetype={active.archetype}
          onClose={() => setChatOpen(false)}
        />
      )}
    </main>
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

function Timeline({ archetype }: { archetype: Archetype }) {
  return (
    <ol className="border-l border-border ml-2">
      {archetype.eras.map((era) => (
        <EraRow key={era.decade} era={era} />
      ))}
    </ol>
  );
}

function EraRow({ era }: { era: Era }) {
  return (
    <li className="relative pl-6 pb-10">
      <span className="absolute -left-[5px] top-2 size-[10px] rounded-full bg-stone-100" />
      <div className="font-mono text-xs uppercase tracking-wider text-stone-500">
        {era.decade}
      </div>
      <div className="text-lg font-medium mt-1">{era.yearLabel}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <EraColumn tone="olympic" title="Olympic">
          <ul className="space-y-3">
            {era.olympic.map((entry, i) => (
              <li key={i}>
                <div className="text-sm font-medium">{entry.sportFamily}</div>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  {entry.note}
                </p>
              </li>
            ))}
          </ul>
        </EraColumn>

        <EraColumn tone="paralympic" title="Paralympic">
          {Array.isArray(era.paralympic) ? (
            <ul className="space-y-3">
              {era.paralympic.map((entry, i) => (
                <li key={i}>
                  <div className="text-sm font-medium">
                    {entry.sportFamily}{" "}
                    <span className="font-mono text-[11px] text-stone-500">
                      {entry.classification}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                    {entry.note}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <div className="text-sm font-medium">Pre-1960</div>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                {era.paralympic.note}
              </p>
            </div>
          )}
        </EraColumn>
      </div>
    </li>
  );
}

function EraColumn({
  tone,
  title,
  children,
}: {
  tone: "olympic" | "paralympic";
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-border bg-surface p-4">
      <div
        className={`font-mono text-[10px] uppercase tracking-wider mb-3 text-${tone}`}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function labelAge(a: BiometricInput["ageBand"]) {
  return { youth: "<20", "20s": "20s", "30s": "30s", "40plus": "40+" }[a];
}
function labelMovement(m: BiometricInput["movement"]) {
  return m.charAt(0).toUpperCase() + m.slice(1);
}
