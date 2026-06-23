import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { StructuredData } from "@/components/StructuredData";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.outfitroaster.com"),
  applicationName: "Outfit Roaster",
  title: {
    default: "Outfit Roaster | Nederlandse AI-outfitcheck met humor",
    template: "%s | Outfit Roaster",
  },
  description:
    "Upload je outfit en krijg een eerlijk verdict over stijl, pasvorm, kleur en vibe. Scherp, grappig en zonder bodyshaming.",
  manifest: "/manifest.json",
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    title: "Outfit Roaster",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icons/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "Outfit Roaster | Upload je outfit. Krijg je verdict.",
    description:
      "Een Nederlandse AI-stylist met humor checkt je stijl, pasvorm, kleur en vibe.",
    url: "https://www.outfitroaster.com",
    siteName: "Outfit Roaster",
    locale: "nl_NL",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Outfit Roaster - Upload je outfit. Krijg je verdict.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Outfit Roaster | Upload je outfit. Krijg je verdict.",
    description:
      "Eerlijke Nederlandse outfitfeedback met humor, zonder bodyshaming.",
    images: ["/opengraph-image"],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ff6a00",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const clarityProjectId =
    process.env.NODE_ENV === "production" ? "xbixjso8vk" : null;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Outfit Roaster",
      url: "https://www.outfitroaster.com",
      logo: "https://www.outfitroaster.com/icons/icon-512.png",
      email: "info@outfitroaster.nl",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Outfit Roaster",
      url: "https://www.outfitroaster.com",
      inLanguage: "nl-NL",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Outfit Roaster",
      url: "https://www.outfitroaster.com/outfit-check",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      inLanguage: "nl-NL",
      description:
        "Nederlandse AI-outfitchecker met humor en uitgebreide feedback over stijl, pasvorm, kleur en context.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
      featureList: [
        "Outfit Roast",
        "Outfitscore",
        "Stylingtips",
        "Premium Verdict Beta",
        "Deelbare outfitkaart",
      ],
    },
  ];

  return (
    <html lang="nl">
      <body>
        <StructuredData data={structuredData} />
        <ServiceWorkerRegister />
        {children}
        {measurementId ? <GoogleAnalytics measurementId={measurementId} /> : null}
        {clarityProjectId ? <MicrosoftClarity projectId={clarityProjectId} /> : null}
      </body>
    </html>
  );
}
