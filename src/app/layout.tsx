import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
