import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Outfit Roaster | Upload je outfit. Krijg je verdict.",
    description:
      "Eerlijke Nederlandse outfitfeedback met humor, zonder bodyshaming.",
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

  return (
    <html lang="nl">
      <body>
        <ServiceWorkerRegister />
        {children}
        {measurementId ? <GoogleAnalytics measurementId={measurementId} /> : null}
      </body>
    </html>
  );
}
