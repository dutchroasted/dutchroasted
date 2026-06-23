import { StructuredData } from "./StructuredData";

const faqs = [
  {
    question: "Wat is Outfit Roaster?",
    answer:
      "Outfit Roaster is een Nederlandse AI-outfitchecker met humor. Je uploadt een outfitfoto en krijgt feedback over stijl, pasvorm, kleur en vibe.",
  },
  {
    question: "Hoe werkt Outfit Roaster?",
    answer:
      "Upload een duidelijke outfitfoto, kies de gelegenheid en selecteer je gewenste feedback. Daarna ontvang je een roast of een uitgebreid Premium Verdict.",
  },
  {
    question: "Is Outfit Roaster gratis?",
    answer:
      "Ja. Je kunt dagelijks vijf gratis Outfit Roasts maken. Premium Verdict Beta is momenteel ook tijdelijk gratis te testen.",
  },
  {
    question: "Wat is Premium Verdict Beta?",
    answer:
      "Premium Verdict Beta is een uitgebreide outfitanalyse van kleur, pasvorm, stijl, context en trends, inclusief concrete verbeterpunten en shopsuggesties.",
  },
];

export function FAQSection() {
  const faqSchema = {
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
  };

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <StructuredData data={faqSchema} />
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-400">
          Veelgestelde vragen
        </p>
        <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">
          Eerst even dit.
        </h2>
        <div className="mt-8 grid gap-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 open:border-orange-500/35 open:bg-orange-500/[0.06]"
            >
              <summary className="cursor-pointer list-none pr-8 text-lg font-black text-white">
                {faq.question}
              </summary>
              <p className="mt-4 max-w-3xl leading-7 text-zinc-400">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
