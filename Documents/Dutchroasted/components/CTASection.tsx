"use client";

import { analytics } from "@/lib/analytics";

export function CTASection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-3xl border border-orange-500/30 bg-[linear-gradient(135deg,rgba(255,106,0,0.18),rgba(255,255,255,0.05)_48%,rgba(0,0,0,0.7))] p-8 shadow-[0_28px_110px_rgba(255,106,0,0.12)] sm:p-12 lg:p-16">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-black leading-tight text-white sm:text-6xl">
            Klaar voor je outfit verdict?
          </h2>
          <p className="mt-5 text-lg leading-8 text-zinc-300">
            Upload je outfitfoto en ontdek eerlijk wat werkt, wat schuurt en wat sterker kan.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/outfit-check"
              className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-orange-500 px-6 py-4 text-center text-base font-black text-black shadow-[0_18px_60px_rgba(255,106,0,0.24)] transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              Check mijn outfit
            </a>
            <a
              href="mailto:info@outfitroaster.nl?subject=Premium%20update%20OutfitRoaster"
              onClick={() => analytics.premiumClicked("homepage")}
              className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center text-base font-black text-white transition hover:border-white/30 hover:bg-white/10"
            >
              Ontvang premium update
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
