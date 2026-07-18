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
  "A field atlas of the fibre routes that make India’s paper system unusually diverse.",
  "A close look at the people and logistics that turn discarded sheets into mill-ready furnish.",
  "A patient carbon account that keeps biology, energy, product life and timing in view.",
  "A practical design brief for packaging that protects its contents without hiding its next route.",
  "A mill-of-the-future dossier grounded in water, energy, fibre efficiency and inspectable data.",
];

export default function FeaturedArticlesExperience() {
  const [lead, ...rest] = featuredArticles;

  return (
    <main className="feature-folio">
      <nav className="feature-folio-nav">
        <Link href="/knowledge"><ArrowLeft /> Article index</Link>
        <span><Sparkles /> PFI editorial selection · {featuredArticles.length}</span>
      </nav>

      <header className="feature-folio-header">
        <div>
          <p>THE FEATURE FOLIO / FIELD EDITION 01</p>
          <h1>Ten stories selected<br /><em>for the slower read.</em></h1>
        </div>
        <aside>
          <Quote />
          <p>Context is not a footnote. It is where an honest conclusion begins.</p>
          <span>Paper Foundation India · Editorial desk</span>
        </aside>
      </header>

      <motion.article
        className="feature-folio-lead"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link href={`/knowledge/${lead.slug}`}>
          <div className="feature-folio-lead-image">
            <Image src={articleCoverImage(lead)} alt={`Cover for ${lead.title}`} fill priority sizes="(max-width: 850px) 100vw, 58vw" />
            <span>LEAD FEATURE / 01</span><i />
          </div>
          <div className="feature-folio-lead-copy">
            <div><span>{lead.category}</span><small><Clock /> {lead.time} read</small></div>
            <h2>{lead.title}</h2>
            <p>{lead.summary}</p>
            <blockquote>{editorialNotes[0]}</blockquote>
            <footer><span><BookOpen /> Long-form visual essay</span><b>Begin reading <ArrowRight /></b></footer>
          </div>
        </Link>
      </motion.article>

      <section className="feature-folio-index">
        <header>
          <div><p>THE REMAINING SELECTION</p><h2>Nine more dossiers.</h2></div>
          <span>Every cover is unique. Every story keeps its reading time, scope and editorial note visible.</span>
        </header>
        <div className="feature-folio-list">
          {rest.map((article, index) => (
            <motion.article key={article.slug} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ delay: Math.min(index * .045, .2) }}>
              <Link href={`/knowledge/${article.slug}`}>
                <div className="feature-folio-thumb">
                  <Image src={articleCoverImage(article)} alt={`Cover for ${article.title}`} fill sizes="(max-width: 680px) 34vw, 240px" />
                  <span>{String(index + 2).padStart(2, "0")}</span>
                </div>
                <div className="feature-folio-row-copy">
                  <p>{article.category} · EDITOR&apos;S LONG-FORM</p>
                  <h3>{article.title}</h3>
                  <span>{article.summary}</span>
                  <blockquote><Quote /> {editorialNotes[index + 1]}</blockquote>
                </div>
                <aside><small><Clock /> {article.time} read</small><b>Open <ArrowRight /></b></aside>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
