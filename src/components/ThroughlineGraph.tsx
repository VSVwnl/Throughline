"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Archetype, ArchetypeId, Era } from "@/lib/types";

const ARCHETYPE_COLORS: Record<ArchetypeId, string> = {
  "reach-rhythm": "#5fb3b3",
  "compact-power": "#e85a4f",
  "aerobic-engine": "#7dd3a0",
  "precision-control": "#d4af37",
  "explosive-pivot": "#c084fc",
};

const W = 960;
const H = 320;
const PAD_L = 56;
const PAD_R = 32;
const OLYMPIC_Y = 90;
const AXIS_Y = 160;
const PARA_Y = 230;
const WAVE_AMP = 16;
const NODE_R = 7;

function eraX(index: number, total: number) {
  if (total <= 1) return PAD_L;
  return PAD_L + (index / (total - 1)) * (W - PAD_L - PAD_R);
}

function wavePath(
  nodes: { x: number; y: number }[],
  amplitude: number,
  flip: boolean,
): string {
  if (nodes.length === 0) return "";
  let d = `M ${nodes[0].x.toFixed(2)} ${nodes[0].y.toFixed(2)}`;
  for (let i = 1; i < nodes.length; i++) {
    const p0 = nodes[i - 1];
    const p1 = nodes[i];
    const dx = p1.x - p0.x;
    const direction = (i % 2 === 1 ? -1 : 1) * (flip ? -1 : 1);
    const c1x = p0.x + dx / 3;
    const c1y = p0.y + direction * amplitude;
    const c2x = p0.x + (2 * dx) / 3;
    const c2y = p1.y + direction * amplitude;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
  }
  return d;
}

export default function ThroughlineGraph({ archetype }: { archetype: Archetype }) {
  const color = ARCHETYPE_COLORS[archetype.id];
  const eras = archetype.eras;

  const olympicNodes = useMemo(
    () => eras.map((_, i) => ({ x: eraX(i, eras.length), y: OLYMPIC_Y })),
    [eras],
  );
  const paraNodes = useMemo(
    () =>
      eras.map((era, i) => ({
        x: eraX(i, eras.length),
        y: PARA_Y,
        isPre1960: !Array.isArray(era.paralympic),
      })),
    [eras],
  );

  const firstParaIndex = paraNodes.findIndex((n) => !n.isPre1960);
  const paraRealNodes = paraNodes.filter((n) => !n.isPre1960);
  const paraGhostNodes = paraNodes.filter((n) => n.isPre1960);

  const olympicPath = useMemo(() => wavePath(olympicNodes, WAVE_AMP, false), [olympicNodes]);
  const paraPath = useMemo(() => wavePath(paraRealNodes, WAVE_AMP, true), [paraRealNodes]);
  const paraGhostPath = useMemo(() => {
    if (paraGhostNodes.length === 0 || firstParaIndex < 0) return "";
    return wavePath([...paraGhostNodes, paraNodes[firstParaIndex]], WAVE_AMP, true);
  }, [paraGhostNodes, paraNodes, firstParaIndex]);

  const olympicPathRef = useRef<SVGPathElement | null>(null);
  const paraPathRef = useRef<SVGPathElement | null>(null);
  const [olympicLen, setOlympicLen] = useState(1500);
  const [paraLen, setParaLen] = useState(1500);
  const [pathDrawn, setPathDrawn] = useState(false);

  useEffect(() => {
    if (olympicPathRef.current) {
      setOlympicLen(olympicPathRef.current.getTotalLength());
    }
    if (paraPathRef.current) {
      setParaLen(paraPathRef.current.getTotalLength());
    }
    const t = window.setTimeout(() => setPathDrawn(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  const defaultIndex = Math.max(firstParaIndex, 0);
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const selected = eras[selectedIndex];

  return (
    <div className="rounded-md border border-border bg-surface p-4 md:p-6">
      <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500 mb-4">
        The throughline · 120 years · {archetype.name}
      </div>

      <div className="overflow-x-auto -mx-2 px-2">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto min-w-[640px]"
          role="img"
          aria-label={`Timeline showing ${archetype.name} archetype across Olympic and Paralympic eras from 1904 to 2024. Click any era to see details.`}
        >
          <line
            x1={PAD_L}
            y1={AXIS_Y}
            x2={W - PAD_R}
            y2={AXIS_Y}
            stroke="#1e293b"
            strokeWidth="1"
          />

          <text
            x={PAD_L - 10}
            y={OLYMPIC_Y + 3}
            fill="#94a3b8"
            fontSize="10"
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontWeight="600"
            letterSpacing="0.05em"
          >
            OLY
          </text>
          <text
            x={PAD_L - 10}
            y={PARA_Y + 3}
            fill="#94a3b8"
            fontSize="10"
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontWeight="600"
            letterSpacing="0.05em"
          >
            PARA
          </text>

          {eras.map((era, i) => {
            const x = eraX(i, eras.length);
            return (
              <g key={`label-${i}`}>
                <line x1={x} y1={AXIS_Y - 5} x2={x} y2={AXIS_Y + 5} stroke="#334155" />
                <text
                  x={x}
                  y={AXIS_Y - 12}
                  fill="#64748b"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                >
                  {era.decade}
                </text>
                <text
                  x={x}
                  y={AXIS_Y + 20}
                  fill="#475569"
                  fontSize="9"
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                >
                  {era.yearLabel}
                </text>
              </g>
            );
          })}

          <path
            ref={olympicPathRef}
            d={olympicPath}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeOpacity="0.75"
            strokeLinecap="round"
            style={{
              strokeDasharray: olympicLen,
              strokeDashoffset: pathDrawn ? 0 : olympicLen,
              transition: "stroke-dashoffset 1.2s ease-out",
            }}
          />

          {paraGhostPath && (
            <path
              d={paraGhostPath}
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeOpacity="0.25"
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
          )}

          <path
            ref={paraPathRef}
            d={paraPath}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeOpacity="0.75"
            strokeLinecap="round"
            style={{
              strokeDasharray: paraLen,
              strokeDashoffset: pathDrawn ? 0 : paraLen,
              transition: "stroke-dashoffset 1.2s ease-out 0.25s",
            }}
          />

          {eras.map((_, i) => {
            const isSelected = i === selectedIndex;
            const isHovered = i === hoverIndex;
            const oly = olympicNodes[i];
            const para = paraNodes[i];
            const x = eraX(i, eras.length);
            const emphasized = isSelected || isHovered;
            const radius = emphasized ? NODE_R + 1 : NODE_R;

            return (
              <g
                key={`node-${i}`}
                onClick={() => setSelectedIndex(i)}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                style={{ cursor: "pointer" }}
              >
                {emphasized && (
                  <line
                    x1={x}
                    y1={oly.y}
                    x2={x}
                    y2={para.y}
                    stroke={color}
                    strokeWidth="0.75"
                    strokeOpacity="0.35"
                    strokeDasharray="2 3"
                  />
                )}

                {isSelected && (
                  <>
                    <circle
                      cx={oly.x}
                      cy={oly.y}
                      r={NODE_R + 6}
                      fill="none"
                      stroke={color}
                      strokeWidth="1"
                      strokeOpacity="0.55"
                    />
                    {!para.isPre1960 && (
                      <circle
                        cx={para.x}
                        cy={para.y}
                        r={NODE_R + 6}
                        fill="none"
                        stroke={color}
                        strokeWidth="1"
                        strokeOpacity="0.55"
                      />
                    )}
                  </>
                )}

                <circle
                  cx={oly.x}
                  cy={oly.y}
                  r={radius}
                  fill={color}
                  stroke="#0a0d14"
                  strokeWidth="2"
                  style={{ transition: "r 200ms ease-out" }}
                />

                {para.isPre1960 ? (
                  <circle
                    cx={para.x}
                    cy={para.y}
                    r={NODE_R - 1}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    strokeOpacity="0.45"
                  />
                ) : (
                  <circle
                    cx={para.x}
                    cy={para.y}
                    r={radius}
                    fill={color}
                    stroke="#0a0d14"
                    strokeWidth="2"
                    style={{ transition: "r 200ms ease-out" }}
                  />
                )}

                <rect
                  x={x - 26}
                  y={OLYMPIC_Y - 22}
                  width={52}
                  height={PARA_Y - OLYMPIC_Y + 44}
                  fill="transparent"
                />
              </g>
            );
          })}
        </svg>
      </div>

      <EraDetail era={selected} color={color} />

      <p className="mt-5 text-xs text-stone-500 leading-relaxed">
        Each node is one historical era for the{" "}
        <span className="text-stone-300">{archetype.name}</span> archetype.
        The upper lane is Olympic; the lower is Paralympic. Pre-1960 Paralympic
        nodes are dashed because the Paralympic Games begin with the Paralympic
        Games Rome 1960. These are{" "}
        <span className="text-stone-300">illustrative reference points</span>
        — patterns drawn from US Olympic and Paralympic sport-family history,
        not learned from athlete data and not a competitive prediction.{" "}
        <span className="text-stone-400">Click any node to read its era.</span>
      </p>
    </div>
  );
}

function EraDetail({ era, color }: { era: Era; color: string }) {
  return (
    <div className="mt-6 border-t border-border pt-5">
      <div className="flex items-baseline gap-3">
        <span
          className="inline-block size-2.5 rounded-full shrink-0"
          style={{ background: color }}
          aria-hidden="true"
        />
        <div className="font-mono text-xs uppercase tracking-wider text-stone-500">
          {era.decade}
        </div>
        <div className="font-mono text-xs text-stone-600">{era.yearLabel}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="rounded-md border border-border bg-[#0a0d14] p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider mb-3 text-olympic">
            Olympic
          </div>
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
        </div>

        <div className="rounded-md border border-border bg-[#0a0d14] p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider mb-3 text-paralympic">
            Paralympic
          </div>
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
        </div>
      </div>
    </div>
  );
}
