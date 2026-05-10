import { ARCHETYPES } from "@/data/archetypes";
import type {
  Archetype,
  ArchetypeId,
  ArchetypeMatch,
  BiometricInput,
  MatchResult,
} from "@/lib/types";

type Centroid = {
  id: ArchetypeId;
  heightCm: number;
  weightKg: number;
  movement: BiometricInput["movement"];
};

const CENTROIDS: Centroid[] = [
  { id: "reach-rhythm", heightCm: 188, weightKg: 78, movement: "endurance" },
  { id: "compact-power", heightCm: 168, weightKg: 82, movement: "power" },
  { id: "aerobic-engine", heightCm: 178, weightKg: 65, movement: "endurance" },
  { id: "precision-control", heightCm: 174, weightKg: 70, movement: "precision" },
  { id: "explosive-pivot", heightCm: 180, weightKg: 80, movement: "agility" },
];

const HEIGHT_SD = 10;
const WEIGHT_SD = 12;

function softmax(vals: number[]): number[] {
  const max = Math.max(...vals);
  const exps = vals.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export function matchArchetypes(input: BiometricInput): MatchResult {
  const scored = CENTROIDS.map((c) => {
    const dh = (input.heightCm - c.heightCm) / HEIGHT_SD;
    const dw = (input.weightKg - c.weightKg) / WEIGHT_SD;
    const dist = Math.sqrt(dh * dh + dw * dw);
    const movementBonus = c.movement === input.movement ? 1.5 : 0;
    const score = -dist + movementBonus;
    return { id: c.id, score };
  });

  const probs = softmax(scored.map((s) => s.score));
  const ranked = scored
    .map((s, i) => ({ id: s.id, confidence: probs[i] }))
    .sort((a, b) => b.confidence - a.confidence);

  const byId = Object.fromEntries(
    ARCHETYPES.map((a) => [a.id, a]),
  ) as Record<string, Archetype>;

  const primary: ArchetypeMatch = {
    archetype: byId[ranked[0].id],
    confidence: ranked[0].confidence,
  };
  const secondary: ArchetypeMatch = {
    archetype: byId[ranked[1].id],
    confidence: ranked[1].confidence,
  };

  const paraFirst: [ArchetypeMatch, ArchetypeMatch] = primary.archetype.paraLeaning
    ? [primary, secondary]
    : secondary.archetype.paraLeaning
      ? [secondary, primary]
      : [primary, secondary];

  return { primary, secondary, paraFirstOrder: paraFirst };
}
