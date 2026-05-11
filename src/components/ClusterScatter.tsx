"use client";

import type { ArchetypeId, BiometricInput } from "@/lib/types";

const CENTROIDS: {
  id: ArchetypeId;
  name: string;
  height: number;
  weight: number;
  color: string;
  movement: BiometricInput["movement"];
}[] = [
  { id: "reach-rhythm", name: "Reach & Rhythm", height: 188, weight: 78, color: "#5fb3b3", movement: "endurance" },
  { id: "compact-power", name: "Compact Power", height: 168, weight: 82, color: "#e85a4f", movement: "power" },
  { id: "aerobic-engine", name: "Aerobic Engine", height: 178, weight: 65, color: "#7dd3a0", movement: "endurance" },
  { id: "precision-control", name: "Precision Control", height: 174, weight: 70, color: "#d4af37", movement: "precision" },
  { id: "explosive-pivot", name: "Explosive Pivot", height: 180, weight: 80, color: "#c084fc", movement: "agility" },
];

const X_MIN = 150;
const X_MAX = 210;
const Y_MIN = 50;
const Y_MAX = 110;

const W = 520;
const H = 320;
const PAD_L = 44;
const PAD_R = 24;
const PAD_T = 16;
const PAD_B = 36;

const SPREAD_HEIGHT_CM = 7;
const SPREAD_WEIGHT_KG = 8;

function projectX(heightCm: number) {
  const clamped = Math.min(Math.max(heightCm, X_MIN), X_MAX);
  return PAD_L + ((clamped - X_MIN) / (X_MAX - X_MIN)) * (W - PAD_L - PAD_R);
}
function projectY(weightKg: number) {
  const clamped = Math.min(Math.max(weightKg, Y_MIN), Y_MAX);
  return H - PAD_B - ((clamped - Y_MIN) / (Y_MAX - Y_MIN)) * (H - PAD_T - PAD_B);
}

const PX_PER_CM = (W - PAD_L - PAD_R) / (X_MAX - X_MIN);
const PX_PER_KG = (H - PAD_T - PAD_B) / (Y_MAX - Y_MIN);
const HALO_RX = SPREAD_HEIGHT_CM * PX_PER_CM;
const HALO_RY = SPREAD_WEIGHT_KG * PX_PER_KG;

const X_TICKS = [150, 165, 180, 195, 210];
const Y_TICKS = [50, 65, 80, 95, 110];

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

      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-5 items-start">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          role="img"
          aria-label="Scatter plot of Team USA archetypes by height and weight, with your position highlighted."
        >
          <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke="#1e293b" />
          <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke="#1e293b" />

          {X_TICKS.map((h) => (
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
          {Y_TICKS.map((w) => (
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
            const movementMatch = c.movement === input.movement;
            return (
              <g key={c.id}>
                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={HALO_RX}
                  ry={HALO_RY}
                  fill={c.color}
                  opacity={isPrimary ? 0.18 : 0.1}
                />
                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={HALO_RX}
                  ry={HALO_RY}
                  fill="none"
                  stroke={c.color}
                  strokeWidth={isPrimary ? 1.5 : 0.75}
                  strokeOpacity={isPrimary ? 0.9 : 0.4}
                  strokeDasharray={isPrimary ? "0" : "3 3"}
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill={c.color}
                  stroke={isPrimary ? "#f5f5f4" : "transparent"}
                  strokeWidth={isPrimary ? 2 : 0}
                />
                {movementMatch && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={9}
                    fill="none"
                    stroke="#f5f5f4"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                    opacity={0.8}
                  />
                )}
              </g>
            );
          })}

          <line
            x1={userX}
            y1={userY - 16}
            x2={userX}
            y2={userY + 16}
            stroke="#f5f5f4"
            strokeWidth="1"
            strokeDasharray="2 2"
            opacity="0.6"
          />
          <line
            x1={userX - 16}
            y1={userY}
            x2={userX + 16}
            y2={userY}
            stroke="#f5f5f4"
            strokeWidth="1"
            strokeDasharray="2 2"
            opacity="0.6"
          />
          <circle cx={userX} cy={userY} r={6} fill="#f5f5f4" />
          <text
            x={userX + 12}
            y={userY - 12}
            fill="#f5f5f4"
            fontSize="11"
            fontFamily="var(--font-mono)"
            fontWeight="600"
          >
            you
          </text>
        </svg>

        <Legend primaryArchetypeId={primaryArchetypeId} userMovement={input.movement} />
      </div>

      <p className="mt-4 text-xs text-stone-500 leading-relaxed">
        The scatter shows two of three archetype dimensions: height and
        weight. The third — <span className="text-stone-300">movement preference</span> — is shown
        as a <span className="text-stone-300">dashed white ring</span> around any centroid whose
        movement style matches yours, and as a tag in the legend. Match
        scores combine all three, so an archetype that&apos;s farther from
        you in 2D can still rank higher when your movement matches it.
        Centroids are <span className="text-stone-300">illustrative reference points</span> built
        from US Olympic + Paralympic sport-family patterns — not learned from
        athlete data, and not a competitive prediction.
      </p>
    </div>
  );
}

function Legend({
  primaryArchetypeId,
  userMovement,
}: {
  primaryArchetypeId: ArchetypeId;
  userMovement: BiometricInput["movement"];
}) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500 mb-2">
        Archetypes
      </div>
      <ul className="space-y-2">
        <LegendRow
          color="#f5f5f4"
          label="You"
          subtle={`movement: ${userMovement}`}
          highlighted
        />
        {CENTROIDS.map((c) => {
          const movementMatch = c.movement === userMovement;
          return (
            <LegendRow
              key={c.id}
              color={c.color}
              label={c.name}
              subtle={`${c.height}cm · ${c.weight}kg · ${c.movement}${movementMatch ? " ✓" : ""}`}
              highlighted={c.id === primaryArchetypeId}
              movementMatch={movementMatch}
            />
          );
        })}
      </ul>
    </div>
  );
}

function LegendRow({
  color,
  label,
  subtle,
  highlighted,
  movementMatch,
}: {
  color: string;
  label: string;
  subtle: string;
  highlighted?: boolean;
  movementMatch?: boolean;
}) {
  return (
    <li className="flex items-baseline gap-2 text-sm">
      <span
        className="inline-block size-2.5 rounded-full shrink-0 mt-[3px]"
        style={{ background: color }}
      />
      <span className={highlighted ? "text-stone-100 font-medium" : "text-stone-300"}>
        {label}
      </span>
      <span
        className={`font-mono text-[10px] ml-auto ${
          movementMatch ? "text-stone-300" : "text-stone-600"
        }`}
      >
        {subtle}
      </span>
    </li>
  );
}
