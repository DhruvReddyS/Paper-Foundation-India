"use client";

import { ArrowRight, Check, MoveHorizontal, Scale, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import styles from "./MythsFairly.module.css";

const claims = [
  { short: "Forests", myth: "Using paper always means losing forests.", fact: "The outcome depends on fibre origin, forest management, land use and demand—not the material name alone.", verdict: "Context required", file: "FORESTRY / 01" },
  { short: "Recycling", myth: "Recycled fibre can circulate forever.", fact: "Fibres shorten and some are lost in every cycle. Responsible fresh fibre keeps the recovery loop useful.", verdict: "Myth", file: "FIBRE / 02" },
  { short: "Packaging", myth: "Every paper pack belongs in every recycling bin.", fact: "Construction, coatings, contamination and local collection rules decide whether recovery is practical.", verdict: "Context required", file: "RECOVERY / 03" },
] as const;

export default function MythsFairly() {
  const [active, setActive] = useState(0);
  const [split, setSplit] = useState(52);
  const item = claims[active];

  return (
    <section id="understand-fairly" className={styles.section} aria-labelledby="fair-title">
      <div className={styles.newsTicker} aria-hidden="true"><span>COMPARE</span><p>Move past the headline · reveal the missing context · evidence before assumption</p><i>EDITION 02</i></div>
      <header className={styles.heading} data-reveal>
        <div><p><Scale /> Myth vs fact</p><h2 id="fair-title">A claim has two sides. <em>Slide into the evidence.</em></h2></div>
        <p>Drag the paper seam. The myth stays visible, but context changes what the statement can honestly mean.</p>
      </header>

      <div className={styles.compareDesk} data-reveal="right">
        <nav aria-label="Select a paper claim">
          {claims.map((claim, index) => <button className={active === index ? styles.active : ""} onClick={() => { setActive(index); setSplit(52); }} key={claim.short}><small>0{index + 1}</small><strong>{claim.short}</strong></button>)}
        </nav>
        <div className={styles.compareFrame}>
          <div className={styles.factLayer}>
            <header><span><Check /> Evidence file</span><small>{item.file}</small></header>
            <div><p>What the evidence adds</p><h3>{item.fact}</h3><strong>{item.verdict}</strong></div>
          </div>
          <div className={styles.mythLayer} style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
            <header><span><X /> Claim in circulation</span><small>{item.file}</small></header>
            <div><p>What people often hear</p><h3>“{item.myth}”</h3><strong>Myth</strong></div>
          </div>
          <div className={styles.seam} style={{ left: `${split}%` }} aria-hidden="true"><i><MoveHorizontal /></i></div>
          <label className={styles.range}><span>Reveal evidence</span><input aria-label="Reveal evidence by moving the comparison" type="range" min="12" max="88" value={split} onChange={(event) => setSplit(Number(event.target.value))} /></label>
        </div>
      </div>
      <Link href="/myths">Enter the complete Myth &amp; Fact archive <ArrowRight /></Link>
    </section>
  );
}
