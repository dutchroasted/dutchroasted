import { Footer } from "./Footer";
import { Header } from "./Header";
import { StructuredData } from "./StructuredData";
import type { SeoPage } from "@/data/seo-pages";
import { SITE_URL } from "@/lib/seo";

type SeoLandingPageProps = {
  page: SeoPage;
};

export function SeoLandingPage({ page }: SeoLandingPageProps) {
  const pageUrl = `${SITE_URL}/${page.slug}`;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "OutfitRoaster",
      url: SITE_URL,
      inLanguage: "nl-NL",
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/outfit-check?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
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
      mainEntity: page.faqs.map((faq) => ({
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
      "@type": "Article",
      headline: page.h1,
      description: page.metaDescription,
      url: pageUrl,
      mainEntityOfPage: pageUrl,
      inLanguage: "nl-NL",
      publisher: {
        "@type": "Organization",
        name: "OutfitRoaster",
        url: SITE_URL,
      },
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
          name: "Outfit checks",
          item: `${SITE_URL}/outfit-checks`,
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
            <a href="/outfit-checks" className="transition hover:text-white">
              Outfit checks
            </a>
            <span>/</span>
            <span className="text-zinc-300">{page.h1}</span>
          </nav>
          <p className="inline-flex rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-300">
            {page.eyebrow}
          </p>
          <h1 className="mt-6 text-5xl font-black leading-[0.95] text-white sm:text-7xl">
            {page.h1}
          </h1>
          <div className="mt-7 max-w-3xl space-y-5 text-lg leading-8 text-zinc-300">
            {page.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
              Naar Outfit Roaster
            </a>
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
              {section.bullets ? (
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.06] p-4 leading-7 text-zinc-200"
                    >
                      <span className="mr-2 text-orange-400">✦</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <section className="mx-auto mt-16 max-w-5xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-400">
            Veelgestelde vragen
          </p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">
            Goed om te weten
          </h2>
          <div className="mt-8 grid gap-4">
            {page.faqs.map((faq) => (
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
            {(page.relatedLinks ?? []).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="dr-card-hover rounded-2xl border border-white/10 bg-white/[0.04] p-5 hover:border-orange-500/40"
              >
                <h3 className="font-black text-white">{link.label}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{link.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-5xl rounded-3xl border border-orange-500/30 bg-orange-500/[0.08] p-7 text-center sm:p-10">
          <h2 className="text-3xl font-black text-white">Klaar voor je outfit verdict?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-zinc-300">
            Upload een duidelijke foto, kies de gelegenheid en ontdek direct wat werkt en wat
            sterker kan.
          </p>
          <a
            href="/outfit-check"
            className="dr-primary-button mt-7 inline-flex min-h-14 items-center justify-center px-7 py-4"
          >
            Upload gratis jouw outfit
          </a>
        </section>
      </article>

      <Footer />
    </main>
  );
}
