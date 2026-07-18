import { articleCatalog } from "@/content/articleCatalog";
import { gameCatalog } from "@/components/games/gameCatalog";
import { glossaryData } from "@/content/glossary";
import mythCatalog from "@/content/mythCatalog.json";
import { resourceCatalog } from "@/content/resources";

export type SearchEntryType =
  | "Page"
  | "Article"
  | "Featured"
  | "Myth & fact"
  | "Game"
  | "Glossary"
  | "Resource";

export type SiteSearchEntry = {
  id: string;
  label: string;
  href: string;
  type: SearchEntryType;
  description: string;
  keywords: string;
};

const pages: SiteSearchEntry[] = [
  { id: "page-home", label: "Home", href: "/", type: "Page", description: "Paper Foundation India’s public home.", keywords: "landing paper foundation india" },
  { id: "page-myths", label: "Myths vs Facts", href: "/myths", type: "Page", description: "Inspect familiar claims with evidence and Indian context.", keywords: "claims evidence facts reality context" },
  { id: "page-journey", label: "Paper Journey", href: "/journey", type: "Page", description: "Follow fibre from source through making, use and recovery.", keywords: "book papermaking process pulp mill recycling" },
  { id: "page-knowledge", label: "Knowledge Hub", href: "/knowledge", type: "Page", description: "Read articles and evidence-led explainers.", keywords: "articles reading research learning" },
  { id: "page-featured", label: "Featured Articles", href: "/knowledge/featured", type: "Page", description: "Long-form editorial selections.", keywords: "features stories editorial long form" },
  { id: "page-glossary", label: "Glossary", href: "/glossary", type: "Page", description: "Definitions for paper, fibre, forestry and circular systems.", keywords: "terms definitions words vocabulary" },
  { id: "page-resources", label: "Resources", href: "/resources", type: "Page", description: "Reports, standards, guides and public data.", keywords: "sources reports data standards guides evidence" },
  { id: "page-games", label: "Games Lab", href: "/games", type: "Page", description: "Play five paper-learning games.", keywords: "discover play quiz puzzle" },
  { id: "page-everyday", label: "Everyday Paper", href: "/everyday-paper", type: "Page", description: "Find engineered paper in daily life.", keywords: "products uses packaging hygiene books" },
  { id: "page-map", label: "India Fibre Map", href: "/india-map", type: "Page", description: "Explore India’s paper story state by state.", keywords: "india states map fibre mills" },
  { id: "page-snapshot", label: "India Facts & Numbers", href: "/india-snapshot", type: "Page", description: "Production, recovery, trade and employment indicators.", keywords: "statistics charts data recycling production trade jobs" },
  { id: "page-circularity", label: "Paper Circularity", href: "/circularity", type: "Page", description: "Follow fibre through use, collection and recovery.", keywords: "cycle circular economy recover recycling" },
  { id: "page-about", label: "About Paper Foundation India", href: "/about", type: "Page", description: "Mission, principles, people and public method.", keywords: "about team organisation society mission hyderabad" },
  { id: "page-join", label: "Join the Foundation", href: "/join", type: "Page", description: "Apply to participate in the foundation.", keywords: "membership application volunteer participate" },
  { id: "page-contact", label: "Contact Paper Foundation India", href: "/contact", type: "Page", description: "Reach the foundation directly.", keywords: "email message help enquiry" },
  { id: "page-report", label: "Report a Claim", href: "/report", type: "Page", description: "Submit paper misinformation for review.", keywords: "misinformation false claim correction evidence" },
];

const articleEntries: SiteSearchEntry[] = articleCatalog.map((article) => ({
  id: `article-${article.slug}`,
  label: article.title,
  href: `/knowledge/${article.slug}`,
  type: article.featured ? "Featured" : "Article",
  description: article.summary,
  keywords: `${article.category} ${article.format} ${article.time} paper article`,
}));

const mythEntries: SiteSearchEntry[] = mythCatalog.map((item, index) => ({
  id: item.id,
  label: item.myth,
  href: `/myths?search=${encodeURIComponent(item.myth)}#myth-library`,
  type: "Myth & fact",
  description: item.reality,
  keywords: `${item.reality} ${item.explanation} ${item.indiaContext} ${item.evidence} case ${index + 1}`,
}));

const gameEntries: SiteSearchEntry[] = gameCatalog.map((game) => ({
  id: `game-${game.id}`,
  label: game.title,
  href: game.href,
  type: "Game",
  description: game.description,
  keywords: `${game.subtitle} ${game.hook} ${game.skill} ${game.shortTitle} play`,
}));

const glossaryEntries: SiteSearchEntry[] = Object.entries(glossaryData).flatMap(([letter, terms]) =>
  terms.map((item) => ({
    id: `glossary-${letter}-${item.term.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    label: item.term,
    href: `/glossary?search=${encodeURIComponent(item.term)}#glossary-index`,
    type: "Glossary" as const,
    description: item.definition,
    keywords: `${letter} definition paper term`,
  }))
);

const resourceEntries: SiteSearchEntry[] = resourceCatalog.map((resource, index) => ({
  id: `resource-${index + 1}`,
  label: resource.title,
  href: `/resources?search=${encodeURIComponent(resource.title)}#resource-archive`,
  type: "Resource",
  description: resource.description,
  keywords: `${resource.type} ${resource.source} ${resource.publisher} ${resource.date} ${resource.format}`,
}));

export const siteSearchIndex: SiteSearchEntry[] = [
  ...pages,
  ...articleEntries,
  ...mythEntries,
  ...gameEntries,
  ...glossaryEntries,
  ...resourceEntries,
];

function normalise(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .toLowerCase();
}

function scoreEntry(entry: SiteSearchEntry, query: string) {
  const needle = normalise(query);
  if (!needle) return 0;
  const words = needle.split(/\s+/).filter(Boolean);
  const label = normalise(entry.label);
  const description = normalise(entry.description);
  const keywords = normalise(entry.keywords);
  const complete = `${label} ${description} ${keywords}`;
  if (!words.every((word) => complete.includes(word))) return 0;

  let score = 0;
  if (label === needle) score += 120;
  if (label.startsWith(needle)) score += 70;
  if (label.includes(needle)) score += 45;
  if (description.includes(needle)) score += 24;
  if (keywords.includes(needle)) score += 16;
  for (const word of words) {
    if (label.split(" ").includes(word)) score += 18;
    else if (label.includes(word)) score += 10;
    if (description.includes(word)) score += 5;
    if (keywords.includes(word)) score += 3;
  }
  return score;
}

export function searchSite(query: string, limit = 7) {
  return siteSearchIndex
    .map((entry, position) => ({ entry, position, score: scoreEntry(entry, query) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.position - b.position)
    .slice(0, limit)
    .map(({ entry }) => entry);
}
