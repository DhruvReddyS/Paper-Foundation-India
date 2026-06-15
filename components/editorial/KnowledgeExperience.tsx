"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, Clock, Factory, Leaf, Recycle, Search, Sparkles, Trees } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const features = [
  { type: "Cover essay", time: "8 min", title: "How fibre sourcing shapes the paper story.", deck: "Read past the material label and follow the decisions that create the outcome.", category: "Forestry", icon: Trees, tone: "forest", slug: "truth-about-paper-forestry" },
  { type: "Visual method", time: "6 min", title: "What a paper-recovery rate does not tell you.", deck: "Collection, contamination, yield and final use all sit behind one headline number.", category: "Recovery", icon: Recycle, tone: "copper", slug: "recycling-rates-compared" },
  { type: "Mill note", time: "7 min", title: "Inside the decisions that form a sheet.", deck: "Water removal, fibre preparation and energy choices change performance at the mill.", category: "Production", icon: Factory, tone: "ink", slug: "water-usage-modern-mills" },
] as const;

const articles = [
  { no: "01", category: "Forestry", title: "Why a fibre source needs more than a green label", time: "8 min", slug: "truth-about-paper-forestry" },
  { no: "02", category: "Recovery", title: "Reading recovery rates without losing the fibre-level story", time: "6 min", slug: "recycling-rates-compared" },
  { no: "03", category: "Method", title: "What life-cycle studies answer, and what they do not", time: "9 min", slug: "paper-vs-plastic-lifecycle" },
  { no: "04", category: "Production", title: "Water, heat and the quiet engineering of a paper mill", time: "7 min", slug: "water-usage-modern-mills" },
  { no: "05", category: "People", title: "The hands and livelihoods inside India’s fibre loop", time: "10 min", slug: "rural-livelihoods-paper" },
  { no: "06", category: "Innovation", title: "Designing paper products for another useful life", time: "5 min", slug: "innovation-in-indian-mills" },
] as const;

const categories = ["All", "Forestry", "Recovery", "Method", "Production", "People", "Innovation"];

export default function KnowledgeExperience() {
  const [feature, setFeature] = useState(0);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const active = features[feature];
  const ActiveIcon = active.icon;
  const filtered = useMemo(() => articles.filter(article => (category === "All" || article.category === category) && article.title.toLowerCase().includes(query.toLowerCase())), [category, query]);
  function change(direction: -1 | 1) { setFeature((feature + direction + features.length) % features.length); }

  return <div className="knowledge-studio">
    <section className="knowledge-studio-hero">
      <div className="knowledge-studio-copy"><p className="premium-kicker"><span /> Public reading studio · Open access</p><h1>Make room<br />for the <em>full story.</em></h1><p>Evidence-led essays, visual methods and field notes about paper, fibre and the systems surrounding them.</p><div><a href="#reading-index">Browse the index <ArrowRight /></a><Link href="/myths">Question a claim</Link></div></div>
      <div className="knowledge-studio-object" aria-hidden="true"><motion.div animate={{ rotate: [-2, 1, -2], y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity }}><small>OPEN / EDITION 01</small><BookOpen /><strong>CONTEXT<br />BEFORE<br />CONCLUSION</strong><span>Paper Foundation India</span></motion.div><i /><i /></div>
      <div className="knowledge-studio-ticker"><span>New reading</span><p>How fibre sourcing shapes the paper story</p><small>08 min</small><ArrowRight /></div>
    </section>

    <section className="knowledge-feature-carousel">
      <header><div><p className="premium-kicker">Editor’s selection</p><h2>One subject.<br />Three ways in.</h2></div><div className="feature-carousel-controls"><button onClick={() => change(-1)} aria-label="Previous feature"><ChevronLeft /></button><span>{String(feature + 1).padStart(2, "0")} / 03</span><button onClick={() => change(1)} aria-label="Next feature"><ChevronRight /></button></div></header>
      <div className="feature-carousel-stage">
        <AnimatePresence mode="wait"><motion.article key={feature} initial={{ opacity: 0, x: 45 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -45 }} className={`feature-tone-${active.tone}`}>
          <div className="feature-cover"><span>FIG. {String(feature + 1).padStart(2, "0")}</span><ActiveIcon /><i /><b /></div>
          <div className="feature-copy"><p>{active.type} · {active.category}</p><h3>{active.title}</h3><span>{active.deck}</span><div><small><Clock /> {active.time}</small><Link href={`/knowledge/${active.slug}`}>Open the essay <ArrowRight /></Link></div></div>
        </motion.article></AnimatePresence>
        <nav>{features.map((item, index) => <button key={item.title} onClick={() => setFeature(index)} className={index === feature ? "is-active" : ""}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><i /></button>)}</nav>
      </div>
    </section>

    <section id="reading-index" className="knowledge-reading-index">
      <header><div><p className="premium-kicker">Reading index</p><h2>Follow your question.</h2></div><label><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search the reading desk" /></label></header>
      <div className="knowledge-category-rail">{categories.map(item => <button onClick={() => setCategory(item)} className={category === item ? "is-active" : ""} key={item}>{item}</button>)}</div>
      <div className="knowledge-reading-list"><AnimatePresence mode="popLayout">{filtered.map(article => <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key={article.no}><Link href={`/knowledge/${article.slug}`}><span>{article.no}</span><small>{article.category}</small><strong>{article.title}</strong><em>{article.time}</em><ArrowRight /></Link></motion.div>)}</AnimatePresence>{filtered.length === 0 && <p className="knowledge-empty">No essay matches that search yet.</p>}</div>
    </section>

    <section className="knowledge-method-strip"><div><Sparkles /><p className="premium-kicker">Our reading rule</p><h2>Source visible.<br />Method legible.<br />Corrections permanent.</h2></div><div className="method-strip-cards"><article><span>01</span><strong>Trace the claim</strong><p>Find the source behind the confident sentence.</p></article><article><span>02</span><strong>Read the boundary</strong><p>Check what the number includes and excludes.</p></article><article><span>03</span><strong>Keep it correctable</strong><p>Good public knowledge can show its revisions.</p></article></div></section>

    <section className="knowledge-studio-cta"><Leaf /><h2>Start with one better question.</h2><p>Then follow it through the evidence.</p><Link href="/knowledge/truth-about-paper-forestry">Read the cover essay <ArrowRight /></Link></section>
  </div>;
}
