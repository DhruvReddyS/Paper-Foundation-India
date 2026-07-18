"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, Quote, Sparkles } from "lucide-react";
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
  const [lead, second, third, ...ledger] = featuredArticles;

  return (
    <main className="feature-vault">
      <nav className="feature-vault-nav">
        <Link href="/knowledge"><ArrowLeft /> All articles</Link>
        <span><Sparkles /> PFI editorial desk · selection 01</span>
      </nav>

      <header className="feature-vault-masthead">
        <span className="feature-vault-edition">THE<br />FEATURE<br />FOLIO</span>
        <div>
          <p>Ten stories selected for context, craft and the slower read.</p>
          <h1>Stories worth<br /><em>leaving open.</em></h1>
        </div>
        <blockquote><Quote />Context is not a footnote. It is where an honest conclusion begins.</blockquote>
      </header>

      <section className="feature-vault-desk">
        <motion.article className="feature-vault-lead" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}>
          <Link href={`/knowledge/${lead.slug}`}>
            <div className="feature-vault-lead-image">
              <Image src={articleCoverImage(lead)} alt={`Cover for ${lead.title}`} fill priority sizes="(max-width: 860px) 100vw, 64vw" />
              <span>01 / LEAD FEATURE</span>
            </div>
            <div className="feature-vault-lead-copy">
              <span>{lead.category} · {lead.format}</span>
              <h2>{lead.title}</h2>
              <p>{lead.summary}</p>
              <footer><small><Clock /> {lead.time} read</small><b>Read the feature <ArrowRight /></b></footer>
            </div>
          </Link>
        </motion.article>

        <aside className="feature-vault-side">
          {[second, third].map((article, index) => (
            <motion.article key={article.slug} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .1 + index * .08 }}>
              <Link href={`/knowledge/${article.slug}`}>
                <div>
                  <Image src={articleCoverImage(article)} alt={`Cover for ${article.title}`} fill sizes="(max-width: 860px) 50vw, 360px" />
                  <span>0{index + 2}</span>
                </div>
                <small>{article.category} · {article.time} read</small>
                <h3>{article.title}</h3>
                <p>{editorialNotes[index + 1]}</p>
                <b>Open <ArrowRight /></b>
              </Link>
            </motion.article>
          ))}
        </aside>
      </section>

      <section className="feature-vault-ledger">
        <header>
          <div><p>THE EDITORIAL LEDGER</p><h2>Seven more<br />field dossiers.</h2></div>
          <p>Each selection pairs a distinct visual cover with its scope, reading time and editorial reason for being here.</p>
        </header>
        <div>
          {ledger.map((article, index) => (
            <motion.article key={article.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ delay: Math.min(index * .05, .2) }}>
              <Link href={`/knowledge/${article.slug}`}>
                <span>{String(index + 4).padStart(2, "0")}</span>
                <div className="feature-vault-ledger-image"><Image src={articleCoverImage(article)} alt={`Cover for ${article.title}`} fill sizes="180px" /></div>
                <div><small>{article.category} · {article.format}</small><h3>{article.title}</h3><p>{editorialNotes[index + 3]}</p></div>
                <aside><Clock /> {article.time}<ArrowRight /></aside>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
