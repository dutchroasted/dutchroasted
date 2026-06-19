const plans = [
  {
    name: "Gratis",
    price: "€0",
    description: "Voor je dagelijkse styling reality check.",
    features: [
      "5 Outfit Roasts per dag",
      "Roast + score",
      "Stylingtips",
      "Shop suggesties",
    ],
    cta: "Start gratis",
    href: "/outfit-check",
    highlighted: false,
    disabled: false,
  },
  {
    name: "Premium",
    price: "€4,99 per maand",
    description: "Voor wie diepere AI-stijlanalyses wil gebruiken.",
    features: [
      "Diepe kleur- en pasvormanalyse",
      "Stijlidentiteit en samenhang",
      "Trendscore",
      "Concrete verbeterpunten",
      "Pro style report",
    ],
    cta: "Binnenkort beschikbaar",
    href: "#",
    highlighted: true,
    disabled: true,
  },
  {
    name: "Pro",
    price: "€9,99 per maand",
    description: "Voor toekomstige persoonlijke stylingfuncties.",
    features: [
      "Alles van Premium",
      "Capsule wardrobe advies",
      "Date/work/festival outfit hulp",
      "Seizoensadvies",
      "Persoonlijke stijlontwikkeling",
    ],
    cta: "Binnenkort beschikbaar",
    href: "#",
    highlighted: false,
    disabled: true,
  },
];

export function PricingCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {plans.map((plan) => (
        <article
          key={plan.name}
          className={`dr-card-hover flex rounded-3xl border p-6 sm:p-7 ${
            plan.highlighted
              ? "border-orange-500/50 bg-orange-500/[0.09] shadow-[0_22px_80px_rgba(255,106,0,0.16)]"
              : "border-white/10 bg-zinc-950/75 hover:border-white/20"
          }`}
        >
          <div className="flex w-full flex-col">
            <div>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black text-white">{plan.name}</h2>
                {plan.highlighted ? (
                  <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-black">
                    Populair
                  </span>
                ) : null}
              </div>
              <p className="mt-5 text-4xl font-black text-white">{plan.price}</p>
              <p className="mt-4 min-h-14 leading-7 text-zinc-400">{plan.description}</p>
            </div>

            <ul className="mt-7 space-y-3 text-zinc-300">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-3 leading-6">
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-orange-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex-1" />

            {plan.disabled ? (
              <button
                type="button"
                disabled
                className="mt-8 min-h-12 w-full cursor-not-allowed rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black text-zinc-500"
              >
                {plan.cta}
              </button>
            ) : (
              <a
                href={plan.href}
                className="mt-8 min-h-12 w-full rounded-2xl bg-orange-500 px-5 py-3 text-center text-sm font-black text-black transition hover:bg-orange-400 hover:shadow-[0_16px_50px_rgba(255,106,0,0.18)]"
              >
                {plan.cta}
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
