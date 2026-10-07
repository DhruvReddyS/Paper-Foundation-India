import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://paperfoundation.in";
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] }, sitemap: `${origin.replace(/\/$/, "")}/sitemap.xml`, host: origin };
}
