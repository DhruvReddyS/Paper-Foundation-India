"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Clock, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { articleCatalog, type ArticleCatalogItem } from "@/content/articleCatalog";

const articleImage = (category: ArticleCatalogItem["category"]) => `/images/knowledge/editorial-v2/${category.toLowerCase()}.jpg`;
const categories = ["All", "Forestry", "Recovery", "Method", "Production", "Education", "Use"];

export default function KnowledgeExperience() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => articleCatalog.filter(article =>
    (category === "All" || article.category === category) &&
    `${article.title} ${article.summary}`.toLowerCase().includes(query.toLowerCase())
  ), [category, query]);

  return <main className="articles-card-room">
    <section className="articles-card-toolbar">
      <div>
        <p>Knowledge Hub / Article index</p>
        <h1>Every article,<br /><em>on the reading table.</em></h1>
      </div>
      <label><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search articles" /><span>{filtered.length}</span></label>
    </section>

    <nav className="articles-category-tabs" aria-label="Article categories">
      {categories.map(item => <button key={item} onClick={() => setCategory(item)} className={category === item ? "is-active" : ""}>{item}</button>)}
      <Link href="/knowledge/featured">Featured selection <ArrowRight /></Link>
    </nav>

    <section className="articles-paper-grid" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {filtered.map((article, index) => <motion.article layout key={article.slug} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }} transition={{ delay: Math.min(index * .035, .2) }} className={`article-paper-card article-paper-tone-${index % 4 + 1}`}>
          <Link href={`/knowledge/${article.slug}`}>
            <div className="article-paper-cover">
              <Image src={articleImage(article.category)} alt="" fill sizes="(max-width: 680px) 94vw, (max-width: 1050px) 47vw, 31vw" />
              <span>{String(article.id).padStart(2, "0")}</span>
              <small>{article.category}</small>
              <i aria-hidden="true" />
            </div>
            <div className="article-paper-copy">
              <p>{article.format}</p>
              <h2>{article.title}</h2>
              <span>{article.summary}</span>
              <footer><small><Clock /> {article.time} read</small><b>Open article <ArrowRight /></b></footer>
            </div>
          </Link>
        </motion.article>)}
      </AnimatePresence>
      {filtered.length === 0 && <div className="articles-empty">No article matches this search yet.</div>}
    </section>
  </main>;
}
