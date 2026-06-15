"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface Article {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
}

const articles: Article[] = [
  {
    slug: "why-paper-industry-plants-more-trees",
    category: "Forestry",
    title: "Why India's Paper Industry Plants More Trees Than It Harvests",
    excerpt:
      "Social forestry programs have greened over 1.5 million hectares of degraded land — all driven by paper demand.",
    readTime: "6 min read",
    date: "May 28, 2026",
  },
  {
    slug: "recycling-rates-compared",
    category: "Recycling",
    title: "India vs World: How Our Paper Recycling Rates Compare",
    excerpt:
      "At 75%, India's recycled fibre usage outpaces the EU, US, and Japan. Here's how we got here.",
    readTime: "5 min read",
    date: "May 20, 2026",
  },
  {
    slug: "water-usage-modern-mills",
    category: "Sustainability",
    title: "How Modern Paper Mills Have Cut Water Usage by 80%",
    excerpt:
      "Closed-loop water systems mean today's mills use a fraction of the water they did two decades ago.",
    readTime: "4 min read",
    date: "May 12, 2026",
  },
];

export function FeaturedArticles() {
  return (
    <section className="py-24 bg-paper-white">
      <div className="container-wide">
        <div className="text-center mb-14">
          <span className="font-mono text-xs text-copper uppercase tracking-widest">
            Knowledge Hub
          </span>
          <h2 className="font-serif text-4xl font-bold text-charcoal mt-3 mb-4">
            Latest from the Hub
          </h2>
          <p className="text-mid-grey max-w-xl mx-auto">
            Deep-dives into the science, sustainability, and stories behind India&apos;s paper industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {articles.map((article, i) => (
            <motion.article
              key={article.slug}
              className="group rounded-2xl border border-border bg-paper-warm overflow-hidden hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Image Placeholder */}
              <div className="h-48 bg-kraft flex items-center justify-center">
                <span className="text-4xl opacity-50">📄</span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs text-copper uppercase tracking-wider">
                    {article.category}
                  </span>
                  <span className="text-border">·</span>
                  <span className="text-xs text-mid-grey">{article.readTime}</span>
                </div>

                <h3 className="font-serif text-lg font-bold text-charcoal mb-2 group-hover:text-forest transition-colors leading-snug">
                  <Link href={`/knowledge/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>

                <p className="text-sm text-mid-grey leading-relaxed mb-4">
                  {article.excerpt}
                </p>

                <span className="text-xs text-mid-grey/60">{article.date}</span>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center">
          <Link href="/knowledge" className="btn-secondary">
            Browse All Articles →
          </Link>
        </div>
      </div>
    </section>
  );
}
