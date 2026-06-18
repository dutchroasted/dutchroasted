import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Outfit Roaster",
  title: "Outfit Roaster | Upload je outfit. Krijg de waarheid.",
  description:
    "Outfit Roaster checkt je outfit met humor, eerlijkheid en stylingadvies waar je echt iets aan hebt.",
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
    title: "Outfit Roaster | Upload je outfit. Krijg de waarheid.",
    description:
      "Een AI-stylist met humor checkt je outfit op stijl, kleur, pasvorm en vibe.",
    siteName: "Outfit Roaster",
    locale: "nl_NL",
    type: "website",
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
  return (
    <html lang="nl">
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
