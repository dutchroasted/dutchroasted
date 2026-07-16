import { Footer } from "./Footer";
import { Header } from "./Header";
import { StructuredData } from "./StructuredData";
import { BlogCtaLink, BlogView } from "./blog/BlogAnalytics";
import type { BlogPost } from "@/data/blog-posts";
import { SITE_URL } from "@/lib/seo";

type BlogPostPageProps = {
  post: BlogPost;
};

export function BlogPostPage({ post }: BlogPostPageProps) {
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.metaDescription,
      url: postUrl,
      mainEntityOfPage: postUrl,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      inLanguage: "nl-NL",
      publisher: {
        "@type": "Organization",
        name: "OutfitRoaster",
        url: SITE_URL,
        logo: `${SITE_URL}/icons/icon-512.png`,
      },
      author: {
        "@type": "Organization",
        name: "OutfitRoaster",
        url: SITE_URL,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faqs.map((faq) => ({
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
          name: "Blog",
          item: `${SITE_URL}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: postUrl,
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen">
      <StructuredData data={structuredData} />
      <BlogView slug={post.slug} articleCategory={post.articleCategory} />
      <Header />

      <article className="px-4 pb-20 pt-28 sm:px-6 sm:pt-36 lg:px-8">
        <header className="mx-auto max-w-4xl">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-2 text-sm font-bold text-zinc-500"
          >
            <a href="/" className="transition hover:text-white">
              Home
            </a>
            <span>/</span>
            <a href="/blog" className="transition hover:text-white">
              Blog
            </a>
            <span>/</span>
            <span className="text-zinc-300">{post.title}</span>
          </nav>
          <p className="inline-flex rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-300">
            OutfitRoaster gids
          </p>
          <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-7xl">
            {post.title}
          </h1>
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-zinc-500">
            {post.readingTime} · Laatst bijgewerkt op{" "}
            {new Intl.DateTimeFormat("nl-NL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(post.updatedAt))}
          </p>
          <div className="mt-7 max-w-3xl space-y-5 text-lg leading-8 text-zinc-300">
            {post.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BlogCtaLink
              slug={post.slug}
              ctaPosition="top"
              target={post.cta.target}
              className="dr-primary-button inline-flex min-h-14 items-center justify-center px-6 py-4"
            >
              {post.cta.label}
            </BlogCtaLink>
            <a
              href="/outfit-checks"
              className="dr-secondary-button inline-flex min-h-14 items-center justify-center px-6 py-4"
            >
              Bekijk alle checks
            </a>
          </div>
          <p className="mt-3 text-sm font-semibold leading-6 text-zinc-500">{post.cta.subtext}</p>
        </header>

        <div className="mx-auto mt-16 grid max-w-4xl gap-6">
          {post.sections.map((section) => (
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

          <section className="rounded-3xl border border-orange-500/30 bg-orange-500/[0.08] p-7 text-center sm:p-10">
            <h2 className="text-3xl font-black text-white">Twijfel je nog over je outfit?</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-zinc-300">{post.cta.subtext}</p>
            <BlogCtaLink
              slug={post.slug}
              ctaPosition="middle"
              target={post.cta.target}
              className="dr-primary-button mt-7 inline-flex min-h-14 items-center justify-center px-7 py-4"
            >
              {post.cta.label}
            </BlogCtaLink>
          </section>
        </div>

        <section className="mx-auto mt-16 max-w-4xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-400">
            Veelgestelde vragen
          </p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">
            Kort antwoord
          </h2>
          <div className="mt-8 grid gap-4">
            {post.faqs.map((faq) => (
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

        <section className="mx-auto mt-16 max-w-4xl">
          <h2 className="text-2xl font-black text-white">Verder lezen</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {post.relatedLinks.map((link) => (
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

        <section className="mx-auto mt-16 max-w-4xl rounded-3xl border border-orange-500/30 bg-orange-500/[0.08] p-7 text-center sm:p-10">
          <h2 className="text-3xl font-black text-white">Wil je jouw outfit checken?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-zinc-300">{post.cta.subtext}</p>
          <BlogCtaLink
            slug={post.slug}
            ctaPosition="bottom"
            target={post.cta.target}
            className="dr-primary-button mt-7 inline-flex min-h-14 items-center justify-center px-7 py-4"
          >
            {post.cta.label}
          </BlogCtaLink>
        </section>
      </article>

      <Footer />
    </main>
  );
}
