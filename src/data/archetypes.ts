import type { Archetype } from "@/lib/types";

const PRE_1960 = {
  kind: "pre-1960" as const,
  note: "The Paralympic Games begin in 1960; classification history starts here.",
};

export const ARCHETYPES: Archetype[] = [
  {
    id: "reach-rhythm",
    name: "Reach & Rhythm",
    tagline: "Long-limbed, rhythmic timing.",
    buildProfile: "Tall, lean frame with rhythmic timing and lever-driven power.",
    movementVibe: "Stretch, glide, repeat.",
    olympicFamilies: ["Swimming", "Rowing", "Hurdles", "High jump"],
    paralympicFamilies: [
      { sport: "Para swimming", classification: "S5–S10" },
      { sport: "Para rowing", classification: "PR1–PR3" },
    ],
    paraLeaning: true,
    eras: [
      {
        decade: "1900s–1920s",
        yearLabel: "1904–1928",
        olympic: [
          { sportFamily: "Swimming", note: "Long-limbed swimmers anchor early US relays." },
          { sportFamily: "Rowing", note: "US eights dominate post-1920 with reach-driven crews." },
        ],
        paralympic: PRE_1960,
      },
      {
        decade: "1960s",
        yearLabel: "1960–1968",
        olympic: [
          { sportFamily: "Swimming", note: "Stroke length emerges as a US training emphasis." },
        ],
        paralympic: [
          {
            kind: "data",
            sportFamily: "Para swimming",
            classification: "S5–S10",
            note: "First Paralympic Games (Rome '60); swimming added among the founding sports.",
          },
        ],
      },
      {
        decade: "1980s",
        yearLabel: "1984–1988",
        olympic: [
          { sportFamily: "Swimming", note: "US distance freestylers set the modern reach template." },
        ],
        paralympic: [
          {
            kind: "data",
            sportFamily: "Para rowing",
            classification: "PR1–PR3",
            note: "Adaptive rowing programs expand US-side; classification framework matures.",
          },
        ],
      },
      {
        decade: "2010s",
        yearLabel: "2012–2016",
        olympic: [
          { sportFamily: "Swimming", note: "Mid-distance pool events showcase tall, rhythmic strokes." },
        ],
        paralympic: [
          {
            kind: "data",
            sportFamily: "Para swimming",
            classification: "S6–S9",
            note: "US Para swimming expands across mid-classification events.",
          },
        ],
      },
      {
        decade: "2020s",
        yearLabel: "2020–2024",
        olympic: [
          { sportFamily: "Rowing", note: "US sweep crews continue reach-and-rhythm tradition." },
        ],
        paralympic: [
          {
            kind: "data",
            sportFamily: "Para rowing",
            classification: "PR3",
            note: "Mixed coxed four: US results highlight crew-cohesion over raw power.",
          },
        ],
      },
    ],
  },

  {
    id: "compact-power",
    name: "Compact Power",
    tagline: "Dense build, explosive output.",
    buildProfile: "Compact frame with high power-to-weight ratio.",
    movementVibe: "Coil, release, repeat.",
    olympicFamilies: ["Weightlifting", "Gymnastics", "Wrestling", "Throws"],
    paralympicFamilies: [
      { sport: "Para powerlifting", classification: "Bench press classes" },
      { sport: "Para judo", classification: "J1 / J2" },
    ],
    paraLeaning: false,
    eras: [
      {
        decade: "1900s–1920s",
        yearLabel: "1904–1928",
        olympic: [
          { sportFamily: "Weightlifting", note: "Early US strongmen contest one- and two-hand lifts." },
          { sportFamily: "Wrestling", note: "Greco-Roman and freestyle programs anchor compact athletes." },
        ],
        paralympic: PRE_1960,
      },
      {
        decade: "1960s",
        yearLabel: "1960–1968",
        olympic: [
          { sportFamily: "Wrestling", note: "Lower-weight US wrestlers reach Olympic medal podiums." },
        ],
        paralympic: [
          {
            kind: "data",
            sportFamily: "Wheelchair weightlifting",
            classification: "Founding-era classes",
            note: "Weightlifting included among the founding Paralympic sports.",
          },
        ],
      },
      {
        decade: "1980s",
        yearLabel: "1984–1988",
        olympic: [
          { sportFamily: "Gymnastics", note: "Compact, explosive US gymnasts emerge in vault and floor." },
        ],
        paralympic: [
          {
            kind: "data",
            sportFamily: "Para powerlifting",
            classification: "Bench press classes",
            note: "Para powerlifting formalizes; US lifters competitive across weight categories.",
          },
        ],
      },
      {
        decade: "2010s",
        yearLabel: "2012–2016",
        olympic: [
          { sportFamily: "Weightlifting", note: "US women anchor the modern medal map in middle weights." },
        ],
        paralympic: [
          {
            kind: "data",
            sportFamily: "Para powerlifting",
            classification: "Bench press classes",
            note: "US lifters continue to qualify across multiple weight categories.",
          },
        ],
      },
      {
        decade: "2020s",
        yearLabel: "2020–2024",
        olympic: [
          { sportFamily: "Wrestling", note: "US freestyle program holds depth across weights." },
        ],
        paralympic: [
          {
            kind: "data",
            sportFamily: "Para judo",
            classification: "J1 / J2",
            note: "Para judo reformed in 2022 around vision-impairment classes J1 and J2.",
          },
        ],
      },
    ],
  },

  {
    id: "aerobic-engine",
    name: "Aerobic Engine",
    tagline: "Lean, endurance-built.",
    buildProfile: "Lean frame with high aerobic capacity and steady output.",
    movementVibe: "Sustain, sustain, sustain.",
    olympicFamilies: ["Distance running", "Road cycling", "Triathlon", "Marathon"],
    paralympicFamilies: [
      { sport: "Para handcycling", classification: "H1–H5" },
      { sport: "Para marathon", classification: "T54" },
      { sport: "Para triathlon", classification: "PTS" },
    ],
    paraLeaning: true,
    eras: [
      {
        decade: "1900s–1920s",
        yearLabel: "1904–1928",
        olympic: [
          { sportFamily: "Distance running", note: "US distance squads compete in the early Olympic era." },
        ],
        paralympic: PRE_1960,
      },
      {
        decade: "1960s",
        yearLabel: "1960–1968",
        olympic: [
          { sportFamily: "Marathon", note: "Marathon culture begins to expand in US training." },
        ],
        paralympic: [
          {
            kind: "data",
            sportFamily: "Wheelchair athletics",
            classification: "Open chair classes",
            note: "Wheelchair track among founding Paralympic sports; precursor to modern T54.",
          },
        ],
      },
      {
        decade: "1980s",
        yearLabel: "1984–1988",
        olympic: [
          { sportFamily: "Marathon", note: "US marathoners contest Olympic medals on home soil in '84." },
        ],
        paralympic: [
          {
            kind: "data",
            sportFamily: "Wheelchair athletics",
            classification: "T54 emerging",
            note: "T54 classification framework matures around modern racing wheelchair design.",
          },
        ],
      },
      {
        decade: "2010s",
        yearLabel: "2012–2016",
        olympic: [
          { sportFamily: "Triathlon", note: "US triathlon medals across both Olympic distances." },
        ],
        paralympic: [
          {
            kind: "data",
            sportFamily: "Para handcycling",
            classification: "H1–H5",
            note: "US Para handcycling depth across H-class spectrum.",
          },
        ],
      },
      {
        decade: "2020s",
        yearLabel: "2020–2024",
        olympic: [
          { sportFamily: "Marathon", note: "US distance program continues development for road events." },
        ],
        paralympic: [
          {
            kind: "data",
            sportFamily: "Para marathon",
            classification: "T54",
            note: "T54 marathon: US wheelchair marathoners contest world podiums.",
          },
        ],
      },
    ],
  },

  {
    id: "precision-control",
    name: "Precision Control",
    tagline: "Steady hands, steady breath.",
    buildProfile: "Build varies; emphasis is fine motor control and stillness under pressure.",
    movementVibe: "Settle, aim, release.",
    olympicFamilies: ["Shooting", "Archery", "Equestrian"],
    paralympicFamilies: [
      { sport: "Para shooting", classification: "SH1 / SH2" },
      { sport: "Para archery", classification: "Open / W1" },
      { sport: "Boccia", classification: "BC1–BC4" },
    ],
    paraLeaning: true,
    eras: [
      {
        decade: "1900s–1920s",
        yearLabel: "1904–1928",
        olympic: [
          { sportFamily: "Shooting", note: "Rifle and pistol events among early US Olympic medal sources." },
        ],
        paralympic: PRE_1960,
      },
      {
        decade: "1960s",
        yearLabel: "1960–1968",
        olympic: [
          { sportFamily: "Archery", note: "Archery returns to the Olympic program in 1972, drawing US precision athletes." },
        ],
        paralympic: [
          {
            kind: "data",
            sportFamily: "Wheelchair archery",
            classification: "Open / W classes",
            note: "Archery among the founding Paralympic sports of 1960.",
          },
        ],
      },
      {
        decade: "1980s",
        yearLabel: "1984–1988",
        olympic: [
          { sportFamily: "Shooting", note: "US Olympic shooting program peaks in 1984 with multiple medals." },
        ],
        paralympic: [
          {
            kind: "data",
            sportFamily: "Boccia",
            classification: "BC1–BC4",
            note: "Boccia formalized for athletes with significant motor impairment.",
          },
        ],
      },
      {
        decade: "2010s",
        yearLabel: "2012–2016",
        olympic: [
          { sportFamily: "Archery", note: "US archers contest medals in mixed and individual events." },
        ],
        paralympic: [
          {
            kind: "data",
            sportFamily: "Para archery",
            classification: "Open / W1",
            note: "US Para archery competitive across Open and W1 classifications.",
          },
        ],
      },
      {
        decade: "2020s",
        yearLabel: "2020–2024",
        olympic: [
          { sportFamily: "Shooting", note: "US shooters return to the Olympic medal podium in air rifle and skeet." },
        ],
        paralympic: [
          {
            kind: "data",
            sportFamily: "Para shooting",
            classification: "SH1 / SH2",
            note: "SH1 (no shooting stand) and SH2 (uses stand) classes formalize equipment rules.",
          },
        ],
      },
    ],
  },

  {
    id: "explosive-pivot",
    name: "Explosive Pivot",
    tagline: "Sprinter build, multi-directional.",
    buildProfile: "Sprinter-shaped athletes who change direction at speed.",
    movementVibe: "Plant, pivot, accelerate.",
    olympicFamilies: ["Sprinting", "Basketball", "Judo", "Fencing"],
    paralympicFamilies: [
      { sport: "Wheelchair basketball", classification: "1.0–4.5 point system" },
      { sport: "Sitting volleyball", classification: "MD / VS" },
      { sport: "Wheelchair fencing", classification: "Cat A / B" },
    ],
    paraLeaning: false,
    eras: [
      {
        decade: "1900s–1920s",
        yearLabel: "1904–1928",
        olympic: [
          { sportFamily: "Sprinting", note: "US sprinters anchor early Olympic 100m / 200m programs." },
        ],
        paralympic: PRE_1960,
      },
      {
        decade: "1960s",
        yearLabel: "1960–1968",
        olympic: [
          { sportFamily: "Basketball", note: "US Olympic basketball builds its long medal streak." },
        ],
        paralympic: [
          {
            kind: "data",
            sportFamily: "Wheelchair basketball",
            classification: "Founding-era classes",
            note: "Wheelchair basketball is a founding Paralympic sport.",
          },
        ],
      },
      {
        decade: "1980s",
        yearLabel: "1984–1988",
        olympic: [
          { sportFamily: "Sprinting", note: "US sprint program highlights both 100m and relay depth." },
        ],
        paralympic: [
          {
            kind: "data",
            sportFamily: "Wheelchair fencing",
            classification: "Cat A / B",
            note: "Wheelchair fencing organizes around two functional categories.",
          },
        ],
      },
      {
        decade: "2010s",
        yearLabel: "2012–2016",
        olympic: [
          { sportFamily: "Basketball", note: "US men's and women's Olympic teams continue medal podium presence." },
        ],
        paralympic: [
          {
            kind: "data",
            sportFamily: "Wheelchair basketball",
            classification: "1.0–4.5 point system",
            note: "US wheelchair basketball medals across men's and women's events.",
          },
        ],
      },
      {
        decade: "2020s",
        yearLabel: "2020–2024",
        olympic: [
          { sportFamily: "Sprinting", note: "US relays continue medal podium presence." },
        ],
        paralympic: [
          {
            kind: "data",
            sportFamily: "Sitting volleyball",
            classification: "MD / VS",
            note: "US women's sitting volleyball: multi-cycle Paralympic gold streak.",
          },
        ],
      },
    ],
  },
];

export const ARCHETYPE_BY_ID = Object.fromEntries(
  ARCHETYPES.map((a) => [a.id, a]),
) as Record<string, Archetype>;
