"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, ExternalLink, Gamepad2, Search, ScanSearch, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, type CSSProperties, type PointerEvent } from "react";
import handbookCards from "@/content/mythCatalog.json";
import heroStyles from "./MythsHero.module.css";

type HandbookCard = (typeof handbookCards)[number] & { category: string; number: number };

const categories = [
  ["Forests & fibre", 8], ["Carbon & biodiversity", 13], ["India & agroforestry", 19],
  ["Recovery", 30], ["Packaging", 38], ["Digital & print", 44],
  ["Mills & chemistry", 52], ["Responsible use", 60],
] as const;
const categoryFor = (index: number) => categories.find(([, end]) => index < end)?.[0] ?? "Paper systems";
const categorySlug = (category: string) => category.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function MythsExperience({ initialSearch = "" }: { initialSearch?: string }) {
  const reduced = useReducedMotion();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [query, setQuery] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState(categories[0][0] as string);
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
    <section className={`myths-premium-hero myths-card-deck-hero ${heroStyles.hero}`} onPointerMove={move}>
      <div className={`myths-hero-card-stack ${heroStyles.stack}`} aria-hidden="true">
        {library.slice(0, 16).map((item, index) => {
          const rotations = [-13, 2, -5, 8, -2, 12, -8, 5, -4, 9, -11, 6, 13, -6, 3, -9];
          const showsFact = index % 3 === 1;
          return <motion.article
            key={item.id}
            className={heroStyles.card}
            initial={{ opacity: 0, scale: .86, rotate: rotations[index] }}
            animate={{ opacity: 1, y: pointer.y * (8 + index), x: pointer.x * (9 + index * 1.5), rotate: rotations[index] + pointer.x * 1.4, scale: 1 }}
            transition={{ delay: index * .045, type: "spring", stiffness: 80, damping: 19 }}
            style={{ "--deck-index": index } as CSSProperties}
          >
            <span className={heroStyles.pin} />
            <header><span>CASE {String(item.number).padStart(2, "0")}</span><small>{item.category}</small></header>
            <strong title={showsFact ? item.reality : item.myth}>{showsFact ? item.reality : item.myth}</strong>
            <p className={heroStyles.cardNote}>{showsFact ? "Context recovered" : "Filed for evidence review"}</p>
            <footer><b>{showsFact ? "FACT" : "MYTH"}</b><i /><em>{showsFact ? "EVIDENCE" : "REVIEW"}</em></footer>
          </motion.article>;
        })}
      </div>
      <motion.div className={`myths-hero-copy ${heroStyles.copy}`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .22 }}>
        <h1>What if the claim<br /><em>is only half the story?</em></h1>
        <p>Pull one from the pile. Break its seal. Decide whether it is a myth, a fact—or a sentence missing the context that changes everything.</p>
      </motion.div>
    </section>

    <section id="myth-library" className="myth-library-premium myth-evidence-wall">
      <header><div><p className="premium-kicker">Browse by evidence category</p><h2>Choose a subject.<br />Open one dossier.</h2></div><p>Compare each claim with the evidence-based reality, its boundary and the context that applies in India.</p></header>
      <label className="myth-search-desk"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all sixty claims..." /><span>{String(filteredLibrary.length).padStart(2, "0")} cases</span></label>

      <div className="myth-library-layout">
        {!query && <nav className="myth-category-index" aria-label="Myth categories">
          <span className="myth-category-caption">EVIDENCE CATEGORIES</span>
          {grouped.map((group, index) => <button key={group.slug} onClick={() => setActiveCategory(group.name)} className={activeCategory === group.name ? "is-active" : ""}><span>{String(index + 1).padStart(2, "0")}</span><strong>{group.name}</strong><small>{group.items.length}</small></button>)}
        </nav>}

        <div className="myth-library-cases">
          <div className="myth-wall-heading">
            <div><span>{query ? "SEARCH RESULTS" : activeGroup.slug.replaceAll("-", " / ").toUpperCase()}</span><h3>{query ? `${filteredLibrary.length} matching dossiers` : activeGroup.name}</h3></div>
            <p>Break a seal to read the evidence-based reality and its Indian context.</p>
          </div>

          <motion.div layout className="myth-evidence-grid">
            <AnimatePresence mode="popLayout">
              {(query ? filteredLibrary : activeGroup.items).map((item, index) => <MythCase key={item.id} item={item} index={index} />)}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      {filteredLibrary.length === 0 && <div className="myth-search-empty"><ScanSearch /><strong>No matching case yet.</strong><p>Try a broader word or submit the claim to the foundation.</p></div>}
    </section>

    <section className="myth-method-premium">
      <div><p className="premium-kicker">Before you share</p><h2>Pause the headline.<br />Read what surrounds it.</h2><p>Paper Foundation examines claims through source, boundary, method and Indian context—then publishes the evidence trail.</p></div>
      <div className="credibility-stack">{["Source — who made the claim?", "Boundary — what was included?", "Method — can it be inspected?", "Context — does place change it?"].map((item, index) => <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .09 }} key={item}><span>{index + 1}</span><strong>{item}</strong><Check /></motion.div>)}</div>
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
        <Link href="/discover/mill-master"><span>GAME 03 · PROCESS</span><strong>Mill Shuffle</strong><p>Put the mill stages in order.</p><b>Play now <ArrowRight /></b></Link>
        <Link href="/discover/hidden-paper"><span>GAME 04 · CLUE HUNT</span><strong>Hidden Paper</strong><p>Find fibre hiding in daily life.</p><b>Play now <ArrowRight /></b></Link>
        <Link href="/discover/paper-word-search"><span>GAME 05 · WORD HUNT</span><strong>Fibre Word Search</strong><p>Find ten words against the clock.</p><b>Play now <ArrowRight /></b></Link>
      </div>
    </section>

    <section className="myth-premium-cta"><Sparkles /><p>Keep following the evidence</p><h2>Read the long-form<br />editorial selection.</h2><Link href="/knowledge/featured">Explore featured articles <ArrowRight /></Link><a href="https://www.fao.org/sustainable-forest-management/toolbox/modules/management-of-planted-forests/further-learning/en/" target="_blank" rel="noreferrer">Inspect a primary source <ExternalLink /></a></section>
  </div>;
}

function MythCase({ item, index }: { item: HandbookCard; index: number }) {
  const [revealed, setRevealed] = useState(false);
  return <motion.article layout initial={{ opacity: 0, y: 24, rotate: index % 2 ? 1 : -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, scale: .94 }} transition={{ delay: Math.min(index * .025, .18) }} whileHover={{ y: -7, rotate: index % 2 ? .35 : -.35 }} className={`case-tone-${index % 5 + 1} ${revealed ? "is-revealed" : ""}`}>
    <button className="myth-case-trigger" onClick={() => setRevealed(value => !value)} aria-expanded={revealed}>
      <AnimatePresence mode="wait" initial={false}>
        {!revealed ? <motion.div className="myth-card-face myth-card-front" key="myth" initial={{ opacity: 0, rotateX: -8 }} animate={{ opacity: 1, rotateX: 0 }} exit={{ opacity: 0, rotateX: 8 }} transition={{ duration: .22 }}>
          <span>{String(item.number).padStart(2, "0")} / {item.category}</span>
          <strong>{item.myth}</strong>
          <div><small>Break the seal to reveal</small><b>↗</b></div>
          <em className="myth-card-stamp">MYTH</em>
        </motion.div> : <motion.div className="myth-card-face myth-card-fact" key="fact" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .28 }}>
          <span>EVIDENCE-BASED REALITY / {item.category}</span>
          <strong>{item.reality}</strong>
          <p>{item.indiaContext}</p>
          <div><small>{item.evidence}</small><b>↙</b></div>
          <em className="myth-card-stamp">FACT</em>
        </motion.div>}
      </AnimatePresence>
    </button>
  </motion.article>;
}
