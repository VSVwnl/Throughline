import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-paralympic mb-6">
          Throughline · Team USA × Google Cloud
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
          Find yourself in{" "}
          <span className="text-paralympic">120 years</span>{" "}
          of Team USA.
        </h1>

        <p className="mt-6 text-lg text-stone-300 max-w-2xl leading-relaxed">
          Throughline maps your build to a Team USA athlete archetype, then
          walks your archetype across a century of US Olympic{" "}
          <em className="not-italic text-olympic">and</em>{" "}
          Paralympic sport families — with equal depth for both, narrated by a
          Gemini agent.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 items-center">
          <Link
            href="/start"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-stone-100 text-[#0a0d14] font-medium hover:bg-white transition-colors"
          >
            Begin
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center px-4 py-3 text-sm text-stone-400 hover:text-stone-100 transition-colors"
          >
            About the data →
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <Stat label="Archetypes" value="5" tone="paralympic" />
          <Stat label="Years of history" value="120" />
          <Stat label="Gemini lanes" value="3" tone="olympic" />
        </div>

        <p className="mt-16 text-xs text-stone-500 max-w-xl leading-relaxed">
          Team USA has never had one body type. This is a fan-facing analytical
          tool — it uses conditional language, never identifies private
          individuals, and treats Olympic and Paralympic data with equal
          analytical depth.
        </p>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "olympic" | "paralympic";
}) {
  const valueColor =
    tone === "olympic"
      ? "text-olympic"
      : tone === "paralympic"
        ? "text-paralympic"
        : "text-stone-100";
  return (
    <div className="border-t border-border pt-4">
      <div className={`text-3xl font-semibold ${valueColor}`}>{value}</div>
      <div className="font-mono text-xs uppercase tracking-wider text-stone-500 mt-1">
        {label}
      </div>
    </div>
  );
}
