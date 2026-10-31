import type { MetadataRoute } from "next";
import { articleCatalog } from "@/content/articleCatalog";
import { paperEverywhereObjects } from "@/content/paperEverywhere";
import { gameCatalog } from "@/components/games/gameCatalog";
import { siteOrigin } from "@/lib/seo";

// Filled in when the CMS holds published bodies. The build cannot reach the
// database, so nothing is listed from the static catalogue alone.
const publishedArticleSlugs = new Set<string>();

type Entry = { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] };

// /games serves the same hub as /discover and carries a canonical link to it,
// so only the canonical route is listed. /unsubscribe is a transactional page
// and is marked noindex rather than advertised here.
const staticEntries: Entry[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/knowledge", priority: 0.9, changeFrequency: "weekly" },
  { path: "/myths", priority: 0.9, changeFrequency: "weekly" },
  { path: "/discover", priority: 0.8, changeFrequency: "monthly" },
  { path: "/everyday-paper", priority: 0.8, changeFrequency: "monthly" },
  { path: "/india-map", priority: 0.8, changeFrequency: "monthly" },
  { path: "/india-snapshot", priority: 0.8, changeFrequency: "monthly" },
  { path: "/journey", priority: 0.8, changeFrequency: "monthly" },
  { path: "/circularity", priority: 0.7, changeFrequency: "monthly" },
  { path: "/knowledge/featured", priority: 0.7, changeFrequency: "weekly" },
  { path: "/resources", priority: 0.7, changeFrequency: "monthly" },
  { path: "/glossary", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "yearly" },
  { path: "/join", priority: 0.6, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/report", priority: 0.6, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  const lastModified = new Date();

  const entries: Entry[] = [
    ...staticEntries,
    ...gameCatalog.map((game) => ({
      path: game.href,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
    // Article pages are listed only once a real body has been published
    // through the CMS. Until then each one renders the shared editorial
    // framework, is served noindex, and advertising it here would contradict
    // that. The hub pages above carry the unique titles and summaries.
    ...articleCatalog
      .filter((article) => article.status === "published" && publishedArticleSlugs.has(article.slug))
      .map((article) => ({
        path: `/knowledge/${article.slug}`,
        priority: article.featured ? 0.8 : 0.7,
        changeFrequency: "monthly" as const,
      })),
    ...paperEverywhereObjects.map((item) => ({
      path: `/everyday-paper/${item.slug}`,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
  ];

  return entries.map((entry) => ({
    url: `${origin}${entry.path}`,
    lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
