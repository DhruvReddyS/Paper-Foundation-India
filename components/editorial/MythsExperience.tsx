"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, Check, ExternalLink, Gamepad2, Search, ScanSearch, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, type CSSProperties, type PointerEvent } from "react";
import handbookCards from "@/content/mythCatalog.json";

type HandbookCard = (typeof handbookCards)[number] & { category: string; number: number };

const categories = [
  ["Forests & fibre", 8], ["Carbon & biodiversity", 13], ["India & agroforestry", 19],
  ["Recovery", 30], ["Packaging", 38], ["Digital & print", 44],
  ["Mills & chemistry", 52], ["Responsible use", 60],
] as const;
const categoryFor = (index: number) => categories.find(([, end]) => index < end)?.[0] ?? "Paper systems";
const categorySlug = (category: string) => category.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function MythsExperience() {
  const reduced = useReducedMotion();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(categories[0][0] as string);
  const [selectedCase, setSelectedCase] = useState<HandbookCard | null>(null);
  const library = useMemo(() => handbookCards.map((card, index) => ({ ...card, category: categoryFor(index), number: index + 1 })), []);
  const grouped = useMemo(() => categories.map(([name], index) => ({
    name,
    slug: categorySlug(name),
    items: library.slice(index === 0 ? 0 : categories[index - 1][1], categories[index][1]),
  })), [library]);
  const filteredLibrary = useMemo(() => library.filter((item) => `${item.category} ${item.myth} ${item.reality} ${item.indiaContext}`.toLowerCase().includes(query.toLowerCase())), [library, query]);
  const activeGroup = grouped.find((group) => group.name === activeCategory) ?? grouped[0];

  function move(event: PointerEvent<HTMLElement>) {
    if (reduced) return;
    const box = event.currentTarget.getBoundingClientRect();
    setPointer({ x: (event.clientX - box.left) / box.width - .5, y: (event.clientY - box.top) / box.height - .5 });
  }

  return <div className="myths-premium">
    <section className="myths-premium-hero myths-card-deck-hero" onPointerMove={move}>
      <div className="myths-hero-copy">
        <p className="premium-kicker"><span /> Sixty claims · evidence attached</p>
        <h1>What if the claim<br /><em>is only half the story?</em></h1>
        <p>Pull one from the pile. Break its seal. Decide whether it is a myth, a fact—or a sentence missing the context that changes everything.</p>
        <a href="#myth-library">Choose an evidence category <ArrowDown /></a>
      </div>
      <div className="myths-hero-card-stack" aria-label="A stack of paper claims">
        {library.slice(0, 5).map((item, index) => {
          const offsets = [-2, -1, 0, 1, 2];
          return <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 70, rotate: offsets[index] * 6 }}
            animate={{ opacity: 1, y: pointer.y * (10 + index * 3), x: pointer.x * (18 + index * 4), rotate: offsets[index] * 6 + pointer.x * 2 }}
            transition={{ delay: index * .07, type: "spring", stiffness: 90, damping: 18 }}
            style={{ "--deck-index": index } as CSSProperties}
          >
            <header><span>CASE {String(item.number).padStart(2, "0")}</span><small>{item.category}</small></header>
            <strong>{item.myth}</strong>
            <footer><b>MYTH</b><i /><em>FACT</em></footer>
          </motion.article>;
        })}
      </div>
      <div className="myths-hero-metrics"><span><b>60</b> handbook claims</span><span><b>08</b> evidence categories</span><span><b>01</b> claim at a time</span></div>
    </section>

    <section className="myth-game-bridge">
      <div>
        <p className="premium-kicker"><Gamepad2 /> Ready for the game version?</p>
        <h2>Read a claim here.<br /><em>Put it under pressure there.</em></h2>
        <p>Turn the same evidence habit into a quick challenge. Stamp a verdict, repair missing context or grow a tree by choosing the stronger answer.</p>
      </div>
      <div className="myth-game-tickets">
        <Link href="/discover/truth-press"><span>GAME 02 · CLAIM LAB</span><strong>The Truth Press</strong><p>Myth, fact or missing context?</p><b>Play now <ArrowRight /></b></Link>
        <Link href="/discover/grow-or-shred"><span>GAME 01 · PAPER IQ</span><strong>Grow or Shred</strong><p>Grow evidence. Shred assumptions.</p><b>Play now <ArrowRight /></b></Link>
        <Link href="/games"><span>THE PLAYABLE EDITION</span><strong>All five games</strong><p>Choose your way into the evidence.</p><b>Open game hub <ArrowRight /></b></Link>
      </div>
    </section>

    <section id="myth-library" className="myth-library-premium myth-evidence-wall">
      <header><div><p className="premium-kicker">Browse by evidence category</p><h2>Choose a subject.<br />Open one dossier.</h2></div><p>No collapsing shelves and no broken grid. Pick a category, then open any card in a focused evidence reader without disturbing the wall behind it.</p></header>
      <label className="myth-search-desk"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all sixty claims..." /><span>{String(filteredLibrary.length).padStart(2, "0")} cases</span></label>

      {!query && <nav className="myth-category-index" aria-label="Myth categories">
        {grouped.map((group, index) => <button key={group.slug} onClick={() => setActiveCategory(group.name)} className={activeCategory === group.name ? "is-active" : ""}><span>{String(index + 1).padStart(2, "0")}</span><strong>{group.name}</strong><small>{group.items.length}</small></button>)}
      </nav>}

      <div className="myth-wall-heading">
        <div><span>{query ? "SEARCH RESULTS" : activeGroup.slug.replaceAll("-", " / ").toUpperCase()}</span><h3>{query ? `${filteredLibrary.length} matching dossiers` : activeGroup.name}</h3></div>
        <p>Click a seal to open that claim on its own reading desk.</p>
      </div>

      <motion.div layout className="myth-evidence-grid">
        <AnimatePresence mode="popLayout">
          {(query ? filteredLibrary : activeGroup.items).map((item, index) => <MythCase key={item.id} item={item} index={index} onOpen={() => setSelectedCase(item)} />)}
        </AnimatePresence>
      </motion.div>
      {filteredLibrary.length === 0 && <div className="myth-search-empty"><ScanSearch /><strong>No matching case yet.</strong><p>Try a broader word or submit the claim to the foundation.</p></div>}
    </section>

    <section className="myth-method-premium">
      <div><p className="premium-kicker">Before you share</p><h2>A fast four-part<br />credibility scan.</h2><p>Good verification is a repeatable habit, not an instinct.</p></div>
      <div className="credibility-stack">{["Who made the claim?", "What boundaries were used?", "Can the method be inspected?", "Does local context change it?"].map((item, index) => <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .09 }} key={item}><span>{index + 1}</span><strong>{item}</strong><Check /></motion.div>)}</div>
    </section>

    <section className="myth-premium-cta"><Sparkles /><p>Keep following the evidence</p><h2>Read the long-form<br />editorial selection.</h2><Link href="/knowledge/featured">Explore featured articles <ArrowRight /></Link><a href="https://www.fao.org/sustainable-forest-management/toolbox/modules/management-of-planted-forests/further-learning/en/" target="_blank" rel="noreferrer">Inspect a primary source <ExternalLink /></a></section>

    <AnimatePresence>{selectedCase && <EvidenceDossier item={selectedCase} onClose={() => setSelectedCase(null)} />}</AnimatePresence>
  </div>;
}

function MythCase({ item, index, onOpen }: { item: HandbookCard; index: number; onOpen: () => void }) {
  return <motion.article layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .94 }} transition={{ delay: Math.min(index * .025, .18) }} whileHover={{ y: -8, rotate: index % 2 ? .25 : -.25 }} className={`case-tone-${index % 5 + 1}`}>
    <button className="myth-case-trigger" onClick={onOpen}>
      <span>{String(item.number).padStart(2, "0")} / {item.category}</span>
      <strong>{item.myth}</strong>
      <div><small>Open evidence dossier</small><b>↗</b></div>
      <em className="myth-card-stamp">MYTH</em>
    </button>
  </motion.article>;
}

function EvidenceDossier({ item, onClose }: { item: HandbookCard; onClose: () => void }) {
  return <motion.div className="myth-dossier-backdrop" role="dialog" aria-modal="true" aria-label={`Evidence for ${item.myth}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <motion.article initial={{ opacity: 0, y: 60, rotate: 1.5 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ type: "spring", stiffness: 160, damping: 22 }} onClick={(event) => event.stopPropagation()}>
      <header><span>CASE {String(item.number).padStart(2, "0")} · {item.category}</span><button onClick={onClose} aria-label="Close evidence dossier"><X /></button></header>
      <div className="myth-dossier-claim"><small>Claim in circulation</small><h2>{item.myth}</h2><b>MYTH</b></div>
      <div className="myth-dossier-columns">
        <section><span>01 · Evidence-based reality</span><p>{item.reality}</p></section>
        <section><span>02 · Why it matters</span><p>{item.explanation}</p></section>
        <section><span>03 · India context</span><p>{item.indiaContext}</p></section>
      </div>
      <footer><div><small>Evidence route</small><p>{item.evidence}</p></div><strong>REVIEWED<br />{item.reviewed}</strong></footer>
    </motion.article>
  </motion.div>;
}
