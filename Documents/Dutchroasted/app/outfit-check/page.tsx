import { OutfitCheckForm } from "@/components/outfit/OutfitCheckForm";
import { Logo } from "@/components/Logo";
import { publishedSeoV2Pages } from "@/data/seo-v2-pages";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Outfit check | Outfit Roaster",
  description:
    "Upload je outfitfoto en krijg een Nederlandse AI-outfitcheck met roast, score, stylingtips of Premium Verdict Beta.",
  path: "/outfit-check",
});

export default function OutfitCheckPage() {
  const seoGroups = [
    {
      title: "Algemene outfitchecks",
      pages: publishedSeoV2Pages.filter((page) => page.category === "algemeen"),
    },
    {
      title: "Checks per gelegenheid",
      pages: publishedSeoV2Pages.filter((page) => page.category === "gelegenheid"),
    },
    {
      title: "Checks per stijl",
      pages: publishedSeoV2Pages.filter((page) => page.category === "stijl"),
    },
  ];

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
              Premium Beta
            </a>
          </nav>

          <a
            href="/pricing"
            className="dr-secondary-button min-h-11 px-4 py-3 text-center text-xs sm:text-sm"
          >
            Premium Beta
          </a>
        </header>

        <section className="grid gap-8 py-4 sm:py-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
          <div className="max-w-5xl">
            <p className="dr-kicker inline-flex rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2">
              Nederlandse AI-outfitcheck
            </p>
            <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.88] tracking-[-0.065em] text-white sm:text-7xl lg:text-[6.5rem]">
              Je spiegel liegt. <span className="dr-gradient-text">Wij niet.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-zinc-400 sm:text-xl">
              Kies voor een snelle roast of een uitgebreid Premium Verdict over stijl, pasvorm,
              kleur, context en trends.
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
              <span className="rounded-xl border border-white/10 bg-black/30 px-2 py-3">3 regels</span>
              <span className="rounded-xl border border-white/10 bg-black/30 px-2 py-3">Outfitscore</span>
              <span className="rounded-xl border border-white/10 bg-black/30 px-2 py-3">Deelkaart</span>
            </div>
          </div>
        </section>

        <OutfitCheckForm />

        <section className="dr-glass-card rounded-[2rem] p-5 sm:p-8">
          <div className="max-w-4xl">
            <p className="dr-kicker">Outfit check gids</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              Vind de juiste AI-outfitcheck.
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-300">
              Wil je meer context voordat je uploadt? Bekijk de gidsen voor dates, werk,
              festivals, streetwear, sneakers en meer. Elke pagina heeft een eigen zoekintentie,
              voorbeelden, veelgemaakte fouten en een praktische checklist.
            </p>
          </div>

          <div className="mt-10 grid gap-8">
            {seoGroups.map((group) => (
              <section key={group.title}>
                <h3 className="text-2xl font-black text-white">{group.title}</h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.pages.map((page) => (
                    <a
                      key={page.slug}
                      href={`/outfit-check/${page.slug}`}
                      className="dr-card-hover rounded-3xl border border-white/10 bg-black/25 p-5 hover:border-orange-500/40 hover:bg-orange-500/[0.06]"
                    >
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-orange-300">
                        {page.category}
                      </p>
                      <h4 className="mt-3 text-xl font-black leading-6 text-white">{page.h1}</h4>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">
                        {page.description}
                      </p>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
