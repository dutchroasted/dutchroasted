"use client";

import { analytics } from "@/lib/analytics";

const plans = [
  {
    name: "Outfit Roast",
    price: "Gratis",
    description: "Voor een snelle, scherpe outfitcheck met humor.",
    features: [
      "5 Outfit Roasts per dag",
      "3 scherpe feedbackregels",
      "Outfitscore en stylingtips",
      "Deelbare 9:16-storykaart",
    ],
    cta: "Check mijn outfit",
    href: "/outfit-check",
    highlighted: false,
  },
  {
    name: "Premium Verdict Beta",
    price: "Tijdelijk gratis",
    description: "Een uitgebreide analyse van kleur, pasvorm, stijl, context en trends.",
    features: [
      "Diepe kleur- en pasvormanalyse",
      "Stijlidentiteit en samenhang",
      "Context- en trendscores",
      "Concrete verbeterpunten",
      "Shoprichtingen met merkvoorbeelden",
    ],
    cta: "Ontvang premium update",
    href: "mailto:info@outfitroaster.nl?subject=Premium%20update%20OutfitRoaster",
    highlighted: true,
  },
];

export function PricingCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {plans.map((plan) => (
        <article
          key={plan.name}
          className={`dr-card-hover flex rounded-3xl border p-6 sm:p-8 ${
            plan.highlighted
              ? "border-orange-500/50 bg-orange-500/[0.09] shadow-[0_22px_80px_rgba(255,106,0,0.16)]"
              : "border-white/10 bg-zinc-950/75 hover:border-white/20"
          }`}
        >
          <div className="flex w-full flex-col">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-black text-white">{plan.name}</h2>
                {plan.highlighted ? (
                  <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-black">
                    Beta
                  </span>
                ) : null}
              </div>
              <p className="mt-5 text-4xl font-black text-white">{plan.price}</p>
              <p className="mt-4 leading-7 text-zinc-400">{plan.description}</p>
            </div>

            <ul className="mt-7 space-y-3 text-zinc-300">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-3 leading-6">
                  <span className="mt-2 size-2 shrink-0 rounded-full bg-orange-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex-1" />
            <a
              href={plan.href}
              onClick={() => {
                if (plan.highlighted) {
                  analytics.premiumClicked("pricing");
                }
              }}
              className="mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-orange-500 px-5 py-4 text-center text-sm font-black text-black transition hover:bg-orange-400 hover:shadow-[0_16px_50px_rgba(255,106,0,0.18)]"
            >
              {plan.cta}
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
