import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StructuredData } from "@/components/StructuredData";
import { getRelatedSeoV2Pages, type SeoV2Page } from "@/data/seo-v2-pages";
import { SITE_URL } from "@/lib/seo";
import { SeoCtaLink, SeoLandingView } from "./SeoAnalytics";

type SeoLandingPageProps = {
  page: SeoV2Page;
};

export function SeoLandingPage({ page }: SeoLandingPageProps) {
  const pageUrl = `${SITE_URL}/outfit-check/${page.slug}`;
  const relatedPages = getRelatedSeoV2Pages(page).slice(0, 6);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "OutfitRoaster",
      url: `${SITE_URL}/outfit-check`,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      inLanguage: "nl-NL",
      description:
        "Nederlandse AI-outfitchecker voor outfit roasts en Premium Verdict Beta analyses.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Outfit check",
          item: `${SITE_URL}/outfit-check`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: page.h1,
          item: pageUrl,
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen">
      <StructuredData data={structuredData} />
      <SeoLandingView slug={page.slug} pageCategory={page.category} />
      <Header />

      <article className="px-4 pb-20 pt-28 sm:px-6 sm:pt-36 lg:px-8">
        <header className="mx-auto max-w-5xl">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-2 text-sm font-bold text-zinc-500"
          >
            <a href="/" className="transition hover:text-white">
              Home
            </a>
            <span>/</span>
            <a href="/outfit-check" className="transition hover:text-white">
              Outfit check
            </a>
            <span>/</span>
            <span className="text-zinc-300">{page.h1}</span>
          </nav>

          <p className="inline-flex rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-300">
            AI outfitcheck
          </p>
          <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-7xl">
            {page.h1}
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-300">{page.intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <SeoCtaLink
              slug={page.slug}
              pageCategory={page.category}
              ctaPosition="hero"
              className="dr-primary-button inline-flex min-h-14 items-center justify-center px-6 py-4"
            >
              Upload jouw outfit
            </SeoCtaLink>
            <p className="flex items-center text-sm font-semibold leading-6 text-zinc-400">
              Ontvang direct een AI-score en een eerlijke outfitcheck.
            </p>
          </div>
        </header>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6">
          {page.sections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 sm:p-8"
            >
              <h2 className="text-3xl font-black text-white">{section.title}</h2>
              <div className="mt-5 space-y-5 leading-8 text-zinc-300">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <section className="rounded-3xl border border-orange-500/25 bg-orange-500/[0.07] p-6 sm:p-8">
            <h2 className="text-3xl font-black text-white">Concrete outfitvoorbeelden</h2>
            <ul className="mt-6 grid gap-3 md:grid-cols-3">
              {page.examples.map((example) => (
                <li
                  key={example}
                  className="rounded-2xl border border-white/10 bg-black/25 p-4 leading-7 text-zinc-200"
                >
                  {example}
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 sm:p-8">
              <h2 className="text-3xl font-black text-white">Veelgemaakte fouten</h2>
              <ul className="mt-6 space-y-3">
                {page.mistakes.map((mistake) => (
                  <li key={mistake} className="leading-7 text-zinc-300">
                    <span className="mr-2 text-orange-400">×</span>
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 sm:p-8">
              <h2 className="text-3xl font-black text-white">Praktische checklist</h2>
              <ul className="mt-6 space-y-3">
                {page.checklist.map((item) => (
                  <li key={item} className="leading-7 text-zinc-300">
                    <span className="mr-2 text-emerald-300">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="rounded-3xl border border-orange-500/30 bg-orange-500/[0.08] p-7 text-center sm:p-10">
            <h2 className="text-3xl font-black text-white">Test je outfit direct</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-zinc-300">
              Upload een foto, kies je gelegenheid en ontvang direct een AI-score en eerlijke
              outfitcheck.
            </p>
            <SeoCtaLink
              slug={page.slug}
              pageCategory={page.category}
              ctaPosition="middle"
              className="dr-primary-button mt-7 inline-flex min-h-14 items-center justify-center px-7 py-4"
            >
              Upload jouw outfit
            </SeoCtaLink>
          </section>
        </div>

        <section className="mx-auto mt-16 max-w-5xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-400">
            Veelgestelde vragen
          </p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">
            Goed om te weten
          </h2>
          <div className="mt-8 grid gap-4">
            {page.faq.map((faq) => (
              <details
                key={faq.question}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 open:border-orange-500/35"
              >
                <summary className="cursor-pointer list-none text-lg font-black text-white">
                  {faq.question}
                </summary>
                <p className="mt-4 leading-7 text-zinc-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-5xl">
          <h2 className="text-2xl font-black text-white">Gerelateerde pagina&apos;s</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {relatedPages.map((relatedPage) => (
              <a
                key={relatedPage.slug}
                href={`/outfit-check/${relatedPage.slug}`}
                className="dr-card-hover rounded-2xl border border-white/10 bg-white/[0.04] p-5 hover:border-orange-500/40"
              >
                <h3 className="font-black text-white">{relatedPage.h1}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {relatedPage.description}
                </p>
              </a>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-5xl rounded-3xl border border-orange-500/30 bg-orange-500/[0.08] p-7 text-center sm:p-10">
          <h2 className="text-3xl font-black text-white">Klaar voor je outfit verdict?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-zinc-300">
            Ontvang direct een AI-score en een eerlijke outfitcheck.
          </p>
          <SeoCtaLink
            slug={page.slug}
            pageCategory={page.category}
            ctaPosition="bottom"
            className="dr-primary-button mt-7 inline-flex min-h-14 items-center justify-center px-7 py-4"
          >
            Upload jouw outfit
          </SeoCtaLink>
        </section>
      </article>

      <Footer />
    </main>
  );
}
