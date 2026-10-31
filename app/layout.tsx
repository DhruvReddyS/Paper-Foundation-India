import type { Metadata, Viewport } from "next";
import { DM_Mono, DM_Sans, Fraunces } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./games-rework.css";
import "./transitions.css";
import "./editorial-polish.css";

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

const DEFAULT_OG_IMAGE = "/images/brand/og-default.png";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://paperfoundation.in"),
  title: {
    default: "Paper Foundation India | Paper, read as evidence",
    template: "%s | Paper Foundation India",
  },
  description:
    "An Indian public-interest foundation testing paper claims against sources: myths and facts, long-form knowledge, the fibre atlas and five short games.",
  applicationName: "Paper Foundation India",
  keywords: [
    "paper",
    "sustainability",
    "India",
    "paper recycling",
    "recovered fibre",
    "forestry",
    "paper myths",
    "pulp and paper",
  ],
  authors: [{ name: "Paper Foundation India" }],
  creator: "Paper Foundation India",
  publisher: "Paper Foundation India",
  category: "education",
  formatDetection: { telephone: false, address: false, email: false },
  // Pages override these with their own canonical and per-page card. These
  // values cover anything that does not set its own.
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Paper Foundation India",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Paper Foundation India" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: [{ url: "/images/brand/paper-foundation-nav-logo.png", type: "image/png" }],
    apple: [{ url: "/images/brand/paper-foundation-nav-logo.png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#173b29",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${fraunces.variable} ${dmSans.variable} ${dmMono.variable} min-h-screen bg-paper-white text-charcoal font-sans antialiased`}
      >
        {children}
        {gaId && <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}</Script>
        </>}
      </body>
    </html>
  );
}
