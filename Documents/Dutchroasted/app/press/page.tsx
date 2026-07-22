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
const contactHref = `mailto:${contactEmail}?subject=Persaanvraag%20OutfitRoaster`;

const quickFacts = [
  ["Bedrijf", "OutfitRoaster"],
  ["Opgericht", "2026"],
  ["Land", "Nederland"],
  ["Oprichter", "Nathan Okkerse"],
  ["Categorie", "Artificial Intelligence · Fashion Technology"],
  ["Website", "https://outfitroaster.com"],
  ["Platform", "Webapplicatie"],
  ["Talen", "Nederlands · Engels mogelijk later"],
];

const features = [
  "AI-outfitscore",
  "Genadeloze AI-roast",
  "Professionele stijlanalyse",
  "Festival outfit checker",
  "Date outfit checker",
  "Deelbare kaarten",
  "TikTok-video export",
  "Directe feedback",
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
  ["Idee", "Een snelle, grappige outfitchecker die modefeedback deelbaar maakt."],
  ["Eerste prototype", "De eerste uploadflow, AI-score en roast werden gebouwd als side project."],
  ["Publieke lancering", "OutfitRoaster ging live als webapp voor directe Nederlandse outfitfeedback."],
  ["SEO-uitbreiding", "Evergreen gidsen, landingspagina’s en blogartikelen werden toegevoegd."],
  ["Premium", "Premium Verdict Beta test diepere analyses voor kleur, pasvorm, samenhang en trends."],
  ["Mogelijke mobiele app", "Een mobile-first app is een logische volgende stap als de vraag blijft groeien."],
];

const screenshots = [
  {
    src: "/opengraph-image",
    title: "Social preview",
    description: "De huidige OpenGraph-afbeelding die gebruikt wordt wanneer OutfitRoaster gedeeld wordt.",
  },
  {
    src: "/icons/icon-512.png",
    title: "App-icoon",
    description: "Het app-icoon voor installaties, directories en persvermeldingen.",
  },
  {
    src: "/icons/apple-touch-icon.png",
    title: "Apple touch icon",
    description: "Mobiel icoon voor iOS en app-achtige previews.",
  },
];

const assets = [
  ["Logo SVG", "/icons/favicon.svg", "logo-svg"],
  ["App-icoon 512 PNG", "/icons/icon-512.png", "app-icon-512"],
  ["App-icoon 192 PNG", "/icons/icon-192.png", "app-icon-192"],
  ["Apple touch icon", "/icons/apple-touch-icon.png", "apple-touch-icon"],
  ["Social preview", "/opengraph-image", "social-preview"],
];

const faqs = [
  {
    question: "Wat is OutfitRoaster?",
    answer:
      "OutfitRoaster is een AI-outfitchecker waarmee gebruikers een outfit uploaden en direct een score, roast of uitgebreidere stijlanalyse krijgen.",
  },
  {
    question: "Hoe werkt OutfitRoaster?",
    answer:
      "Gebruikers uploaden een outfitfoto, kiezen context zoals gelegenheid en feedbackniveau, en ontvangen AI-feedback over zichtbare kleding, styling, kleur en pasvorm.",
  },
  {
    question: "Is OutfitRoaster gratis?",
    answer:
      "OutfitRoaster heeft een gratis roastflow. Premium Verdict Beta wordt gebruikt om diepere stijlanalyses te testen.",
  },
  {
    question: "Welke AI gebruikt OutfitRoaster?",
    answer:
      "OutfitRoaster gebruikt moderne AI-tools, waaronder OpenAI-technologie, om zichtbare outfitdetails te analyseren en natuurlijke feedback te genereren.",
  },
  {
    question: "Mag ik OutfitRoaster reviewen?",
    answer:
      "Ja. Journalisten, bloggers, AI-directories, reviewers en creators kunnen de publieke webapp testen en contact opnemen voor vragen.",
  },
  {
    question: "Hoe neem ik contact op met de oprichter?",
    answer: `Voor interviews, podcasts, reviews of persvragen kun je mailen naar ${contactEmail}.`,
  },
];

export const metadata = createPageMetadata({
  title: "Perskit | OutfitRoaster",
  description:
    "Persinformatie, screenshots, bedrijfsinformatie en het oprichtersverhaal van OutfitRoaster.",
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
        name: "Nederland",
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
          name: "Perskit",
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
                Persinformatie
              </p>
              <h1 className="mt-6 text-6xl font-black leading-[0.9] tracking-[-0.06em] text-white sm:text-8xl">
                Perskit
              </h1>
              <p className="mt-5 text-2xl font-black text-orange-300">
                Alles wat je nodig hebt om over OutfitRoaster te schrijven.
              </p>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
                OutfitRoaster is een AI-outfitchecker die modeanalyse combineert met humor.
                Upload een outfit, ontvang direct een AI-score, een scherpe roast of uitgebreide
                stijlanalyse, en deel je resultaat.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/"
                  className="dr-primary-button inline-flex min-h-14 items-center justify-center px-6 py-4"
                >
                  Bekijk OutfitRoaster
                </a>
                <PressContactLink
                  href={contactHref}
                  location="hero"
                  className="dr-secondary-button inline-flex min-h-14 items-center justify-center px-6 py-4"
                >
                  Contact opnemen
                </PressContactLink>
                <a
                  href="#brand-assets"
                  className="dr-secondary-button inline-flex min-h-14 items-center justify-center px-6 py-4"
                >
                  Download merkbestanden
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-zinc-950/70 p-6 shadow-[0_0_80px_rgba(255,106,0,0.12)]">
              <div className="rounded-[1.5rem] border border-orange-500/25 bg-gradient-to-br from-orange-500/20 via-zinc-950 to-black p-6">
                <Image
                  src="/icons/icon-512.png"
                  alt="OutfitRoaster app-icoon"
                  width={160}
                  height={160}
                  priority
                  className="rounded-[2rem] shadow-[0_0_50px_rgba(255,106,0,0.35)]"
                />
                <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-orange-300">
                  AI Styling Verdict
                </p>
                <p className="mt-3 text-4xl font-black leading-none text-white">
                  Modefeedback met een punchline.
                </p>
                <p className="mt-5 leading-7 text-zinc-300">
                  Gebouwd voor snelle outfitchecks, deelbare roasts en diepere stijlanalyses.
                </p>
              </div>
            </div>
          </div>

          <section className="mt-20 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 sm:p-8">
              <h2 className="text-3xl font-black text-white">Over OutfitRoaster</h2>
              <div className="mt-5 space-y-5 leading-8 text-zinc-300">
                <p>
                  OutfitRoaster is een webapplicatie waarmee gebruikers een outfitfoto uploaden en
                  direct AI-feedback krijgen. Het product zit op het snijvlak van modeanalyse,
                  entertainment en social sharing. De app kan een snelle outfitscore geven, een
                  scherpe maar veilige roast schrijven of een uitgebreider verdict maken over kleur,
                  pasvorm, samenhang, context en trends.
                </p>
                <p>
                  Het idee achter OutfitRoaster is simpel: veel online outfitfeedback is te vaag,
                  te serieus of te traag. Traditionele outfitcheckers voelen vaak als generiek
                  stijladvies. OutfitRoaster is directer. De tool kijkt naar zichtbare kleding,
                  gelegenheid en totale vibe, en vertaalt dat naar feedback die mensen begrijpen en
                  kunnen delen.
                </p>
                <p>
                  Humor is een belangrijk onderdeel van het product. De gratis roastmodus is
                  gemaakt voor korte, memorabele opmerkingen die mensen laten lachen zonder de
                  persoon aan te vallen. Het doelwit is altijd de outfit: kleding, schoenen,
                  kleuren, accessoires, styling en geschiktheid voor de gelegenheid. Premium
                  Verdict Beta onderzoekt de serieuzere kant van hetzelfde idee, met diepere
                  analyse voor gebruikers die praktische stijlfeedback willen.
                </p>
                <p>
                  OutfitRoaster is gebouwd als modern AI-native product: snel te gebruiken,
                  mobile-first en ontworpen rond hoe mensen outfitmeningen al delen in groepsapps,
                  stories en korte video’s.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 sm:p-8">
              <h2 className="text-3xl font-black text-white">Oprichtersverhaal</h2>
              <div className="mt-5 space-y-5 leading-8 text-zinc-300">
                <p>
                  OutfitRoaster is gebouwd door Nathan Okkerse als side project. Het begon met een
                  praktische vraag: hoe snel kun je tegenwoordig een bruikbaar, grappig en publiek
                  AI-product bouwen? Het antwoord werd een werkende outfitchecker met beeldanalyse,
                  Nederlandse humor, deelkaarten, video-export en SEO-content.
                </p>
                <p>
                  De eerste versie werd gebouwd in een paar avonden en weekenden. In plaats van
                  maanden aan een groot productplan te werken, lag de focus op een echte flow:
                  upload een foto, krijg direct een verdict en maak het resultaat makkelijk
                  deelbaar. Moderne AI-tools maakten het mogelijk om snel van idee naar prototype
                  te gaan en daarna door te bouwen op wat gebruikers merkten.
                </p>
                <p>
                  OutfitRoaster is bewust geen glad corporate fashionmerk. Het product is direct,
                  speels en een beetje brutaal. Tegelijk laat het zien hoe AI nuttig, grappig en
                  cultureel specifiek kan zijn. Het is ook een klein bewijs van hoe snel
                  onafhankelijke bouwers tegenwoordig webproducten kunnen lanceren wanneer design,
                  development en AI-workflows goed samenkomen.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-3xl font-black text-white">Snelle feiten</h2>
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
            <h2 className="text-3xl font-black text-white">Functies</h2>
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
            <h2 className="text-3xl font-black text-white">Tech stack</h2>
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
            <h2 className="text-3xl font-black text-white">Tijdlijn</h2>
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
              Huidige visuele assets uit het live project. Extra productscreenshots kunnen later
              aan deze perskit worden toegevoegd.
            </p>
            <div className="mt-6">
              <PressScreenshotGallery screenshots={screenshots} />
            </div>
          </section>

          <section
            id="brand-assets"
            className="mt-16 rounded-3xl border border-orange-500/30 bg-orange-500/[0.08] p-6 sm:p-8"
          >
            <h2 className="text-3xl font-black text-white">Merkbestanden</h2>
            <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
              Download de beschikbare logo-, icoon- en social-previewbestanden. Deze bestanden zijn
              geschikt voor artikelen, reviews, AI-directories en social posts over OutfitRoaster.
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
              <h2 className="text-3xl font-black text-white">Perscontact</h2>
              <p className="mt-5 leading-8 text-zinc-300">
                Voor interviews, reviews, podcasts, AI-directories, creator-samenwerkingen of
                persvragen kun je direct contact opnemen met OutfitRoaster.
              </p>
              <PressContactLink
                href={contactHref}
                location="media_contact"
                className="dr-primary-button mt-7 inline-flex min-h-14 items-center justify-center px-7 py-4"
              >
                Mail {contactEmail}
              </PressContactLink>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-300">
                FAQ
              </p>
              <h2 className="mt-3 text-3xl font-black text-white">Veelgestelde persvragen</h2>
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
