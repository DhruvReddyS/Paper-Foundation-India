import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant-garamond",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Paper Foundation India",
    template: "%s | Paper Foundation India",
  },
  description:
    "Championing sustainable paper — debunking myths, sharing knowledge, and celebrating India's paper industry.",
  keywords: [
    "paper",
    "sustainability",
    "India",
    "recycling",
    "forestry",
    "myths",
    "knowledge",
  ],
  authors: [{ name: "Paper Foundation India" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Paper Foundation India",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${cormorantGaramond.variable} ${dmSans.variable} ${dmMono.variable} min-h-screen bg-paper-white text-charcoal font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
