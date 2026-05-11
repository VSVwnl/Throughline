export type ArchetypeId =
  | "reach-rhythm"
  | "compact-power"
  | "aerobic-engine"
  | "precision-control"
  | "explosive-pivot";

export type Era = {
  decade: string;
  yearLabel: string;
  olympic: { sportFamily: string; note: string }[];
  paralympic:
    | { kind: "data"; sportFamily: string; classification: string; note: string }[]
    | { kind: "pre-1960"; note: string };
};

export type Archetype = {
  id: ArchetypeId;
  name: string;
  tagline: string;
  buildProfile: string;
  movementVibe: string;
  olympicFamilies: string[];
  paralympicFamilies: { sport: string; classification: string }[];
  paraLeaning: boolean;
  eras: Era[];
  chatSuggestions: string[];
};

export type BiometricInput = {
  heightCm: number;
  weightKg: number;
  ageBand: "youth" | "20s" | "30s" | "40plus";
  movement: "endurance" | "power" | "precision" | "agility";
};

export type ArchetypeMatch = {
  archetype: Archetype;
  confidence: number;
};

export type MatchResult = {
  primary: ArchetypeMatch;
  secondary: ArchetypeMatch;
  paraFirstOrder: [ArchetypeMatch, ArchetypeMatch];
  allRanked: ArchetypeMatch[];
};
