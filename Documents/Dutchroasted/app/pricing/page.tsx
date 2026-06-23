import { PricingCards } from "@/components/pricing/PricingCards";
import { EarlyAccessForm } from "@/components/outfit/EarlyAccessForm";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Prijzen | Outfit Roaster",
  description: "Start gratis of activeer Outfit Roaster Premium.",
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
            Premium
          </p>
          <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
            Kies hoe uitgebreid je stylingrapport wordt.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Premium Verdict is tijdelijk gratis te testen in beta. Wil je een seintje wanneer de
            volledige premium versie live gaat?
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
                Premium wachtlijst
              </p>
              <h2
                id="premium-wachtlijst-titel"
                className="mt-3 text-3xl font-black text-white sm:text-4xl"
              >
                Nog niet klaar om te betalen?
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-zinc-300">
                Zet je op de wachtlijst en ontvang updates over Premium.
              </p>
              <ul className="mt-6 space-y-3 text-sm font-bold text-zinc-200">
                <li>✦ 1 maand gratis Premium bij lancering</li>
                <li>✦ Als eerste toegang tot Pro Analyse</li>
                <li>✦ Kans op lifetime korting voor vroege testers</li>
              </ul>
            </div>
            <EarlyAccessForm variant="pricing" />
          </div>
        </section>
      </div>
    </main>
  );
}
