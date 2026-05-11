"use client";

import type { ArchetypeId, BiometricInput } from "@/lib/types";

const CENTROIDS: { id: ArchetypeId; name: string; height: number; weight: number; color: string }[] = [
  { id: "reach-rhythm", name: "Reach & Rhythm", height: 188, weight: 78, color: "#5fb3b3" },
  { id: "compact-power", name: "Compact Power", height: 168, weight: 82, color: "#e85a4f" },
  { id: "aerobic-engine", name: "Aerobic Engine", height: 178, weight: 65, color: "#7dd3a0" },
  { id: "precision-control", name: "Precision Control", height: 174, weight: 70, color: "#d4af37" },
  { id: "explosive-pivot", name: "Explosive Pivot", height: 180, weight: 80, color: "#c084fc" },
];

const X_MIN = 140;
const X_MAX = 220;
const Y_MIN = 40;
const Y_MAX = 160;

const W = 520;
const H = 320;
const PAD_L = 44;
const PAD_R = 24;
const PAD_T = 16;
const PAD_B = 36;

function projectX(heightCm: number) {
  const clamped = Math.min(Math.max(heightCm, X_MIN), X_MAX);
  return PAD_L + ((clamped - X_MIN) / (X_MAX - X_MIN)) * (W - PAD_L - PAD_R);
}
function projectY(weightKg: number) {
  const clamped = Math.min(Math.max(weightKg, Y_MIN), Y_MAX);
  return H - PAD_B - ((clamped - Y_MIN) / (Y_MAX - Y_MIN)) * (H - PAD_T - PAD_B);
}

export default function ClusterScatter({
  input,
  primaryArchetypeId,
}: {
  input: BiometricInput;
  primaryArchetypeId: ArchetypeId;
}) {
  const userX = projectX(input.heightCm);
  const userY = projectY(input.weightKg);

  return (
    <div className="rounded-md border border-border bg-surface p-4">
      <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500 mb-3">
        Where you sit in archetype space
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label="Scatter plot of Team USA archetypes by height and weight, with your position highlighted."
      >
        <line
          x1={PAD_L}
          y1={H - PAD_B}
          x2={W - PAD_R}
          y2={H - PAD_B}
          stroke="#1e293b"
        />
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke="#1e293b" />

        {[150, 170, 190, 210].map((h) => (
          <g key={`x${h}`}>
            <line
              x1={projectX(h)}
              y1={H - PAD_B}
              x2={projectX(h)}
              y2={H - PAD_B + 4}
              stroke="#334155"
            />
            <text
              x={projectX(h)}
              y={H - PAD_B + 18}
              fill="#64748b"
              fontSize="10"
              textAnchor="middle"
              fontFamily="var(--font-mono)"
            >
              {h}
            </text>
          </g>
        ))}
        {[60, 90, 120, 150].map((w) => (
          <g key={`y${w}`}>
            <line
              x1={PAD_L - 4}
              y1={projectY(w)}
              x2={PAD_L}
              y2={projectY(w)}
              stroke="#334155"
            />
            <text
              x={PAD_L - 8}
              y={projectY(w) + 3}
              fill="#64748b"
              fontSize="10"
              textAnchor="end"
              fontFamily="var(--font-mono)"
            >
              {w}
            </text>
          </g>
        ))}

        <text
          x={(W + PAD_L - PAD_R) / 2}
          y={H - 6}
          fill="#64748b"
          fontSize="10"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
        >
          height (cm)
        </text>
        <text
          x={12}
          y={(H + PAD_T - PAD_B) / 2}
          fill="#64748b"
          fontSize="10"
          textAnchor="middle"
          transform={`rotate(-90 12 ${(H + PAD_T - PAD_B) / 2})`}
          fontFamily="var(--font-mono)"
        >
          weight (kg)
        </text>

        {CENTROIDS.map((c) => {
          const cx = projectX(c.height);
          const cy = projectY(c.weight);
          const isPrimary = c.id === primaryArchetypeId;
          return (
            <g key={c.id}>
              <circle
                cx={cx}
                cy={cy}
                r={isPrimary ? 38 : 26}
                fill={c.color}
                opacity={isPrimary ? 0.18 : 0.09}
              />
              <circle cx={cx} cy={cy} r={5} fill={c.color} />
              <text
                x={cx + 10}
                y={cy + 4}
                fill="#cbd5e1"
                fontSize="11"
                fontFamily="var(--font-mono)"
              >
                {c.name}
              </text>
            </g>
          );
        })}

        <line
          x1={userX}
          y1={userY - 14}
          x2={userX}
          y2={userY + 14}
          stroke="#f5f5f4"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <line
          x1={userX - 14}
          y1={userY}
          x2={userX + 14}
          y2={userY}
          stroke="#f5f5f4"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <circle cx={userX} cy={userY} r={6} fill="#f5f5f4" />
        <text
          x={userX + 10}
          y={userY - 10}
          fill="#f5f5f4"
          fontSize="11"
          fontFamily="var(--font-mono)"
        >
          you
        </text>
      </svg>

      <p className="mt-3 text-xs text-stone-500 leading-relaxed">
        Each archetype centroid is plotted on height × weight with movement
        preference factored separately. Your point shows where your inputs
        land relative to the five Team USA clusters.
      </p>
    </div>
  );
}
