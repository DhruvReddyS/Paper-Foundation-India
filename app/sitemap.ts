import type { MetadataRoute } from "next";

const routes = ["", "/about", "/circularity", "/contact", "/discover", "/everyday-paper", "/games", "/glossary", "/india-map", "/india-snapshot", "/join", "/journey", "/knowledge", "/knowledge/featured", "/myths", "/privacy", "/report", "/resources", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || "https://paperfoundation.in").replace(/\/$/, "");
  return routes.map(path => ({ url: origin + path, lastModified: new Date(), changeFrequency: path === "" ? "weekly" : "monthly", priority: path === "" ? 1 : .7 }));
}
