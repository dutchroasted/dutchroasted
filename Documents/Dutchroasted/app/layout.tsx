import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DutchRoasted | Upload je outfit. Krijg de waarheid.",
  description:
    "DutchRoasted checkt je outfit met humor, eerlijkheid en stylingadvies waar je echt iets aan hebt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
