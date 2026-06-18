import { OutfitCheckForm } from "@/components/outfit/OutfitCheckForm";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Outfit Checker | Outfit Roaster",
  description: "Upload je outfitfoto en krijg eerlijke Nederlandse AI-stylingfeedback.",
};

export default function OutfitCheckPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 pb-20 pt-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-[-12rem] top-24 size-[34rem] rounded-full bg-orange-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-16rem] top-[28rem] size-[38rem] rounded-full bg-fuchsia-500/[0.06] blur-[140px]" />
      <div className="relative mx-auto flex w-full max-w-[90rem] flex-col gap-8">
        <header className="dr-glass-card flex items-center justify-between gap-3 rounded-2xl px-3 py-3 sm:px-4">
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
            className="dr-secondary-button min-h-11 px-4 py-3 text-center text-xs sm:text-sm"
          >
            Premium
          </a>
        </header>

        <section className="grid gap-8 py-4 sm:py-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
          <div className="max-w-5xl">
            <p className="dr-kicker inline-flex rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2">
              AI fashion roast · 2026 edition
            </p>
            <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.88] tracking-[-0.065em] text-white sm:text-7xl lg:text-[6.5rem]">
              Je spiegel liegt. <span className="dr-gradient-text">Wij niet.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-zinc-400 sm:text-xl">
              Upload je fit voor een scherpe Nederlandse roast, bruikbare styling-upgrades en
              een Story die klaar is voor je groepsapp.
            </p>
          </div>
          <div className="dr-glass-card rounded-[2rem] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-white">Wat je krijgt</p>
              <span className="rounded-full bg-orange-400 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-black">± 30 sec</span>
            </div>
            <p className="mt-5 text-lg font-semibold leading-8 text-zinc-200">
              Geen brave AI-pap. Wel drie punchlines, een score en concrete fixes.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[10px] font-black uppercase tracking-[0.1em] text-zinc-300">
              <span className="rounded-xl border border-white/10 bg-black/30 px-2 py-3">3 roasts</span>
              <span className="rounded-xl border border-white/10 bg-black/30 px-2 py-3">Fit score</span>
              <span className="rounded-xl border border-white/10 bg-black/30 px-2 py-3">9:16 Story</span>
            </div>
          </div>
        </section>

        <OutfitCheckForm />
      </div>
    </main>
  );
}
