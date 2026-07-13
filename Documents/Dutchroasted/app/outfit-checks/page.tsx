import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { publishedSeoV2Pages } from "@/data/seo-v2-pages";
import { createPageMetadata } from "@/lib/seo";

const groups = [
  {
    title: "Populaire checks",
    slugs: ["ai-outfit-checker", "outfit-checker", "rate-my-outfit", "outfit-roast", "outfit-score"],
  },
  {
    title: "Gelegenheden",
    slugs: [
      "date-outfit",
      "eerste-date-outfit",
      "festival-outfit",
      "sollicitatie-outfit",
      "werk-outfit",
      "smart-casual-outfit",
      "bruiloft-gast-outfit",
      "feestje-outfit",
      "vakantie-outfit",
      "uitgaan-outfit",
    ],
  },
  {
    title: "Stijl en kleur",
    slugs: [
      "streetwear-outfit",
      "old-money-outfit",
      "casual-outfit",
      "business-casual-outfit",
      "zomer-outfit",
      "winter-outfit",
      "sneaker-outfit",
      "oversized-outfit",
      "zwarte-outfit",
      "heren-outfit-check",
    ],
  },
  {
    title: "AI en stijl",
    slugs: ["outfit-tester", "outfit-beoordelen", "ai-stylist", "kledingstijl-check", "fashion-ai"],
  },
];

export const metadata = createPageMetadata({
  title: "Alle outfit checks | Outfit Roaster",
  description:
    "Bekijk alle gratis OutfitRoaster checks voor dates, werk, school, festival, kleurcombinaties, streetwear en meer.",
  path: "/outfit-checks",
});

export default function OutfitChecksPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 pb-20 pt-28 sm:px-6 sm:pt-36 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="inline-flex rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-300">
            Outfit checks
          </p>
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-7xl">
            Vind de juiste outfit check.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            Van date tot festival en van kleurcombinatie tot streetwear: kies een pagina die past
            bij je twijfel, upload je outfit en krijg direct een eerlijk verdict.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="/outfit-check"
              className="dr-primary-button inline-flex min-h-14 items-center justify-center px-6 py-4"
            >
              Upload gratis jouw outfit
            </a>
            <a
              href="/"
              className="dr-secondary-button inline-flex min-h-14 items-center justify-center px-6 py-4"
            >
              Naar homepage
            </a>
          </div>

          <div className="mt-14 space-y-12">
            {groups.map((group) => {
              const pages = group.slugs
                .map((slug) => publishedSeoV2Pages.find((page) => page.slug === slug))
                .filter((page): page is (typeof publishedSeoV2Pages)[number] => Boolean(page));

              return (
                <section key={group.title}>
                  <h2 className="text-2xl font-black text-white">{group.title}</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {pages.map((page) => (
                      <a
                        key={page.slug}
                        href={`/outfit-check/${page.slug}`}
                        className="dr-card-hover rounded-3xl border border-white/10 bg-zinc-950/70 p-5 hover:border-orange-500/40 hover:bg-orange-500/[0.06]"
                      >
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-orange-300">
                          {page.category}
                        </p>
                        <h3 className="mt-3 text-xl font-black leading-6 text-white">
                          {page.h1}
                        </h3>
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">
                          {page.description}
                        </p>
                      </a>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
