import { CTASection } from "@/components/CTASection";
import { ExampleRoast } from "@/components/ExampleRoast";
import { Footer } from "@/components/Footer";
import { FAQSection } from "@/components/FAQSection";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { PopularOutfitChecks } from "@/components/PopularOutfitChecks";
import { PricingTeaser } from "@/components/PricingTeaser";
import { RoastCategories } from "@/components/RoastCategories";
import { WhyOutfitRoaster } from "@/components/WhyOutfitRoaster";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Outfit Roaster | Nederlandse AI-outfitcheck met humor",
  description:
    "Upload je outfit en krijg een eerlijk verdict over stijl, pasvorm, kleur en vibe. Scherp, grappig en zonder bodyshaming.",
  path: "",
});

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Header />
      <Hero />
      <ExampleRoast />
      <RoastCategories />
      <PopularOutfitChecks />
      <HowItWorks />
      <WhyOutfitRoaster />
      <FAQSection />
      <PricingTeaser />
      <CTASection />
      <Footer />
    </main>
  );
}
