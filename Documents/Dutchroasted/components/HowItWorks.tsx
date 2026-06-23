const steps = [
  ["1", "Upload je outfitfoto", "Kies een duidelijke foto waarop je outfit goed zichtbaar is."],
  ["2", "Kies de gelegenheid", "Date, werk, school, gym, feest of festival."],
  ["3", "Krijg roast, score en stylingtips", "Eerst de waarheid, daarna concrete outfit-upgrades."],
];

export function HowItWorks() {
  return (
    <section id="hoe-werkt-het" className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-400">
            Simpel proces
          </p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">Hoe werkt het?</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {steps.map(([number, title, description]) => (
            <article
              key={number}
              className="dr-card-hover rounded-3xl border border-white/10 bg-white/[0.04] p-6 hover:border-orange-500/35 hover:bg-orange-500/[0.055]"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-orange-500 text-lg font-black text-black shadow-[0_14px_45px_rgba(255,106,0,0.2)]">
                {number}
              </div>
              <h3 className="mt-6 text-2xl font-black leading-tight text-white">{title}</h3>
              <p className="mt-3 leading-7 text-zinc-400">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
