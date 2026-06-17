export function ExampleRoast() {
  return (
    <section id="voorbeelden" className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-400">
            Voorbeeld
          </p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">
            Eerst lachen. Daarna beter aankleden.
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <article className="dr-card-hover rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h3 className="text-xl font-black text-white">Wat je uploadt</h3>
            <p className="mt-6 text-2xl font-black leading-10 text-zinc-100">
              Een outfitfoto voor een vrijdagmiddagborrel: jeans, blazer, T-shirt en sneakers.
            </p>
          </article>

          <article className="dr-card-hover rounded-3xl border border-orange-500/35 bg-[linear-gradient(145deg,rgba(255,106,0,0.14),rgba(255,255,255,0.035))] p-6 shadow-[0_24px_90px_rgba(255,106,0,0.12)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-black text-white">Wat DutchRoasted teruggeeft</h3>
              <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black text-black">
                7/10
              </span>
            </div>
            <div className="mt-6 space-y-6 text-zinc-100">
              <div>
                <p className="text-lg font-black text-orange-300">🔥 Roast:</p>
                <p className="mt-2 text-xl font-black leading-8">
                  Je blazer doet z’n best, maar je sneakers hebben besloten dat dit toch een
                  supermarktbezoek is.
                </p>
              </div>
              <div>
                <p className="text-lg font-black text-zinc-200">👀 Wat werkt:</p>
                <ul className="mt-2 space-y-2 text-zinc-300">
                  <li>- Blazer geeft direct meer vorm</li>
                  <li>- Contrast is helder en fris</li>
                  <li>- Basis is makkelijk te upgraden</li>
                </ul>
              </div>
              <div>
                <p className="text-lg font-black text-zinc-200">✨ Stylingtip:</p>
                <p className="mt-2 leading-7 text-zinc-300">
                  Wissel naar een leren sneaker of loafer en voeg één sterk accessoire toe.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
