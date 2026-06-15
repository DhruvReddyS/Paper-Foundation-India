"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, TrendingUp } from "lucide-react";
import Link from "next/link";

export function FeaturedArticle() {
  return <section className="knowledge-editorial-hero">
    <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} className="knowledge-editorial-copy">
      <p className="home-micro-label"><span /> Knowledge hub · Open reading</p>
      <h1>Understanding paper through <em>context,</em><br />not assumption.</h1>
      <p>A public reading room for the questions that sit behind sourcing, production, use, recovery and circularity.</p>
      <div><Link href="#article-grid">Explore the reading desk <ArrowRight /></Link><Link href="/myths">Check a familiar claim</Link></div>
      <dl><div><dt>Deep reads</dt><dd>Evidence made legible</dd></div><div><dt>Open sources</dt><dd>Follow every citation</dd></div><div><dt>Living record</dt><dd>Corrections stay visible</dd></div></dl>
    </motion.div>
    <div className="knowledge-feature-stack">
      <motion.article initial={{ rotate: 8, x: 40, opacity: 0 }} animate={{ rotate: 2, x: 0, opacity: 1 }} transition={{ delay: .18, type: "spring" }}>
        <span>Cover essay · 08 min</span><BookOpen /><h2>How fibre sourcing shapes the paper story.</h2><p>Forestry · Recovery · Context</p><Link href="/knowledge/truth-about-paper-forestry">Read the feature <ArrowRight /></Link>
      </motion.article>
      <aside><TrendingUp /><small>Research habit</small><strong>Read the method before the headline.</strong></aside>
    </div>
  </section>;
}
