import { analytics } from "@/lib/analytics";
import type { ProAnalysisResult as ProAnalysisResultData } from "@/lib/outfitTypes";

const PREMIUM_BETA_ENABLED = process.env.NEXT_PUBLIC_PREMIUM_BETA !== "false";

type ProAnalysisResultProps = {
  result: ProAnalysisResultData;
  onNewCheck: () => void;
};

const analysisLabels = {
  colorAnalysis: "Kleur",
  fitAnalysis: "Pasvorm",
  cohesionAnalysis: "Samenhang",
} as const;

export function ProAnalysisResult({ result, onNewCheck }: ProAnalysisResultProps) {
  return (
    <section className="dr-fade-in space-y-5">
      <div className="rounded-[2rem] border border-violet-300/25 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.24),transparent_38%),linear-gradient(145deg,rgba(255,255,255,0.08),rgba(0,0,0,0.3))] p-5 sm:p-7">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
          💎 {PREMIUM_BETA_ENABLED ? "Premium Verdict Beta" : "Premium Pro Analyse"}
        </p>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white sm:text-5xl">{result.styleIdentity}</h2>
            <p className="mt-3 text-zinc-300">Diepe AI-analyse van je volledige outfit.</p>
          </div>
          <div className="rounded-2xl bg-violet-400 px-4 py-3 text-center text-black">
            <p className="text-[10px] font-black uppercase tracking-[0.14em]">Overall</p>
            <p className="text-3xl font-black">{result.overallScore}/10</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {result.styleCategories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-2 text-xs font-black text-violet-100"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      <article className="dr-glass-card rounded-3xl p-5 sm:p-6">
        <h3 className="text-xl font-black text-white">Eindscore</h3>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <ScoreTile label="Stijl" score={result.scoreBreakdown.style} />
          <ScoreTile label="Kleuren" score={result.scoreBreakdown.colors} />
          <ScoreTile label="Pasvorm" score={result.scoreBreakdown.fit} />
          <ScoreTile label="Trends" score={result.scoreBreakdown.trends} />
          <ScoreTile label="Context" score={result.scoreBreakdown.context} />
          <ScoreTile label="Totaal" score={result.overallScore} featured />
        </div>
      </article>

      <div className="grid gap-4 md:grid-cols-3">
        {(Object.keys(analysisLabels) as Array<keyof typeof analysisLabels>).map((key) => {
          const section = result[key];
          return (
            <article key={key} className="dr-glass-card rounded-3xl p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-black text-white">{analysisLabels[key]}</h3>
                <span className="rounded-full bg-violet-400/15 px-3 py-1 text-sm font-black text-violet-200">
                  {section.score}/10
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{section.summary}</p>
              <AnalysisList title="Sterk" items={section.strengths} />
              <AnalysisList title="Verbeteren" items={section.improvements} />
            </article>
          );
        })}
      </div>

      <article className="dr-glass-card rounded-3xl p-5 sm:p-6">
        <h3 className="text-xl font-black text-white">Gedragen kleuren</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {result.wornColors.map((color) => (
            <span
              key={color}
              className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-bold text-zinc-200"
            >
              {color}
            </span>
          ))}
        </div>
      </article>

      <div className="grid gap-4 sm:grid-cols-2">
        <ScoreSummary title="Gekozen context" data={result.occasionFit} />
        <ScoreSummary title="Trendanalyse" data={result.trendScore} />
      </div>

      <article className="dr-glass-card rounded-3xl p-5 sm:p-6">
        <h3 className="text-xl font-black text-white">Contextanalyse</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Zo sterk werkt deze outfit in verschillende situaties.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {result.contextAnalysis.map((context) => (
            <div
              key={context.occasion}
              className="rounded-2xl border border-white/10 bg-black/25 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-black text-white">{context.occasion}</h4>
                <span className="font-black text-violet-300">{context.score}/10</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{context.summary}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="dr-glass-card rounded-3xl p-5 sm:p-6">
        <h3 className="text-xl font-black text-white">Stylistadvies</h3>
        <p className="mt-3 leading-7 text-zinc-300">{result.stylistAdvice}</p>
      </article>

      <div className="grid gap-4 md:grid-cols-2">
        <ResultItems title="Sterke punten" items={result.strengths} />
        <ResultItems title="3 concrete verbeterpunten" items={result.improvementPoints} />
      </div>
      <ResultItems title="Voorgestelde upgrades" items={result.suggestedUpgrades} />
      {result.shopSuggestions.length > 0 ? (
        <article className="dr-glass-card rounded-3xl p-5">
          <h3 className="text-lg font-black text-white">Shop suggesties</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {result.shopSuggestions.map((item) => (
              <a
                key={`${item.title}-${item.searchQuery}`}
                href={item.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.shopItemClicked(item.category, item.searchQuery)}
                className="rounded-2xl border border-white/10 bg-black/25 p-4 transition hover:border-violet-300/40"
              >
                <p className="font-black text-white">{item.title}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-violet-300">
                  {item.brand} · {item.category}
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{item.reason}</p>
                <p className="mt-3 text-xs leading-5 text-zinc-500">
                  Voor: {item.improvementPoint}
                </p>
                <p className="mt-2 text-xs font-bold text-zinc-400">
                  Zoekterm: {item.searchQuery}
                </p>
              </a>
            ))}
          </div>
        </article>
      ) : null}

      <button type="button" onClick={onNewCheck} className="dr-primary-button min-h-12 w-full px-5 py-3 sm:w-auto">
        Nieuwe analyse
      </button>
    </section>
  );
}

function ScoreTile({
  label,
  score,
  featured = false,
}: {
  label: string;
  score: number;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 text-center ${
        featured
          ? "border-violet-300/40 bg-violet-400 text-black"
          : "border-white/10 bg-black/25 text-white"
      }`}
    >
      <p className="text-xs font-black uppercase tracking-[0.12em] opacity-70">{label}</p>
      <p className="mt-2 text-3xl font-black">{score}/10</p>
    </div>
  );
}

function AnalysisList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-4">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-violet-300">{title}</p>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-zinc-400">
        {items.map((item) => <li key={item}>• {item}</li>)}
      </ul>
    </div>
  );
}

function ScoreSummary({ title, data }: { title: string; data: { score: number; summary: string } }) {
  return (
    <article className="dr-glass-card rounded-3xl p-5">
      <div className="flex justify-between gap-3">
        <h3 className="font-black text-white">{title}</h3>
        <span className="font-black text-violet-300">{data.score}/10</span>
      </div>
      <p className="mt-3 leading-7 text-zinc-300">{data.summary}</p>
    </article>
  );
}

function ResultItems({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="dr-glass-card rounded-3xl p-5">
      <h3 className="text-lg font-black text-white">{title}</h3>
      <ul className="mt-3 space-y-2 leading-7 text-zinc-300">
        {items.map((item) => <li key={item}>• {item}</li>)}
      </ul>
    </article>
  );
}
