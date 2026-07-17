"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Compass, Factory, Leaf, Recycle, Search, Sparkles, Trees } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { articleCatalog, featuredArticles, type ArticleCatalogItem } from "@/content/articleCatalog";

const categoryIcon = (category: ArticleCatalogItem["category"]) => category === "Forestry" ? Trees : category === "Recovery" ? Recycle : category === "Production" ? Factory : Compass;
const articleImage = (category: ArticleCatalogItem["category"]) => `/images/knowledge/editorial-v2/${category.toLowerCase()}.jpg`;
const featureTones = ["forest", "copper", "ink"] as const;
const features = featuredArticles.slice(0, 3).map((article, index) => ({ type: article.format, time: article.time, title: article.title, deck: article.summary, category: article.category, icon: categoryIcon(article.category), tone: featureTones[index], slug: article.slug, image: articleImage(article.category) }));
const articles = articleCatalog.map(article => ({ no: String(article.id).padStart(2, "0"), category: article.category, title: article.title, time: article.time, slug: article.slug, summary: article.summary, image: articleImage(article.category) }));
const categories = ["All", "Forestry", "Recovery", "Method", "Production", "Education", "Use"];

const questionPaths = [
  { label: "Where did it begin?", title: "Follow the fibre source.", text: "Move from a green label to forest management, land use and traceable sourcing evidence.", category: "Forestry", icon: Trees },
  { label: "Can it return?", title: "Read the recovery route.", text: "Collection is only the beginning. Contamination, yield and final use shape what returns to a mill.", category: "Recovery", icon: Recycle },
  { label: "How was it made?", title: "Enter the mill decisions.", text: "Water removal, fibre preparation, energy and chemistry determine the performance of a sheet.", category: "Production", icon: Factory },
  { label: "What does the number mean?", title: "Inspect the method.", text: "A useful statistic names its boundaries, assumptions, date, geography and source.", category: "Method", icon: Compass },
] as const;

export default function KnowledgeExperience() {
  const [feature, setFeature] = useState(0);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [question, setQuestion] = useState(0);
  const active = features[feature];
  const ActiveIcon = active.icon;
  const activeQuestion = questionPaths[question];
  const QuestionIcon = activeQuestion.icon;
  const filtered = useMemo(() => articles.filter(article => (category === "All" || article.category === category) && article.title.toLowerCase().includes(query.toLowerCase())), [category, query]);
  function change(direction: -1 | 1) { setFeature((feature + direction + features.length) % features.length); }

  return <div className="knowledge-studio">
    <section className="knowledge-studio-hero">
      <div className="knowledge-studio-copy"><p className="premium-kicker"><span /> Public reading studio · Open access</p><h1>Make room<br />for the <em>full story.</em></h1><p>Evidence-led essays, visual methods and field notes about paper, fibre and the systems surrounding them.</p><div><a href="#reading-index">Browse the index <ArrowRight /></a><Link href="/myths">Question a claim</Link></div></div>
      <div className="knowledge-cover-constellation" aria-hidden="true">{features.map((item, index) => <motion.figure key={item.slug} animate={{ y: [0, index % 2 ? 8 : -8, 0], rotate: [index * 5 - 6, index * 5 - 3, index * 5 - 6] }} transition={{ duration: 6 + index, repeat: Infinity }}><Image src={item.image} alt="" fill sizes="260px" /><figcaption><small>{item.category}</small><strong>{item.title}</strong></figcaption></motion.figure>)}</div>
      <div className="knowledge-studio-ticker"><span>20-source desk</span><p>{featuredArticles[0].title}</p><small>{featuredArticles[0].time}</small><ArrowRight /></div>
    </section>

    <section className="knowledge-question-navigator">
      <header><p className="premium-kicker">Choose the question, not the content type</p><h2>How do you want<br />to enter the evidence?</h2></header>
      <div className="knowledge-question-stage">
        <nav>{questionPaths.map((item, index) => <button key={item.label} onClick={() => setQuestion(index)} className={question === index ? "is-active" : ""}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}</button>)}</nav>
        <AnimatePresence mode="wait"><motion.article key={question} initial={{ opacity: 0, scale: .96, rotate: 1 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 1.03, rotate: -1 }}><div className="knowledge-question-orbit"><i /><i /><QuestionIcon /></div><p>{activeQuestion.category} reading path</p><h3>{activeQuestion.title}</h3><span>{activeQuestion.text}</span><button onClick={() => { setCategory(activeQuestion.category); document.querySelector("#reading-index")?.scrollIntoView({ behavior: "smooth" }); }}>Open this reading path <ArrowRight /></button></motion.article></AnimatePresence>
      </div>
    </section>

    <section className="knowledge-feature-carousel">
      <header><div><p className="premium-kicker">Editor’s selection</p><h2>One material.<br />Three ways in.</h2><Link className="knowledge-all-features" href="/knowledge/featured">Enter the featured reading room <ArrowRight /></Link></div><div className="feature-carousel-controls"><button onClick={() => change(-1)} aria-label="Previous feature"><ChevronLeft /></button><span>{String(feature + 1).padStart(2, "0")} / 03</span><button onClick={() => change(1)} aria-label="Next feature"><ChevronRight /></button></div></header>
      <div className="feature-carousel-stage">
        <AnimatePresence mode="wait"><motion.article key={feature} initial={{ opacity: 0, x: 45 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -45 }} className={`feature-tone-${active.tone}`}>
          <div className="feature-cover"><Image src={active.image} alt="" fill sizes="(max-width: 700px) 100vw, 430px" /><span>FIG. {String(feature + 1).padStart(2, "0")}</span><ActiveIcon /><i /><b /></div>
          <div className="feature-copy"><p>{active.type} · {active.category}</p><h3>{active.title}</h3><span>{active.deck}</span><div><small><Clock /> {active.time}</small><Link href={`/knowledge/${active.slug}`}>Open the essay <ArrowRight /></Link></div></div>
        </motion.article></AnimatePresence>
        <nav>{features.map((item, index) => <button key={item.title} onClick={() => setFeature(index)} className={index === feature ? "is-active" : ""}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><i /></button>)}</nav>
      </div>
    </section>

    <section id="reading-index" className="knowledge-reading-index">
      <header><div><p className="premium-kicker">Reading index</p><h2>Follow your question.</h2></div><label><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search the reading desk" /></label></header>
      <div className="knowledge-category-rail">{categories.map(item => <button onClick={() => setCategory(item)} className={category === item ? "is-active" : ""} key={item}>{item}</button>)}</div>
      <div className="knowledge-cover-grid"><AnimatePresence mode="popLayout">{filtered.map(article => <motion.article layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key={article.no}><Link href={`/knowledge/${article.slug}`}><div><Image src={article.image} alt="" fill sizes="(max-width: 680px) 92vw, 390px" /><span>{article.no}</span><small>{article.category}</small></div><section><h3>{article.title}</h3><p>{article.summary}</p><footer><em><Clock /> {article.time} read</em><b>Read article <ArrowRight /></b></footer></section></Link></motion.article>)}</AnimatePresence>{filtered.length === 0 && <p className="knowledge-empty">No essay matches that search yet.</p>}</div>
    </section>

    <section className="knowledge-method-strip"><div><Sparkles /><p className="premium-kicker">Our reading rule</p><h2>Source visible.<br />Method legible.<br />Corrections permanent.</h2></div><div className="method-strip-cards"><article><span>01</span><strong>Trace the claim</strong><p>Find the source behind the confident sentence.</p></article><article><span>02</span><strong>Read the boundary</strong><p>Check what the number includes and excludes.</p></article><article><span>03</span><strong>Keep it correctable</strong><p>Good public knowledge can show its revisions.</p></article></div></section>

    <section className="knowledge-studio-cta"><Leaf /><h2>Start with one better question.</h2><p>Then follow it through the evidence.</p><Link href={`/knowledge/${featuredArticles[0].slug}`}>Read the cover essay <ArrowRight /></Link></section>
  </div>;
}
