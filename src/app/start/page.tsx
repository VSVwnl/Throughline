"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HEIGHT_IN_DEFAULT,
  HEIGHT_IN_MAX,
  HEIGHT_IN_MIN,
  WEIGHT_LB_DEFAULT,
  WEIGHT_LB_MAX,
  WEIGHT_LB_MIN,
  formatHeightImperial,
  formatWeightImperial,
  inchesToCm,
  lbsToKg,
} from "@/lib/units";

const MOVEMENTS = [
  { id: "endurance", label: "Endurance", hint: "Sustain a long, even effort" },
  { id: "power", label: "Power", hint: "Deliver one big, explosive output" },
  { id: "precision", label: "Precision", hint: "Hit exactly the same spot, again" },
  { id: "agility", label: "Agility", hint: "Change direction at speed" },
] as const;

const AGE_BANDS = [
  { id: "youth", label: "Under 20" },
  { id: "20s", label: "20s" },
  { id: "30s", label: "30s" },
  { id: "40plus", label: "40+" },
] as const;

export default function StartPage() {
  const router = useRouter();
  const [heightIn, setHeightIn] = useState(HEIGHT_IN_DEFAULT);
  const [weightLb, setWeightLb] = useState(WEIGHT_LB_DEFAULT);
  const [ageBand, setAgeBand] = useState<string>("20s");
  const [movement, setMovement] = useState<string>("endurance");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      h: String(inchesToCm(heightIn)),
      w: String(lbsToKg(weightLb)),
      a: ageBand,
      m: movement,
    });
    router.push(`/result?${params.toString()}`);
  }

  return (
    <main className="flex flex-1 items-start justify-center px-6 py-16">
      <div className="w-full max-w-2xl">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.2em] text-stone-500 hover:text-stone-300"
        >
          ← My Olympian
        </Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          Tell us a few things about your build.
        </h1>
        <p className="mt-3 text-stone-400 text-sm leading-relaxed max-w-xl">
          We&apos;ll match these to one of five Team USA archetypes. Nothing is
          stored, nothing is shared. No login, no account.
        </p>

        <form onSubmit={onSubmit} className="mt-10 grid gap-8">
          <Field
            label="Height"
            value={formatHeightImperial(heightIn)}
            hint={`${formatHeightImperial(HEIGHT_IN_MIN)} – ${formatHeightImperial(HEIGHT_IN_MAX)}`}
          >
            <input
              type="range"
              min={HEIGHT_IN_MIN}
              max={HEIGHT_IN_MAX}
              value={heightIn}
              onChange={(e) => setHeightIn(Number(e.target.value))}
              className="w-full accent-paralympic"
            />
          </Field>

          <Field
            label="Weight"
            value={formatWeightImperial(weightLb)}
            hint={`${formatWeightImperial(WEIGHT_LB_MIN)} – ${formatWeightImperial(WEIGHT_LB_MAX)}`}
          >
            <input
              type="range"
              min={WEIGHT_LB_MIN}
              max={WEIGHT_LB_MAX}
              value={weightLb}
              onChange={(e) => setWeightLb(Number(e.target.value))}
              className="w-full accent-olympic"
            />
          </Field>

          <Field label="Age band">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AGE_BANDS.map((b) => (
                <Chip
                  key={b.id}
                  active={ageBand === b.id}
                  onClick={() => setAgeBand(b.id)}
                >
                  {b.label}
                </Chip>
              ))}
            </div>
          </Field>

          <Field label="Movement preference">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MOVEMENTS.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMovement(m.id)}
                  className={`text-left p-4 rounded-md border transition-colors ${
                    movement === m.id
                      ? "border-paralympic bg-surface-2"
                      : "border-border hover:border-stone-600 bg-surface"
                  }`}
                >
                  <div className="font-medium">{m.label}</div>
                  <div className="text-xs text-stone-500 mt-1">{m.hint}</div>
                </button>
              ))}
            </div>
          </Field>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="px-5 py-3 rounded-md bg-stone-100 text-[#0a0d14] font-medium hover:bg-white transition-colors"
            >
              Find my archetype →
            </button>
            <p className="text-xs text-stone-500">
              Result uses conditional phrasing only — no guarantees.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  hint,
  children,
}: {
  label: string;
  value?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <label className="font-mono text-xs uppercase tracking-wider text-stone-400">
          {label}
        </label>
        {value && <span className="text-sm font-medium">{value}</span>}
      </div>
      {children}
      {hint && <div className="mt-2 text-xs text-stone-600">{hint}</div>}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm border transition-colors ${
        active
          ? "border-paralympic bg-surface-2 text-stone-100"
          : "border-border bg-surface text-stone-400 hover:border-stone-600"
      }`}
    >
      {children}
    </button>
  );
}
