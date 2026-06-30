import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/react";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "eniyiyapayzeka.com | Türkiye'nin Yapay Zeka Araçları Dizini",
    template: "%s | eniyiyapayzeka.com",
  },
  description:
    "En iyi yapay zeka araçlarını keşfedin. ChatGPT, Claude, Midjourney ve yüzlerce AI aracı hakkında Türkçe detaylı incelemeler, karşılaştırmalar ve promptlar.",
  metadataBase: new URL("https://eniyiyapayzeka.com"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "eniyiyapayzeka.com",
    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "eniyiyapayzeka.com | Yapay Zeka Araçları",
      },
    ],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${plusJakarta.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
