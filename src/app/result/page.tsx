import { Suspense } from "react";
import ResultView from "./ResultView";

export const dynamic = "force-dynamic";

export default function ResultPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResultView />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-500">
        Loading My Olympian…
      </p>
    </main>
  );
}
