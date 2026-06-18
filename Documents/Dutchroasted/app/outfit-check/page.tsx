import { OutfitCheckForm } from "@/components/outfit/OutfitCheckForm";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Outfit Checker | Outfit Roaster",
  description: "Upload je outfitfoto en krijg eerlijke Nederlandse AI-stylingfeedback.",
};

export default function OutfitCheckPage() {
  return (
    <main className="min-h-screen overflow-hidden px-4 pb-16 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-7">
        <header className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/45 px-3 py-3 shadow-2xl shadow-black/30 backdrop-blur sm:px-4">
          <a href="/" aria-label="Outfit Roaster home">
            <Logo />
          </a>

          <nav className="hidden items-center rounded-lg border border-white/10 bg-white/[0.03] p-1 text-sm font-black text-zinc-300 md:flex">
            <a href="/" className="rounded-md px-4 py-2 transition hover:bg-white/10 hover:text-white">
              Home
            </a>
            <a href="/outfit-check" className="rounded-md bg-orange-500 px-4 py-2 text-black transition hover:bg-orange-400">
              Outfit Check
            </a>
            <a href="/pricing" className="rounded-md px-4 py-2 transition hover:bg-white/10 hover:text-white">
              Pricing
            </a>
          </nav>

          <a
            href="/pricing"
            className="min-h-11 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-center text-xs font-black text-white transition hover:border-orange-500/50 hover:bg-orange-500/10 sm:text-sm"
          >
            Premium
          </a>
        </header>

        <section className="grid gap-6 py-4 sm:py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="max-w-5xl">
            <p className="inline-flex rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-300">
              AI outfit checker
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] text-white sm:text-6xl lg:text-8xl">
              Upload je outfit. Krijg de waarheid.
            </h1>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-lg font-semibold leading-8 text-zinc-200">
              Outfit Roaster checkt je outfit met humor, eerlijkheid en stylingadvies waar je echt
              iets aan hebt.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-black uppercase tracking-[0.08em] text-zinc-400">
              <span className="rounded-lg border border-white/10 bg-black/40 px-2 py-3">Roast</span>
              <span className="rounded-lg border border-white/10 bg-black/40 px-2 py-3">Score</span>
              <span className="rounded-lg border border-white/10 bg-black/40 px-2 py-3">Tips</span>
            </div>
          </div>
        </section>

        <OutfitCheckForm />
      </div>
    </main>
  );
}
