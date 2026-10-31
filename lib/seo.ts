import type { Metadata } from "next";

export const SITE_NAME = "Paper Foundation India";
export const SITE_TAGLINE = "Evidence-led public understanding of paper, fibre and recovery";

export function siteOrigin() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://paperfoundation.in").replace(/\/$/, "");
}

export function absoluteUrl(path = "/") {
  return `${siteOrigin()}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageMetadata = {
  title: string;
  description: string;
  /** Route this page lives at, used for the canonical link. */
  path: string;
  /** Point search engines at another page when two routes serve one thing. */
  canonicalPath?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  keywords?: string[];
  noIndex?: boolean;
  /** Set when the title already carries the brand, to skip the root template. */
  absoluteTitle?: boolean;
};

/**
 * Every public page needs the same six things: a title, a description, a
 * canonical URL, Open Graph tags, Twitter card tags and an image. Building them
 * in one place keeps them consistent and makes a missing field obvious.
 */
export function pageMetadata({
  title,
  description,
  path,
  canonicalPath,
  image = "/images/brand/og-default.png",
  type = "website",
  publishedTime,
  keywords,
  noIndex,
  absoluteTitle,
}: PageMetadata): Metadata {
  const canonical = absoluteUrl(canonicalPath ?? path);
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_IN",
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

type JsonLd = Record<string, unknown>;

export function organizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: SITE_NAME,
    alternateName: "PFI",
    url: siteOrigin(),
    logo: absoluteUrl("/images/brand/paper-foundation-logo.png"),
    description: SITE_TAGLINE,
    areaServed: { "@type": "Country", name: "India" },
    knowsAbout: [
      "paper recycling",
      "pulp and paper manufacturing",
      "sustainable forestry",
      "recovered fibre",
      "circular materials",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "public enquiries",
      email: "paperfoundationindia@gmail.com",
      url: absoluteUrl("/contact"),
      availableLanguage: ["en"],
    },
  };
}

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteOrigin(),
    description: SITE_TAGLINE,
    inLanguage: "en-IN",
    publisher: { "@type": "NGO", name: SITE_NAME, url: siteOrigin() },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.name,
      item: absoluteUrl(step.path),
    })),
  };
}

export function articleSchema(article: {
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  section?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(article.path) },
    image: article.image ? absoluteUrl(article.image) : absoluteUrl("/images/brand/og-default.png"),
    ...(article.section ? { articleSection: article.section } : {}),
    ...(article.datePublished ? { datePublished: article.datePublished } : {}),
    ...(article.dateModified ? { dateModified: article.dateModified } : {}),
    inLanguage: "en-IN",
    author: { "@type": "Organization", name: SITE_NAME, url: siteOrigin() },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteOrigin(),
      logo: { "@type": "ImageObject", url: absoluteUrl("/images/brand/paper-foundation-logo.png") },
    },
  };
}

/**
 * The myths page answers a specific question for each claim, which is what a
 * FAQPage describes. Keeping the answer text identical to the visible page is
 * required: structured data that disagrees with the page is a penalty, not a win.
 */
export function faqSchema(entries: { question: string; answer: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

export function collectionSchema(collection: {
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string }[];
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.name,
    description: collection.description,
    url: absoluteUrl(collection.path),
    inLanguage: "en-IN",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: collection.items.length,
      itemListElement: collection.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
}

export function gameSchema(game: {
  name: string;
  description: string;
  path: string;
  genre: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Game",
    name: game.name,
    description: game.description,
    url: absoluteUrl(game.path),
    genre: game.genre,
    inLanguage: "en-IN",
    isAccessibleForFree: true,
    publisher: { "@type": "Organization", name: SITE_NAME, url: siteOrigin() },
  };
}
