import { PricingCards } from "@/components/pricing/PricingCards";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Pricing | Outfit Roaster",
  description: "Start gratis met Outfit Roaster. Premium en Pro komen eraan.",
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
              Pricing
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
            Premium komt eraan
          </p>
          <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
            Kies hoe uitgebreid je stylingrapport straks wordt.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Start gratis met 1 outfit check per dag. Upgrade straks voor onbeperkt checken,
            style history en betere shop suggesties.
          </p>
        </section>

        <PricingCards />
      </div>
    </main>
  );
}
