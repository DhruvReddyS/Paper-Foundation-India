"use client";

import { ArrowRight, Factory, MapPinned, Recycle, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./IndiaLedger.module.css";

const regionalActivity = [
  { label: "West", value: 33 },
  { label: "South", value: 26 },
  { label: "North", value: 23 },
  { label: "East", value: 12 },
  { label: "Central", value: 7 },
] as const;

export default function IndiaLedger() {
  return <section className={styles.section} aria-labelledby="india-preview-title">
    <div className={styles.copy} data-reveal="left">
      <p>Paper across India</p>
      <h2 id="india-preview-title">One country. <em>Many fibre stories.</em></h2>
      <span>The map is not just geography. It is a field transcript of growers, mills, users, collectors and the decisions that connect them.</span>
      <div><Link href="/india-map">Open the Fibre Map <ArrowRight /></Link><Link href="/india-snapshot">See facts &amp; numbers <ArrowRight /></Link></div>
      <aside><small>Field clipboard · 04</small><p>Read the national outline together with the fibre, use and mill indicators pinned beneath it.</p></aside>
    </div>

    <div className={styles.atlas} data-reveal="right">
      <span className={styles.clip} aria-hidden="true" />
      <header><span><MapPinned /> India fibre clipboard</span><small>National preview · methodology linked</small></header>
      <div className={styles.map}><Image src="/images/maps/india-state-outline.png" alt="State outline map of India" fill sizes="(max-width: 850px) 90vw, 620px" /></div>
      <div className={styles.insights}>
        <article className={styles.recoveryChart}><header><Recycle /><span>Fibre recovery</span><small>Production mix</small></header><div><figure><strong>75<sup>%</sup></strong></figure><p>of India&apos;s paper production uses recycled fibre—one of the strongest circular inputs in the material mix.</p></div></article>
        <article className={styles.useChart}><header><Users /><span>Paper use</span><small>Per person / year</small></header><div><strong>16 <small>kg</small></strong><div className={styles.useLine}><i /><b>India</b><span>Global reference</span></div><p>A compact per-capita footprint with room for essential education, hygiene and packaging needs.</p></div></article>
        <article className={styles.regionChart}><header><Factory /><span>Regional mill activity</span><small>Illustrative share</small></header><div className={styles.bars}>{regionalActivity.map(item => <div key={item.label}><i style={{ "--bar": `${item.value * 2.2}px` } as CSSProperties} /><strong>{item.value}%</strong><span>{item.label}</span></div>)}</div></article>
        <p className={styles.sourceNote}>Preview figures mirror the current India Snapshot content. Open the full data pages for methodology and source notes.</p>
      </div>
    </div>
  </section>;
}
