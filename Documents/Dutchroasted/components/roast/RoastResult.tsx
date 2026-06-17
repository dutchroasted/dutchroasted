"use client";

import { useMemo, useState } from "react";
import type { RoastReportData } from "@/lib/roastTypes";
import { LeadCapture } from "./LeadCapture";
import { RoastReport } from "./RoastReport";

type RoastResultProps = {
  result: RoastReportData;
  onNewRoast: () => void;
};

export function RoastResult({ result, onNewRoast }: RoastResultProps) {
  const [feedback, setFeedback] = useState("");

  const resultText = useMemo(() => formatResultText(result), [result]);
  const shareText = useMemo(
    () => ["Mijn DutchRoasted resultaat:", "", resultText, "", "Gemaakt met DutchRoasted.nl"].join("\n"),
    [resultText],
  );

  function showFeedback(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 2200);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(resultText);
      showFeedback("Resultaat gekopieerd");
    } catch {
      showFeedback("Kopieren mislukt");
    }
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Mijn DutchRoasted resultaat",
          text: shareText,
        });
        showFeedback("Delen gestart");
        return;
      }

      await navigator.clipboard.writeText(shareText);
      showFeedback("Resultaat gekopieerd. Je kunt het nu delen.");
    } catch {
      showFeedback("Delen geannuleerd");
    }
  }

  function handlePrint() {
    showFeedback("PDF wordt voorbereid");
    window.setTimeout(() => window.print(), 120);
  }

  return (
    <>
      <RoastReport result={result} />

      <section className="no-print space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-black text-white">Je roast is klaar.</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm font-black text-white transition hover:border-white/30 hover:bg-white/10"
          >
            Kopieer resultaat
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm font-black text-white transition hover:border-white/30 hover:bg-white/10"
          >
            Deel resultaat
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="rounded-md border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-sm font-black text-orange-100 transition hover:bg-orange-500 hover:text-black"
          >
            Download als PDF
          </button>
          <button
            type="button"
            onClick={onNewRoast}
            className="rounded-md bg-orange-500 px-4 py-3 text-sm font-black text-black transition hover:bg-orange-400"
          >
            Nieuwe roast
          </button>
        </div>
      </div>

      {feedback ? (
        <div className="rounded-md border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm font-bold text-orange-100">
          {feedback}
        </div>
      ) : null}

      <p className="text-sm leading-6 text-zinc-500">
        Let op: deel geen gevoelige persoonsgegevens als je het resultaat openbaar plaatst.
      </p>

      <LeadCapture result={result} />

      <ResultBlock title="🔥 Roast">
        <p className="text-lg font-semibold leading-8 text-zinc-100">{result.roast}</p>
      </ResultBlock>

      <ResultBlock title="🔍 Analyse">
        <ul className="space-y-3 text-zinc-300">
          {result.analysis.map((item) => (
            <li key={item} className="leading-7">
              - {item}
            </li>
          ))}
        </ul>
      </ResultBlock>

      <ResultBlock title="✅ Verbeterpunten">
        <ul className="space-y-3 text-zinc-300">
          {result.improvements.map((item) => (
            <li key={item} className="leading-7">
              - {item}
            </li>
          ))}
        </ul>
      </ResultBlock>

      <ResultBlock title="🚀 Verbeterde versie">
        <p className="whitespace-pre-wrap text-lg leading-8 text-zinc-100">{result.improvedVersion}</p>
      </ResultBlock>
    </section>
    </>
  );
}

function ResultBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="rounded-lg border border-white/10 bg-zinc-950/80 p-5 sm:p-6">
      <h3 className="mb-4 text-xl font-black text-white">{title}</h3>
      {children}
    </article>
  );
}

function formatResultText(result: RoastReportData) {
  return [
    "🔥 Roast",
    result.roast,
    "",
    "🔍 Analyse",
    ...result.analysis.map((item) => `- ${item}`),
    "",
    "✅ Verbeterpunten",
    ...result.improvements.map((item) => `- ${item}`),
    "",
    "🚀 Verbeterde versie",
    result.improvedVersion,
  ].join("\n");
}
