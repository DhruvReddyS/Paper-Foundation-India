import type { Metadata } from "next";
import { DM_Mono, DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import "./games-rework.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
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
        className={`${fraunces.variable} ${dmSans.variable} ${dmMono.variable} min-h-screen bg-paper-white text-charcoal font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
