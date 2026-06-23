const features = [
  "Kleuranalyse",
  "Pasvormanalyse",
  "Stijlidentiteit",
  "Trendscore",
  "Concrete verbeterpunten",
];

export function ProAnalysisTeaser() {
  return (
    <article className="rounded-[2rem] border border-violet-300/20 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.2),transparent_35%),linear-gradient(145deg,rgba(255,255,255,0.07),rgba(0,0,0,0.28))] p-5 shadow-[0_24px_80px_rgba(76,29,149,0.12)] sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
        💎 Premium Verdict Beta
      </p>
      <h3 className="mt-3 text-2xl font-black text-white">
        Wil je een echte stijlanalyse?
      </h3>
      <p className="mt-3 leading-7 text-zinc-300">
        Tijdelijk gratis te testen. Later onderdeel van Premium.
      </p>
      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm font-bold text-zinc-200">
            <span className="text-violet-300">✦</span>
            {feature}
          </li>
        ))}
      </ul>
      <a
        href="/outfit-check"
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/10 px-5 py-3 text-sm font-black text-violet-100 sm:w-auto"
      >
        Test Premium Verdict Beta
      </a>
    </article>
  );
}
