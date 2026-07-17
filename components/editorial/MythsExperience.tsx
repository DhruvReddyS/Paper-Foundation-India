"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, Check, ChevronLeft, ChevronRight, ExternalLink, Search, ScanSearch, Sparkles, Stamp, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, type CSSProperties, type PointerEvent } from "react";
import handbookCards from "@/content/mythCatalog.json";

type Verdict = "myth" | "fact" | "context";
type HandbookCard = (typeof handbookCards)[number] & { category: string; number: number };

const categories = [
  ["Forests & fibre", 8], ["Carbon & biodiversity", 13], ["India & agroforestry", 19],
  ["Recovery", 30], ["Packaging", 38], ["Digital & print", 44],
  ["Mills & chemistry", 52], ["Responsible use", 60],
] as const;
const categoryFor = (index: number) => categories.find(([, end]) => index < end)?.[0] ?? "Paper systems";
const categorySlug = (category: string) => category.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const claims = handbookCards.slice(0, 6).map((card, index) => ({
  claim: card.myth,
  verdict: "myth" as Verdict,
  short: card.reality.split(/[.!?]/)[0],
  explanation: card.reality,
  source: card.evidence,
  index,
}));

export default function MythsExperience() {
  const reduced = useReducedMotion();
  const [claimIndex, setClaimIndex] = useState(0);
  const [answer, setAnswer] = useState<Verdict | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [query, setQuery] = useState("");
  const [openCase, setOpenCase] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const claim = claims[claimIndex];
  const library = useMemo(() => handbookCards.map((card, index) => ({ ...card, category: categoryFor(index), number: index + 1 })), []);
  const grouped = useMemo(() => categories.map(([name], index) => ({
    name,
    slug: categorySlug(name),
    items: library.slice(index === 0 ? 0 : categories[index - 1][1], categories[index][1]),
  })), [library]);
  const filteredLibrary = useMemo(() => library.filter((item) => `${item.category} ${item.myth} ${item.reality} ${item.indiaContext}`.toLowerCase().includes(query.toLowerCase())), [library, query]);

  function move(event: PointerEvent<HTMLElement>) {
    if (reduced) return;
    const box = event.currentTarget.getBoundingClientRect();
    setPointer({ x: (event.clientX - box.left) / box.width - .5, y: (event.clientY - box.top) / box.height - .5 });
  }
  function change(direction: -1 | 1) { setAnswer(null); setClaimIndex((claimIndex + direction + claims.length) % claims.length); }

  return <div className="myths-premium">
    <section className="myths-premium-hero myths-card-deck-hero" onPointerMove={move}>
      <div className="myths-hero-copy">
        <p className="premium-kicker"><span /> Sixty claims · evidence attached</p>
        <h1>What if the claim<br /><em>is only half the story?</em></h1>
        <p>Pull one from the pile. Break its seal. Decide whether it is a myth, a fact—or a sentence missing the context that changes everything.</p>
        <a href="#claim-lab">Test your first claim <ArrowDown /></a>
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
      <div className="myths-hero-metrics"><span><b>60</b> handbook claims</span><span><b>08</b> evidence categories</span><span><b>03</b> possible verdicts</span></div>
    </section>

    <section id="claim-lab" className="claim-lab-premium">
      <div className="claim-lab-heading"><div><p className="premium-kicker">Interactive claim press</p><h2>What would<br />you print?</h2></div><p>Choose a verdict. The desk compares it with the evidence and repairs the sentence when important context is missing.</p></div>
      <div className="claim-workbench">
        <aside><span>Case queue</span>{claims.map((item, index) => <button key={item.claim} onClick={() => { setClaimIndex(index); setAnswer(null); }} className={index === claimIndex ? "is-active" : ""}><i>{String(index + 1).padStart(2, "0")}</i><b>{item.short}</b></button>)}</aside>
        <div className="claim-paper-stage">
          <AnimatePresence mode="wait"><motion.article key={claimIndex} initial={{ opacity: 0, y: 24, rotate: 1 }} animate={{ opacity: 1, y: 0, rotate: -.5 }} exit={{ opacity: 0, y: -18 }}>
            <header><span>CLAIM {String(claimIndex + 1).padStart(2, "0")}</span><small>Choose the stamp</small></header>
            <blockquote>{claim.claim}</blockquote>
            <div className="claim-verdict-buttons">{(["myth", "fact", "context"] as Verdict[]).map(verdict => <button key={verdict} onClick={() => setAnswer(verdict)} className={answer === verdict ? "is-selected" : ""}><Stamp />{verdict === "context" ? "Needs context" : verdict}</button>)}</div>
            <AnimatePresence>{answer && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className={`claim-lab-result ${answer === claim.verdict ? "is-right" : "is-repair"}`}><span>{answer === claim.verdict ? <Check /> : <X />}{answer === claim.verdict ? "Defensible verdict" : `Better verdict: ${claim.verdict}`}</span><p>{claim.explanation}</p><small>Evidence route · {claim.source}</small></motion.div>}</AnimatePresence>
          </motion.article></AnimatePresence>
          <div className="claim-stage-controls"><button onClick={() => change(-1)} aria-label="Previous claim"><ChevronLeft /></button><span>{claimIndex + 1} / {claims.length}</span><button onClick={() => change(1)} aria-label="Next claim"><ChevronRight /></button></div>
        </div>
      </div>
    </section>

    <section className="myth-library-premium myth-streaming-library">
      <header><div><p className="premium-kicker">Browse by evidence category</p><h2>Choose a shelf.<br />Then break a seal.</h2></div><p>Like a documentary library, every subject has its own rail. Open a case to reveal the reality, explanation, India context and evidence route.</p></header>
      <label className="myth-search-desk"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all sixty claims..." /><span>{String(filteredLibrary.length).padStart(2, "0")} cases</span></label>

      {query ? <div className="myth-handbook-grid myth-search-results">{filteredLibrary.map((item, index) => <MythCase key={item.id} item={item} index={index} open={openCase === item.id} onToggle={() => setOpenCase(openCase === item.id ? null : item.id)} />)}</div> :
        <div className="myth-category-shelves">{grouped.map((group, groupIndex) => {
          const expanded = expandedCategory === group.slug;
          const visible = expanded ? group.items : group.items.slice(0, 6);
          return <section className={`myth-category-shelf shelf-tone-${groupIndex % 4 + 1}`} id={group.slug} key={group.slug}>
            <header><div><span>{String(groupIndex + 1).padStart(2, "0")}</span><h3>{group.name}</h3><small>{group.items.length} cases</small></div><button onClick={() => setExpandedCategory(expanded ? null : group.slug)}>{expanded ? "Collapse shelf" : "View all"} <ArrowRight /></button></header>
            <div className={expanded ? "myth-shelf-grid" : "myth-shelf-rail"}>{visible.map((item, index) => <MythCase key={item.id} item={item} index={index} open={openCase === item.id} onToggle={() => setOpenCase(openCase === item.id ? null : item.id)} />)}</div>
          </section>;
        })}</div>}
      {filteredLibrary.length === 0 && <div className="myth-search-empty"><ScanSearch /><strong>No matching case yet.</strong><p>Try a broader word or submit the claim to the foundation.</p></div>}
    </section>

    <section className="myth-method-premium">
      <div><p className="premium-kicker">Before you share</p><h2>A fast four-part<br />credibility scan.</h2><p>Good verification is a repeatable habit, not an instinct.</p></div>
      <div className="credibility-stack">{["Who made the claim?", "What boundaries were used?", "Can the method be inspected?", "Does local context change it?"].map((item, index) => <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .09 }} key={item}><span>{index + 1}</span><strong>{item}</strong><Check /></motion.div>)}</div>
    </section>

    <section className="myth-premium-cta"><Sparkles /><p>Ready for the game version?</p><h2>Put claims through<br />The Truth Press.</h2><Link href="/discover/truth-press">Play the verification game <ArrowRight /></Link><a href="https://www.fao.org/sustainable-forest-management/toolbox/modules/management-of-planted-forests/further-learning/en/" target="_blank" rel="noreferrer">Inspect a primary source <ExternalLink /></a></section>
  </div>;
}

function MythCase({ item, index, open, onToggle }: { item: HandbookCard; index: number; open: boolean; onToggle: () => void }) {
  return <motion.article layout whileHover={open ? undefined : { y: -9, rotate: index % 2 ? .35 : -.35 }} className={`case-tone-${index % 5 + 1} ${open ? "is-open" : ""}`}>
    <button className="myth-case-trigger" aria-expanded={open} onClick={onToggle}>
      <span>{String(item.number).padStart(2, "0")} / {item.category}</span>
      <strong>{item.myth}</strong>
      <div><small>{open ? "Close evidence" : "Break the seal"}</small><b>{open ? "×" : "+"}</b></div>
      <em className="myth-card-stamp">MYTH</em>
    </button>
    <AnimatePresence initial={false}>{open && <motion.div className="myth-case-reveal" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
      <p><small>Evidence-based reality</small>{item.reality}</p>
      <p><small>Why it matters</small>{item.explanation}</p>
      <p className="myth-india-note"><small>India context</small>{item.indiaContext}</p>
      <footer><span>{item.evidence}</span><b>Reviewed {item.reviewed}</b></footer>
    </motion.div>}</AnimatePresence>
  </motion.article>;
}
