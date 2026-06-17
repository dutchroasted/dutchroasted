export function Hero() {
  return (
    <section className="relative px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="h-full w-full bg-[linear-gradient(135deg,rgba(255,106,0,0.18),transparent_34%),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:auto,62px_62px,62px_62px]" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-300">
            Nederlandse AI outfit checker
          </p>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-normal text-white sm:text-7xl lg:text-8xl">
            Upload je outfit.
            <br />
            Krijg de waarheid.
          </h1>
          <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-zinc-300 sm:text-xl">
            Een AI-stylist met humor checkt je outfit op stijl, pasvorm, kleur en vibe.
            Eerlijk advies. Geen bodyshaming.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="/outfit-check"
              className="min-h-14 rounded-2xl bg-orange-500 px-6 py-4 text-center text-base font-black text-black shadow-[0_18px_60px_rgba(255,106,0,0.28)] transition hover:bg-orange-400 hover:shadow-[0_24px_80px_rgba(255,106,0,0.34)] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              Check mijn outfit
            </a>
            <a
              href="#voorbeelden"
              className="min-h-14 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center text-base font-black text-white transition hover:border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-black"
            >
              Bekijk voorbeeld
            </a>
          </div>

          <p className="mt-5 text-sm font-medium text-zinc-500">
            Geen account nodig. Upload je foto en krijg direct stylingfeedback.
          </p>
        </div>

        <div className="relative">
          <div className="dr-card-hover rotate-0 rounded-3xl border border-white/12 bg-zinc-950/80 p-4 shadow-2xl shadow-black/60 lg:rotate-1">
            <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-4">
              <span className="size-3 rounded-full bg-orange-500" />
              <span className="size-3 rounded-full bg-zinc-500" />
              <span className="size-3 rounded-full bg-white" />
              <span className="ml-auto text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                Preview
              </span>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-orange-500/35 bg-orange-500/[0.12] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-200">
                      Score
                    </p>
                    <p className="mt-2 text-6xl font-black leading-none text-white">7.8</p>
                  </div>
                  <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black text-black">
                    Sterke fit
                  </span>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black p-5">
                <p className="text-sm font-black text-orange-300">🔥 Roast</p>
                <p className="mt-3 text-xl font-black leading-8 text-white">
                  De blazer doet de date. De sneakers vragen nog of er een dresscode was.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-black text-zinc-300">✨ Stylingtip</p>
                <p className="mt-2 text-base leading-7 text-zinc-300">
                  Wissel naar een leren sneaker of loafer en voeg één accessoire toe dat zegt:
                  ik heb hierover nagedacht.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
