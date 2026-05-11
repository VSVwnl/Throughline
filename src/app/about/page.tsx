import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="flex-1 px-6 py-12 max-w-3xl mx-auto w-full">
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-[0.2em] text-stone-500 hover:text-stone-300"
      >
        ← Throughline
      </Link>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight">
        About the data and the rules.
      </h1>

      <p className="mt-4 text-stone-300 leading-relaxed">
        Throughline is built for the Team USA × Google Cloud hackathon
        (Challenge 4 — The Athlete Archetype Agent). It is a fan-facing
        analytical tool, not a coaching tool, not a prediction tool, and not a
        medical tool.
      </p>

      <Section title="Data sources">
        <ul className="list-disc pl-5 space-y-2 text-stone-300">
          <li>
            <strong>Olympic:</strong> publicly available US Team USA Olympic
            sport / event references, summarized at the sport-family level
            (no individual private athletes).
          </li>
          <li>
            <strong>Paralympic:</strong> publicly available US Team USA
            Paralympic sport / classification references (USOPC and IPC public
            materials), summarized at the sport-family and classification
            level (no individual private athletes).
          </li>
          <li>
            <strong>Pre-1960 Paralympics:</strong> the Paralympic Games begin
            in 1960. Era cards before 1960 explicitly state this, rather than
            inventing data.
          </li>
        </ul>
      </Section>

      <Section title="How matching works">
        <p className="text-stone-300 leading-relaxed">
          Five archetypes are pre-defined from build profiles and movement
          characteristics that historically appear across Team USA Olympic
          and Paralympic sport families. The centroids are
          <strong> illustrative reference points</strong>, hand-built from
          public sport-family patterns — not learned from athlete data. Your
          inputs are scored against each centroid (height, weight, and
          movement preference) and rendered as a softmax confidence. The
          result is a fan-engagement and storytelling signal, not a
          competitive prediction, and not a recommendation about what sport
          you should play.
        </p>
      </Section>

      <Section title="How Gemini is used">
        <ul className="list-disc pl-5 space-y-2 text-stone-300">
          <li>
            <strong>Narrative (Gemini 2.5 Pro):</strong> writes a personal
            120-year throughline, conditional phrasing only.
          </li>
          <li>
            <strong>Audio (Gemini 2.5 TTS):</strong> reads your throughline
            aloud.
          </li>
          <li>
            <strong>Silhouette (Imagen):</strong> generates an abstract,
            stylized silhouette card. No faces, no real people.
          </li>
          <li>
            <strong>Chat (Gemini 2.5 Flash):</strong> answers follow-up
            questions, with equal depth for Olympic and Paralympic content.
          </li>
        </ul>
      </Section>

      <Section title="What we will not do">
        <ul className="list-disc pl-5 space-y-2 text-stone-300">
          <li>Tell you which sport you should play.</li>
          <li>Predict performance or outcomes for any individual.</li>
          <li>Identify or compare you to specific real athletes.</li>
          <li>Treat Paralympic context as an add-on to Olympic context.</li>
        </ul>
      </Section>

      <p className="mt-12 text-xs text-stone-500">
        Source: vibecodeforgoldwithgoogle.devpost.com (Challenge 4 brief).
      </p>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-medium tracking-tight mb-3">{title}</h2>
      {children}
    </section>
  );
}
