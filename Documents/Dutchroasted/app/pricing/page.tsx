import { PricingCards } from "@/components/pricing/PricingCards";
import { EarlyAccessForm } from "@/components/outfit/EarlyAccessForm";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Premium Verdict Beta",
  description:
    "Vergelijk de gratis Outfit Roast met Premium Verdict Beta, tijdelijk gratis te testen.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingPage() {
  return (
    <main className="min-h-screen px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12">
        <header className="flex items-center justify-between gap-4">
          <a href="/" aria-label="Outfit Roaster home">
            <Logo />
          </a>

          <nav className="hidden items-center gap-5 text-sm font-semibold text-zinc-300 sm:flex">
            <a href="/" className="transition hover:text-white">
              Home
            </a>
            <a href="/outfit-check" className="transition hover:text-white">
              Outfit Check
            </a>
            <a href="/pricing" className="text-orange-300 transition hover:text-white">
              Prijzen
            </a>
          </nav>

          <a
            href="/outfit-check"
            className="rounded-md bg-white px-4 py-2 text-sm font-black text-black transition hover:bg-orange-500"
          >
            Check mijn outfit
          </a>
        </header>

        <section className="max-w-4xl pt-8 sm:pt-14">
          <p className="inline-flex rounded-md border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-sm font-bold text-orange-300">
            Premium Verdict Beta
          </p>
          <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
            Kies hoeveel waarheid je outfit aankan.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Start met 5 gratis Outfit Roasts per dag. Premium Verdict Beta is tijdelijk gratis te
            testen en geeft je een veel uitgebreidere stijlanalyse.
          </p>
        </section>

        <PricingCards />

        <section
          id="premium-wachtlijst"
          aria-labelledby="premium-wachtlijst-titel"
          className="scroll-mt-8 rounded-[2rem] border border-orange-400/40 bg-[radial-gradient(circle_at_top_right,rgba(255,106,0,0.24),transparent_38%),linear-gradient(145deg,rgba(255,255,255,0.09),rgba(0,0,0,0.34))] p-5 shadow-[0_24px_90px_rgba(255,106,0,0.14)] sm:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-300">
                Premium Verdict Beta
              </p>
              <h2
                id="premium-wachtlijst-titel"
                className="mt-3 text-3xl font-black text-white sm:text-4xl"
              >
                Wil je weten wanneer de volledige versie live gaat?
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-zinc-300">
                Laat je e-mailadres achter en ontvang alleen belangrijke premium-updates.
              </p>
              <ul className="mt-6 space-y-3 text-sm font-bold text-zinc-200">
                <li>✦ Als eerste horen wanneer Premium live gaat</li>
                <li>✦ Updates over nieuwe Verdict-functies</li>
                <li>✦ Geen spam, altijd eenvoudig afmelden</li>
              </ul>
            </div>
            <EarlyAccessForm variant="pricing" />
          </div>
        </section>
      </div>
    </main>
  );
}
