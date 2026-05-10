import type { ArchetypeId } from "@/lib/types";

const SHAPES: Record<ArchetypeId, { fill: string; path: string; label: string }> = {
  "reach-rhythm": {
    fill: "#5fb3b3",
    label: "Reach & Rhythm",
    path: "M50 8 L62 28 L60 60 L70 92 L60 92 L52 64 L48 64 L40 92 L30 92 L40 60 L38 28 Z",
  },
  "compact-power": {
    fill: "#e85a4f",
    label: "Compact Power",
    path: "M50 14 L66 30 L64 60 L72 84 L60 84 L54 64 L46 64 L40 84 L28 84 L36 60 L34 30 Z",
  },
  "aerobic-engine": {
    fill: "#7dd3a0",
    label: "Aerobic Engine",
    path: "M50 10 L60 30 L56 64 L66 90 L56 90 L52 66 L48 66 L44 90 L34 90 L44 64 L40 30 Z",
  },
  "precision-control": {
    fill: "#d4af37",
    label: "Precision Control",
    path: "M50 12 L62 30 L58 62 L68 88 L58 88 L52 64 L48 64 L42 88 L32 88 L42 62 L38 30 Z",
  },
  "explosive-pivot": {
    fill: "#c084fc",
    label: "Explosive Pivot",
    path: "M50 12 L66 32 L60 60 L72 90 L60 90 L54 64 L46 64 L40 90 L28 90 L40 60 L34 32 Z",
  },
};

export default function SilhouetteFallback({
  archetypeId,
  small,
}: {
  archetypeId: ArchetypeId;
  small?: boolean;
}) {
  const s = SHAPES[archetypeId] ?? SHAPES["reach-rhythm"];
  const size = small ? 56 : 200;
  return (
    <div className="flex items-center gap-3">
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="rounded-md bg-[#080a10] border border-border"
      >
        <circle cx="50" cy="20" r="8" fill={s.fill} opacity="0.9" />
        <path d={s.path} fill={s.fill} opacity="0.85" />
      </svg>
      {!small && (
        <div className="font-mono text-xs uppercase tracking-wider text-stone-500">
          {s.label} silhouette
        </div>
      )}
    </div>
  );
}
