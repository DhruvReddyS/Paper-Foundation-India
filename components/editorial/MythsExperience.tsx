"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, Check, ChevronLeft, ChevronRight, ExternalLink, Search, ScanSearch, Sparkles, Stamp, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, type PointerEvent } from "react";

type Verdict = "myth" | "fact" | "context";
const claims: { claim: string; verdict: Verdict; short: string; explanation: string; source: string }[] = [
  { claim: "Using paper automatically causes deforestation.", verdict: "context", short: "Source decides the story", explanation: "A paper product does not reveal its forestry outcome by material name alone. Fibre source, land-use change and management evidence determine the answer.", source: "FAO sustainable forest management guidance" },
  { claim: "Clean, dry corrugated boxes are valuable recovered fibre.", verdict: "fact", short: "Keep the box clean and dry", explanation: "Corrugated board is a widely recovered paper grade. Flattening it and keeping it dry supports collection and mill use.", source: "Recovered-paper collection guidance" },
  { claim: "Paper fibres can be recycled forever.", verdict: "myth", short: "The loop loses fibre", explanation: "Fibres shorten and material is lost through use and recovery. Responsible fresh fibre helps replenish a functioning loop.", source: "CEPI fibre-loop guidance" },
  { claim: "Every paper package belongs in every paper bin.", verdict: "myth", short: "Design and contamination matter", explanation: "Food residue, wax and some barrier layers can make a package unsuitable for a local paper-recovery system.", source: "Paper packaging recyclability guidance" },
];

const library = [
  { category: "Forests", text: "Fresh fibre always means natural forest loss.", verdict: "Context", note: "Source and forest management determine the outcome." },
  { category: "Recovery", text: "A greasy pizza box recycles exactly like a clean carton.", verdict: "Myth", note: "Food residue and local acceptance change the route." },
  { category: "Digital", text: "Digital communication has no material footprint.", verdict: "Myth", note: "Devices, networks, data centres and energy remain material systems." },
  { category: "Design", text: "A paper label makes a package automatically recyclable.", verdict: "Myth", note: "Coatings, adhesives and construction still matter." },
  { category: "Use", text: "Using paper responsibly includes using it fully.", verdict: "Fact", note: "Fit-for-purpose use protects the value already invested in fibre." },
] as const;

export default function MythsExperience() {
  const reduced = useReducedMotion();
  const [claimIndex, setClaimIndex] = useState(0);
  const [answer, setAnswer] = useState<Verdict | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [query, setQuery] = useState("");
  const claim = claims[claimIndex];
  const filteredLibrary = useMemo(() => library.filter((item) => `${item.category} ${item.text} ${item.verdict} ${item.note}`.toLowerCase().includes(query.toLowerCase())), [query]);

  function move(event: PointerEvent<HTMLElement>) {
    if (reduced) return;
    const box = event.currentTarget.getBoundingClientRect();
    setPointer({ x: (event.clientX - box.left) / box.width - .5, y: (event.clientY - box.top) / box.height - .5 });
  }
  function change(direction: -1 | 1) { setAnswer(null); setClaimIndex((claimIndex + direction + claims.length) % claims.length); }

  return <div className="myths-premium">
    <section className="myths-premium-hero" onPointerMove={move}>
      <motion.div className="myths-hero-orbit" animate={{ x: pointer.x * 24, y: pointer.y * 18 }}><i /><i /><span><ScanSearch /></span></motion.div>
      <div className="myths-hero-copy">
        <p className="premium-kicker"><span /> Evidence desk · Live</p>
        <h1>Claims enter.<br /><em>Context takes over.</em></h1>
        <p>Not a wall of fact cards. A working verification desk for slowing down confident claims, checking their boundaries and printing the fuller story.</p>
        <a href="#claim-lab">Open the live desk <ArrowDown /></a>
      </div>
      <motion.div className="myths-floating-dossier" initial={{ opacity: 0, rotate: 8, y: 30 }} animate={{ opacity: 1, rotate: 2, y: 0 }}>
        <header><span>CASE / 001</span><small>UNDER REVIEW</small></header><strong>“Paper is always sustainable.”</strong><div><Stamp /> Verdict held until source, method and recovery route are checked.</div>
      </motion.div>
      <div className="myths-hero-metrics"><span><b>03</b> possible verdicts</span><span><b>04</b> evidence checks</span><span><b>00</b> guilt-based answers</span></div>
    </section>

    <section id="claim-lab" className="claim-lab-premium">
      <div className="claim-lab-heading"><div><p className="premium-kicker">Interactive claim press</p><h2>What would<br />you print?</h2></div><p>Choose a verdict. The desk will compare it with the evidence and repair the sentence when context is missing.</p></div>
      <div className="claim-workbench">
        <aside><span>Case queue</span>{claims.map((item, index) => <button key={item.claim} onClick={() => { setClaimIndex(index); setAnswer(null); }} className={index === claimIndex ? "is-active" : ""}><i>{String(index + 1).padStart(2, "0")}</i><b>{item.short}</b></button>)}</aside>
        <div className="claim-paper-stage">
          <AnimatePresence mode="wait"><motion.article key={claimIndex} initial={{ opacity: 0, y: 24, rotate: 1 }} animate={{ opacity: 1, y: 0, rotate: -.5 }} exit={{ opacity: 0, y: -18 }}>
            <header><span>CLAIM {String(claimIndex + 1).padStart(2, "0")}</span><small>Tap one verdict</small></header>
            <blockquote>{claim.claim}</blockquote>
            <div className="claim-verdict-buttons">{(["myth", "fact", "context"] as Verdict[]).map(verdict => <button key={verdict} onClick={() => setAnswer(verdict)} className={answer === verdict ? "is-selected" : ""}><Stamp />{verdict === "context" ? "Needs context" : verdict}</button>)}</div>
            <AnimatePresence>{answer && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className={`claim-lab-result ${answer === claim.verdict ? "is-right" : "is-repair"}`}><span>{answer === claim.verdict ? <Check /> : <X />}{answer === claim.verdict ? "Defensible verdict" : `Better verdict: ${claim.verdict}`}</span><p>{claim.explanation}</p><small>Evidence route · {claim.source}</small></motion.div>}</AnimatePresence>
          </motion.article></AnimatePresence>
          <div className="claim-stage-controls"><button onClick={() => change(-1)} aria-label="Previous claim"><ChevronLeft /></button><span>{claimIndex + 1} / {claims.length}</span><button onClick={() => change(1)} aria-label="Next claim"><ChevronRight /></button></div>
        </div>
      </div>
    </section>

    <section className="myth-library-premium">
      <header><div><p className="premium-kicker">Searchable case library</p><h2>Find the claim<br />before sharing it.</h2></div><p>Search by subject, wording or verdict. Each case keeps the correction close to the claim.</p></header>
      <label className="myth-search-desk"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search forests, recycling, digital, design..." /><span>{String(filteredLibrary.length).padStart(2, "0")} cases</span></label>
      <div className="myth-case-rail">{filteredLibrary.map((item, index) => <motion.article layout whileHover={{ y: -10, rotate: index % 2 ? .7 : -.7 }} key={item.text} className={`case-tone-${index % 5 + 1}`}><span>{String(index + 1).padStart(2, "0")} / {item.category}</span><strong>{item.text}</strong><p>{item.note}</p><div><small>Verdict</small><b>{item.verdict}</b></div></motion.article>)}</div>
      {filteredLibrary.length === 0 && <div className="myth-search-empty"><ScanSearch /><strong>No matching case yet.</strong><p>Try a broader word or submit the claim to the foundation.</p></div>}
    </section>

    <section className="myth-method-premium">
      <div><p className="premium-kicker">Before you share</p><h2>A fast four-part<br />credibility scan.</h2><p>Good verification is a repeatable habit, not an instinct.</p></div>
      <div className="credibility-stack">{["Who made the claim?", "What boundaries were used?", "Can the method be inspected?", "Does local context change it?"].map((item, index) => <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .09 }} key={item}><span>{index + 1}</span><strong>{item}</strong><Check /></motion.div>)}</div>
    </section>

    <section className="myth-premium-cta"><Sparkles /><p>Ready for the game version?</p><h2>Put claims through<br />The Truth Press.</h2><Link href="/discover/truth-press">Play the verification game <ArrowRight /></Link><a href="https://www.fao.org/sustainable-forest-management/toolbox/modules/management-of-planted-forests/further-learning/en/" target="_blank" rel="noreferrer">Inspect a primary source <ExternalLink /></a></section>
  </div>;
}
