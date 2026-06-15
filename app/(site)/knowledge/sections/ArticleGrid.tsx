"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Factory, Leaf, Recycle, Scale, Trees } from "lucide-react";

interface Article {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  tags: string[];
}

const articles: Article[] = [
  {
    slug: "why-paper-industry-plants-more-trees",
    category: "Forestry",
    title: "Why India's Paper Industry Plants More Trees Than It Harvests",
    excerpt: "Social forestry programs have greened over 1.5 million hectares of degraded land.",
    readTime: "6 min",
    date: "May 28, 2026",
    tags: ["Trees", "Plantations"],
  },
  {
    slug: "recycling-rates-compared",
    category: "Recycling",
    title: "India vs World: Paper Recycling Rates Compared",
    excerpt: "At 75%, India's recycled fibre usage outpaces the EU, US, and Japan.",
    readTime: "5 min",
    date: "May 20, 2026",
    tags: ["Recycling", "Global"],
  },
  {
    slug: "water-usage-modern-mills",
    category: "Sustainability",
    title: "How Modern Mills Cut Water Usage by 80%",
    excerpt: "Closed-loop systems mean today's mills use a fraction of what they once did.",
    readTime: "4 min",
    date: "May 12, 2026",
    tags: ["Water", "Technology"],
  },
  {
    slug: "rural-livelihoods-paper",
    category: "Economy",
    title: "5 Million Rural Livelihoods: The Paper Connection",
    excerpt: "From bamboo farmers to waste collectors, paper touches millions of lives.",
    readTime: "7 min",
    date: "May 5, 2026",
    tags: ["Rural", "Economy"],
  },
  {
    slug: "paper-vs-plastic-lifecycle",
    category: "Sustainability",
    title: "Paper vs Plastic: A Full Lifecycle Analysis",
    excerpt: "Breaking down the environmental impact from cradle to grave.",
    readTime: "8 min",
    date: "Apr 28, 2026",
    tags: ["Plastic", "LCA"],
  },
  {
    slug: "innovation-in-indian-mills",
    category: "Innovation",
    title: "Innovation in Indian Paper Mills: A New Era",
    excerpt: "From AI-powered quality control to biomass energy — mills are transforming.",
    readTime: "6 min",
    date: "Apr 20, 2026",
    tags: ["Innovation", "Technology"],
  },
];

export function ArticleGrid() {
  const covers = [Trees, Recycle, Factory, Leaf, Scale, BookOpen];
  return (
    <section className="knowledge-article-index py-16 bg-paper-white">
      <div className="container-wide">
        <div className="knowledge-index-heading"><p className="home-micro-label">Knowledge desk · Recent</p><h2>Reading worth your time,<br />on the questions worth asking.</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, i) => {
            const CoverIcon = covers[i];
            return (
            <motion.article
              key={article.slug}
              className="knowledge-index-card group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className={`knowledge-index-cover cover-${i + 1}`}>
                <span>FIG. {String(i + 1).padStart(2, "0")}</span><CoverIcon /><i />
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
                  <Link href={`/knowledge/${article.slug}`}>{article.title}</Link>
                </h3>

                <p className="text-sm text-mid-grey leading-relaxed mb-4">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-paper-white text-mid-grey px-2 py-0.5 rounded-full border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-mid-grey/60">{article.date}</span><ArrowUpRight className="knowledge-card-arrow" />
                </div>
              </div>
            </motion.article>
          )})}
        </div>
      </div>
    </section>
  );
}
