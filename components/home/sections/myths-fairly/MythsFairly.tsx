"use client";

import { ArrowRight, Check, Eye, Scale, Stamp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import styles from "./MythsFairly.module.css";

const claims = [
  { short: "Forests", claim: "Using paper always means losing forests.", verdict: "Missing context", truth: "Outcomes depend on fibre source, forest management, land use and demand. The material name alone cannot prove the forest outcome.", file: "FORESTRY / 01" },
  { short: "Recycling", claim: "Recycled fibre can keep circulating forever.", verdict: "Myth", truth: "Fibres shorten and some are lost in each cycle. Responsible fresh fibre replenishes a recovery system and helps maintain product strength.", file: "FIBRE / 02" },
  { short: "Packaging", claim: "Every paper package belongs in every recycling bin.", verdict: "Missing context", truth: "Construction, coatings, food contamination and local collection rules determine whether a package has a practical recovery route.", file: "RECOVERY / 03" },
] as const;

export default function MythsFairly() {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const item = claims[active];

  function choose(index: number) { setActive(index); setRevealed(false); }

  return (
    <section id="understand-fairly" className={styles.section} aria-labelledby="fair-title">
      <header className={styles.heading}>
        <div><p><Scale /> Myths vs facts</p><h2 id="fair-title">Paper needs to be<br /><em>understood fairly.</em></h2></div>
        <p>A fair answer does not defend paper blindly or condemn it automatically. It follows the evidence until the missing context becomes visible.</p>
      </header>

      <div className={styles.desk}>
        <nav aria-label="Select a paper claim">
          <span>Case files</span>
          {claims.map((claim,index) => <button className={active === index ? styles.active : ""} onClick={() => choose(index)} key={claim.short}><small>0{index+1}</small><strong>{claim.short}</strong><i /></button>)}
        </nav>
        <article className={revealed ? styles.revealed : ""}>
          <header><span>{item.file}</span><small>Public claim review</small></header>
          <div className={styles.claimFace}>
            <p>Claim under review</p><blockquote>“{item.claim}”</blockquote>
            <button onClick={() => setRevealed(true)} disabled={revealed}><Eye /> {revealed ? "Context revealed" : "Reveal the full picture"}</button>
          </div>
          <div className={styles.truthFace} aria-hidden={!revealed}>
            <span><Check /> Evidence verdict</span><strong>{item.verdict}</strong><p>{item.truth}</p>
          </div>
          <div className={styles.verdictStamp} aria-hidden="true"><Stamp /> {revealed ? item.verdict : "Unreviewed"}</div>
        </article>
      </div>
      <Link href="/myths">Enter the complete Myth &amp; Fact archive <ArrowRight /></Link>
    </section>
  );
}
