export function PricingTeaser() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-lg border border-orange-500/25 bg-orange-500/[0.07] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-300">
            Pricing
          </p>
          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            Gratis starten met 5 Outfit Roasts per dag. Pro Analyse komt eraan.
          </h2>
        </div>
        <a
          href="/pricing"
          className="rounded-md border border-white/15 bg-white px-5 py-3 text-center text-sm font-black text-black transition hover:bg-orange-500"
        >
          Bekijk pricing
        </a>
      </div>
    </section>
  );
}
