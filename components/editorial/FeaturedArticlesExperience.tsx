"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Highlighter, Quote, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { featuredArticles, type ArticleCatalogItem } from "@/content/articleCatalog";

const articleImage = (category: ArticleCatalogItem["category"]) => `/images/knowledge/editorial-v2/${category.toLowerCase()}.jpg`;
const editorialNotes = [
  "A systems essay for anyone tired of one-word material verdicts.",
  "A comparison desk that keeps use, geography and end-of-life inside the frame.",
  "A mill-side visual explainer of what actually happens when fibre returns.",
  "A field dossier on what renewability asks from real landscapes.",
  "A forward-looking brief on design, collection and circular infrastructure.",
];

export default function FeaturedArticlesExperience() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const coverY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return <main className="featured-editorial">
    <section ref={heroRef} className="featured-editorial-hero">
      <div className="featured-editorial-copy">
        <Link href="/knowledge"><ArrowLeft /> Knowledge Hub</Link>
        <p><Sparkles /> The editor’s long-form shelf</p>
        <h1>Stories that need<br /><em>more than a headline.</em></h1>
        <span>Five special reads combine evidence, visual explanation and the context usually lost between a confident claim and a quick share.</span>
        <a href="#featured-reading-room">Enter the reading room <ArrowRight /></a>
      </div>
      <motion.div className="featured-editorial-stack" style={{ y: coverY }}>
        {featuredArticles.map((article, index) => <figure key={article.slug} style={{ "--feature-index": index } as React.CSSProperties}><Image src={articleImage(article.category)} alt="" fill sizes="300px" /><figcaption><small>FEATURE {String(index + 1).padStart(2, "0")}</small><strong>{article.title}</strong><span>{article.category} · {article.time}</span></figcaption></figure>)}
      </motion.div>
      <div className="featured-editorial-marquee"><span>LONG-FORM / VISUAL EVIDENCE / SOURCE NOTES / CORRECTABLE EDITORIAL / </span><span aria-hidden="true">LONG-FORM / VISUAL EVIDENCE / SOURCE NOTES / CORRECTABLE EDITORIAL / </span></div>
    </section>

    <section id="featured-reading-room" className="featured-reading-room">
      <header><div><p>Five cover stories</p><h2>The special<br />editorial selection.</h2></div><span>Each feature gets room for diagrams, photographs, pull-quotes and evidence notes inside the article reader.</span></header>
      <div className="featured-story-ledger">
        {featuredArticles.map((article, index) => <motion.article key={article.slug} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .24 }} transition={{ duration: .65 }}>
          <div className="featured-story-image">
            <Image src={articleImage(article.category)} alt={`Editorial cover for ${article.title}`} fill sizes="(max-width: 800px) 100vw, 52vw" />
            <span>FIG. {String(index + 1).padStart(2, "0")}</span>
            <i />
          </div>
          <div className="featured-story-copy">
            <div><span>FEATURED LONG-FORM</span><small>{article.category}</small></div>
            <h3>{article.title}</h3>
            <p>{article.summary}</p>
            <blockquote><Quote />{editorialNotes[index]}</blockquote>
            <footer><span><Clock /> {article.time} read</span><span><BookOpen /> Visual essay</span><Link href={`/knowledge/${article.slug}`}>Read the feature <ArrowRight /></Link></footer>
          </div>
        </motion.article>)}
      </div>
    </section>

    <section className="featured-editorial-note">
      <Highlighter />
      <p>Designed to be marked up</p>
      <h2>Underline the claim.<br />Circle the boundary.<br /><em>Follow the source.</em></h2>
      <Link href="/knowledge">Browse every article <ArrowRight /></Link>
    </section>
  </main>;
}
