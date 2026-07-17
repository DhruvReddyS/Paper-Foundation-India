"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Quote, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { articleCoverImage, featuredArticles } from "@/content/articleCatalog";
const editorialNotes = [
  "A systems essay for anyone tired of one-word material verdicts.",
  "A comparison desk that keeps use, geography and end-of-life inside the frame.",
  "A mill-side visual explainer of what actually happens when fibre returns.",
  "A field dossier on what renewability asks from real landscapes.",
  "A forward-looking brief on design, collection and circular infrastructure.",
];

export default function FeaturedArticlesExperience() {
  return <main className="featured-card-room">
    <nav className="featured-card-nav"><Link href="/knowledge"><ArrowLeft /> All articles</Link><span><Sparkles /> Editor&apos;s selection · {featuredArticles.length} reads</span></nav>
    <div className="featured-press-line" aria-hidden="true"><span>THE LONG READ</span><i /><b>Evidence with room to breathe</b><i /><span>FIELD EDITION</span></div>
    <section className="featured-cover-grid">
      {featuredArticles.flatMap((article, index) => {
        const story = <motion.article key={article.slug} initial={{ opacity: 0, y: 35, rotate: index % 2 ? .6 : -.6 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .55, delay: index * .045 }}>
          <Link href={`/knowledge/${article.slug}`}>
            <div className="featured-cover-art">
              <Image src={articleCoverImage(article)} alt={`Cover for ${article.title}`} fill sizes="(max-width: 760px) 94vw, 50vw" />
              <span>FEATURE {String(index + 1).padStart(2, "0")}</span>
              <em>{article.category}</em>
              <i />
            </div>
            <div className="featured-cover-copy">
              <div><small>EDITOR&apos;S LONG-FORM</small><span><Clock /> {article.time} read</span></div>
              <h1>{article.title}</h1>
              <p>{article.summary}</p>
              <blockquote><Quote /> {editorialNotes[index]}</blockquote>
              <footer><span><BookOpen /> Visual essay</span><b>Read feature <ArrowRight /></b></footer>
            </div>
          </Link>
        </motion.article>;
        if (index !== 1) return [story];
        return [story, <motion.aside className="featured-editorial-insert" key="editorial-insert" initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <span>EDITOR&apos;S MARGIN / 01</span><Quote /><strong>Slow reading is a feature.</strong><p>These pieces keep the assumptions, boundaries and evidence visible—so a conclusion can be inspected, not merely repeated.</p><i>PFI · READING DESK</i>
        </motion.aside>];
      })}
    </section>
  </main>;
}
