import { CTASection } from "@/components/CTASection";
import { ExampleRoast } from "@/components/ExampleRoast";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { PricingTeaser } from "@/components/PricingTeaser";
import { RoastCategories } from "@/components/RoastCategories";
import { WhyOutfitRoaster } from "@/components/WhyOutfitRoaster";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Header />
      <Hero />
      <ExampleRoast />
      <RoastCategories />
      <HowItWorks />
      <WhyOutfitRoaster />
      <PricingTeaser />
      <CTASection />
      <Footer />
    </main>
  );
}
