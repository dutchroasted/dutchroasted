import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StructuredData } from "@/components/StructuredData";
import {
  PressAssetLink,
  PressContactLink,
  PressPageView,
  PressScreenshotGallery,
} from "@/components/press/PressInteractions";
import { createPageMetadata, SITE_URL } from "@/lib/seo";

const contactEmail = "info@outfitroaster.nl";
const contactHref = `mailto:${contactEmail}?subject=Press%20request%20OutfitRoaster`;

const quickFacts = [
  ["Company", "OutfitRoaster"],
  ["Founded", "2026"],
  ["Country", "The Netherlands"],
  ["Founder", "Nathan Okkerse"],
  ["Category", "Artificial Intelligence · Fashion Technology"],
  ["Website", "https://outfitroaster.com"],
  ["Platform", "Web Application"],
  ["Languages", "Dutch · English future"],
];

const features = [
  "AI Outfit Score",
  "Brutal AI Roast",
  "Professional Style Analysis",
  "Festival Outfit Checker",
  "Date Outfit Checker",
  "Share Cards",
  "TikTok Video Export",
  "Instant Feedback",
];

const techStack = [
  ["N", "Next.js"],
  ["AI", "OpenAI"],
  ["SB", "Supabase"],
  ["▲", "Vercel"],
  ["S", "Stripe"],
  ["GA", "Google Analytics"],
  ["C", "Microsoft Clarity"],
];

const timeline = [
  ["Idea", "A fast, funny outfit checker that turns fashion feedback into something shareable."],
  ["First Prototype", "The first upload, AI verdict and roast flow were built as a focused side project."],
  ["Public Launch", "OutfitRoaster went live as a web application for instant Dutch outfit feedback."],
  ["SEO Expansion", "Evergreen outfit guides, landing pages and blog articles were added for discoverability."],
  ["Premium", "Premium Verdict Beta explores deeper analysis for color, fit, cohesion and trends."],
  ["Future Mobile App", "A mobile-first product experience is a logical next step if demand keeps growing."],
];

const screenshots = [
  {
    src: "/opengraph-image",
    title: "OutfitRoaster social preview",
    description: "The current OpenGraph image used when OutfitRoaster is shared.",
  },
  {
    src: "/icons/icon-512.png",
    title: "App icon",
    description: "The app icon used for install and press references.",
  },
  {
    src: "/icons/apple-touch-icon.png",
    title: "Apple touch icon",
    description: "Mobile icon asset for iOS and app-like previews.",
  },
];

const assets = [
  ["Logo SVG", "/icons/favicon.svg", "logo-svg"],
  ["App icon 512 PNG", "/icons/icon-512.png", "app-icon-512"],
  ["App icon 192 PNG", "/icons/icon-192.png", "app-icon-192"],
  ["Apple touch icon", "/icons/apple-touch-icon.png", "apple-touch-icon"],
  ["Social preview", "/opengraph-image", "social-preview"],
];

const faqs = [
  {
    question: "What is OutfitRoaster?",
    answer:
      "OutfitRoaster is an AI-powered outfit checker that gives users an instant outfit score, a witty roast or a more detailed style analysis.",
  },
  {
    question: "How does it work?",
    answer:
      "Users upload an outfit photo, select context such as occasion and feedback level, and receive AI-generated feedback about visible clothing, styling, color and fit.",
  },
  {
    question: "Is it free?",
    answer:
      "OutfitRoaster offers a free roast flow. Premium Verdict Beta is currently used for deeper style analysis experiments.",
  },
  {
    question: "What AI does it use?",
    answer:
      "OutfitRoaster uses modern AI tooling, including OpenAI technology, to analyze visible outfit details and generate natural-language feedback.",
  },
  {
    question: "Can I review it?",
    answer:
      "Yes. Journalists, bloggers, AI directories, reviewers and creators can test the public web application and contact OutfitRoaster for questions.",
  },
  {
    question: "How can I contact the founder?",
    answer: `For media requests, interviews, podcasts or reviews, email ${contactEmail}.`,
  },
];

export const metadata = createPageMetadata({
  title: "Press Kit | OutfitRoaster",
  description:
    "Media resources, screenshots, company information and founder story for OutfitRoaster.",
  path: "/press",
});

export default function PressPage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "OutfitRoaster",
      url: SITE_URL,
      logo: `${SITE_URL}/icons/icon-512.png`,
      founder: {
        "@type": "Person",
        name: "Nathan Okkerse",
      },
      foundingDate: "2026",
      foundingLocation: {
        "@type": "Country",
        name: "The Netherlands",
      },
      email: contactEmail,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "OutfitRoaster",
      url: SITE_URL,
      inLanguage: "nl-NL",
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
          name: "Press Kit",
          item: `${SITE_URL}/press`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <main className="min-h-screen">
      <StructuredData data={structuredData} />
      <PressPageView />
      <Header />

      <section className="px-4 pb-20 pt-28 sm:px-6 sm:pt-36 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-300">
                Media resources
              </p>
              <h1 className="mt-6 text-6xl font-black leading-[0.9] tracking-[-0.06em] text-white sm:text-8xl">
                Press Kit
              </h1>
              <p className="mt-5 text-2xl font-black text-orange-300">
                Everything you need to write about OutfitRoaster.
              </p>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
                OutfitRoaster is an AI-powered outfit checker that combines fashion analysis with
                humor. Upload an outfit, receive an instant AI score, a witty roast or detailed
                style feedback, and share your results.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/"
                  className="dr-primary-button inline-flex min-h-14 items-center justify-center px-6 py-4"
                >
                  Visit OutfitRoaster
                </a>
                <PressContactLink
                  href={contactHref}
                  location="hero"
                  className="dr-secondary-button inline-flex min-h-14 items-center justify-center px-6 py-4"
                >
                  Contact
                </PressContactLink>
                <a
                  href="#brand-assets"
                  className="dr-secondary-button inline-flex min-h-14 items-center justify-center px-6 py-4"
                >
                  Download Brand Assets
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-zinc-950/70 p-6 shadow-[0_0_80px_rgba(255,106,0,0.12)]">
              <div className="rounded-[1.5rem] border border-orange-500/25 bg-gradient-to-br from-orange-500/20 via-zinc-950 to-black p-6">
                <Image
                  src="/icons/icon-512.png"
                  alt="OutfitRoaster app icon"
                  width={160}
                  height={160}
                  priority
                  className="rounded-[2rem] shadow-[0_0_50px_rgba(255,106,0,0.35)]"
                />
                <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-orange-300">
                  AI Styling Verdict
                </p>
                <p className="mt-3 text-4xl font-black leading-none text-white">
                  Fashion feedback with a punchline.
                </p>
                <p className="mt-5 leading-7 text-zinc-300">
                  Built for fast outfit checks, shareable roasts and deeper style analysis.
                </p>
              </div>
            </div>
          </div>

          <section className="mt-20 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 sm:p-8">
              <h2 className="text-3xl font-black text-white">About OutfitRoaster</h2>
              <div className="mt-5 space-y-5 leading-8 text-zinc-300">
                <p>
                  OutfitRoaster is a web application that lets people upload an outfit photo and
                  receive instant AI feedback. The product sits between fashion analysis,
                  entertainment and social sharing. It can give a fast outfit score, a sharp but
                  safe roast, or a more detailed verdict about color, fit, cohesion, context and
                  trends.
                </p>
                <p>
                  The idea behind OutfitRoaster is simple: most outfit feedback online is either
                  too vague, too serious or too slow. Traditional outfit checkers often feel like
                  generic styling advice. OutfitRoaster is designed to be more direct. It looks at
                  visible clothing details, the occasion and the overall vibe, then turns that into
                  feedback people can actually understand and share.
                </p>
                <p>
                  Humor is a key part of the product. The free roast mode is built for short,
                  memorable comments that make people laugh without attacking the person. The
                  target is always the outfit: clothing, shoes, colors, accessories, styling and
                  occasion fit. Premium Verdict Beta explores the more serious side of the same
                  concept, with deeper analysis for users who want practical style feedback rather
                  than a quick punchline.
                </p>
                <p>
                  OutfitRoaster was created as a modern AI-native product: fast to use, mobile
                  first, and built around the way people already share outfit opinions in group
                  chats, stories and short-form video.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 sm:p-8">
              <h2 className="text-3xl font-black text-white">Founder Story</h2>
              <div className="mt-5 space-y-5 leading-8 text-zinc-300">
                <p>
                  OutfitRoaster was built by Nathan Okkerse as a side project. It started from a
                  practical question: how quickly can a useful, funny and public-facing AI product
                  be built with today&apos;s tools? The answer became a working outfit checker that
                  combines image analysis, Dutch humor, share cards, video export and SEO content.
                </p>
                <p>
                  The first version was built in a few evenings and weekends. Instead of spending
                  months on a large product plan, the focus was on shipping a real flow: upload a
                  photo, get an instant verdict, and make the result easy to share. Modern AI tools
                  made it possible to move quickly from idea to prototype and then keep improving
                  the product based on what users noticed.
                </p>
                <p>
                  The goal is not to present OutfitRoaster as a polished corporate fashion brand.
                  It is intentionally more direct and playful: a product that shows how AI can be
                  useful, funny and culturally specific at the same time. It is also a small
                  demonstration of how fast independent builders can now create and launch web
                  applications when design, development and AI workflows are tightly combined.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-3xl font-black text-white">Quick Facts</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {quickFacts.map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-300">
                    {label}
                  </p>
                  <p className="mt-3 font-black text-white">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-3xl font-black text-white">Features</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5"
                >
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-orange-500 text-lg font-black text-black">
                    ✓
                  </span>
                  <h3 className="mt-5 text-xl font-black text-white">{feature}</h3>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-3xl font-black text-white">Tech Stack</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {techStack.map(([logo, label]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <span className="flex size-12 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10 text-lg font-black text-orange-300">
                    {logo}
                  </span>
                  <h3 className="mt-5 text-xl font-black text-white">{label}</h3>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-3xl font-black text-white">Timeline</h2>
            <div className="mt-8 grid gap-4">
              {timeline.map(([title, text], index) => (
                <div
                  key={title}
                  className="grid gap-4 rounded-3xl border border-white/10 bg-zinc-950/70 p-5 sm:grid-cols-[7rem_1fr]"
                >
                  <div className="text-sm font-black uppercase tracking-[0.16em] text-orange-300">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">{title}</h3>
                    <p className="mt-2 leading-7 text-zinc-400">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-3xl font-black text-white">Screenshots</h2>
            <p className="mt-3 max-w-3xl leading-7 text-zinc-400">
              Current available visual assets from the live project. More product screenshots can
              be added here as the public press kit expands.
            </p>
            <div className="mt-6">
              <PressScreenshotGallery screenshots={screenshots} />
            </div>
          </section>

          <section
            id="brand-assets"
            className="mt-16 rounded-3xl border border-orange-500/30 bg-orange-500/[0.08] p-6 sm:p-8"
          >
            <h2 className="text-3xl font-black text-white">Brand Assets</h2>
            <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
              Download the currently available logo, icon and social preview assets. These files
              are suitable for articles, reviews, AI directories and social posts about
              OutfitRoaster.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {assets.map(([label, href, assetName]) => (
                <PressAssetLink
                  key={assetName}
                  href={href}
                  assetName={assetName}
                  className="dr-secondary-button inline-flex min-h-14 items-center justify-center px-5 py-4"
                >
                  Download {label}
                </PressAssetLink>
              ))}
            </div>
          </section>

          <section className="mt-16 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 sm:p-8">
              <h2 className="text-3xl font-black text-white">Media Contact</h2>
              <p className="mt-5 leading-8 text-zinc-300">
                For interviews, reviews, podcasts, AI directories, creator collaborations or press
                questions, contact OutfitRoaster directly.
              </p>
              <PressContactLink
                href={contactHref}
                location="media_contact"
                className="dr-primary-button mt-7 inline-flex min-h-14 items-center justify-center px-7 py-4"
              >
                Email {contactEmail}
              </PressContactLink>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-300">
                FAQ
              </p>
              <h2 className="mt-3 text-3xl font-black text-white">Press questions</h2>
              <div className="mt-6 grid gap-3">
                {faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 open:border-orange-500/35"
                  >
                    <summary className="cursor-pointer list-none font-black text-white">
                      {faq.question}
                    </summary>
                    <p className="mt-4 leading-7 text-zinc-400">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
