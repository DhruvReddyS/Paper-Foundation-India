"use client";

import { ArrowRight, Check, ChevronLeft, ChevronRight, Scale, X } from "lucide-react";
import Link from "next/link";
import { useState, type PointerEvent } from "react";
import styles from "./MythsFairly.module.css";

const claims = [
  { short: "Forests", myth: "Using paper always means losing forests.", fact: "The outcome depends on fibre origin, forest management, land use and demand—not the material name alone.", verdict: "Context required", file: "FORESTRY / 01", source: "Ask where the fibre came from and how that landscape is managed." },
  { short: "Recycling", myth: "Recycled fibre can circulate forever.", fact: "Fibres shorten and some are lost in every cycle. Responsible fresh fibre keeps the recovery loop useful.", verdict: "Myth", file: "FIBRE / 02", source: "Recovery needs both good collection and fibres strong enough for the next product." },
  { short: "Packaging", myth: "Every paper pack belongs in every recycling bin.", fact: "Construction, coatings, contamination and local collection rules decide whether recovery is practical.", verdict: "Context required", file: "RECOVERY / 03", source: "Check the pack design and the rules where the pack is actually discarded." },
] as const;

export default function MythsFairly() {
  const [active, setActive] = useState(0);
  const [tested, setTested] = useState(false);
  const go = (index: number) => { setActive(index); setTested(false); };
  const previous = () => go((active - 1 + claims.length) % claims.length);
  const next = () => go((active + 1) % claims.length);
  function tilt(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--reader-x", `${((event.clientX - rect.left) / rect.width - .5) * 5}deg`);
    event.currentTarget.style.setProperty("--reader-y", `${((event.clientY - rect.top) / rect.height - .5) * -3}deg`);
  }

  return <section id="understand-fairly" className={styles.section} aria-labelledby="fair-title">
    <div className={styles.newsTicker} aria-hidden="true"><span>CASE FILES</span><p>Move past the headline · reveal the missing context · evidence before assumption</p><i>EDITION 02</i></div>
    <header className={styles.heading} data-reveal>
      <div><p><Scale /> Myth vs fact</p><h2 id="fair-title">Turn the whole page. <em><span>Read</span> both sides.</em></h2></div>
      <p>No hidden half-sentences. Each claim now opens as a complete two-page evidence spread.</p>
    </header>

    <div className={`${styles.reader} ${tested ? styles.tested : ""}`} data-reveal="right" onPointerMove={tilt} onPointerLeave={(event) => { event.currentTarget.style.setProperty("--reader-x", "0deg"); event.currentTarget.style.setProperty("--reader-y", "0deg"); }}>
      <div className={styles.paperBits} aria-hidden="true"><i/><i/><i/><i/><i/></div>
      <div className={styles.track} style={{ transform: `translateX(-${active * 100}%)` }}>
        {claims.map((item, index) => <article className={styles.caseSlide} aria-hidden={active !== index} key={item.short}>
          <header><span>{item.file}</span><small>Public claim review · {String(index + 1).padStart(2, "0")}/{claims.length}</small></header>
          <div className={styles.spread}>
            <section className={styles.mythPage}>
              <p><X /> Claim in circulation</p>
              <blockquote>“{item.myth}”</blockquote>
              <strong>MYTH</strong>
              <i aria-hidden="true">RECEIVED / UNCHECKED</i>
              <button onClick={() => setTested(!tested)} tabIndex={active === index ? 0 : -1}><Scale /> {tested ? "Reset the claim" : "Put this claim under pressure"}</button>
            </section>
            <section className={styles.factPage}>
              <p><Check /> What the evidence adds</p>
              <h3>{item.fact}</h3>
              <strong>{item.verdict}</strong>
              <aside><small>Reader’s next question</small><span>{item.source}</span></aside>
              <b className={styles.evidenceSeal} aria-hidden="true">EVIDENCE<br/>CHECKED</b>
            </section>
          </div>
        </article>)}
      </div>
      <div className={styles.controls}>
        <button onClick={previous} aria-label="Previous myth"><ChevronLeft /></button>
        <p className={styles.caseCounter}><span>Use the arrows</span><strong>Inspect another claim</strong></p>
        <button onClick={next} aria-label="Next myth"><ChevronRight /></button>
      </div>
    </div>
    <Link href="/myths">Enter the complete Myth &amp; Fact archive <ArrowRight /></Link>
  </section>;
}
