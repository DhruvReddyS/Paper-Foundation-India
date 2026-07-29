"use client";

import { motion } from "framer-motion";
import { ArrowRight, Factory, MapPin, Recycle, Trees } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { indiaReferenceFibreMix, productionHubs } from "@/content/indiaAdvocacyData";
import styles from "./IndiaLedger.module.css";

export default function IndiaLedger() {
  const [active, setActive] = useState("GJ");
  const hub = productionHubs.find(item => item.id === active) ?? productionHubs[0];

  return <section className={styles.section} aria-labelledby="india-home-title">
    <header className={styles.heading}>
      <div><p><MapPin /> PAPER EVERYWHERE / INDIA</p><h2 id="india-home-title">A national fibre<br /><em>system in motion.</em></h2></div>
      <p>Move from the material mix to the states, mills, markets and recovery systems that keep paper useful across India.</p>
    </header>

    <div className={styles.experience}>
      <div className={styles.mapPanel}>
        <header><span>LIVE ATLAS PREVIEW</span><small>SELECT A HUB</small></header>
        <div className={styles.map}>
          <Image src="/images/maps/india-state-outline.png" alt="India map showing important paper manufacturing hubs" fill sizes="(max-width: 900px) 92vw, 680px" />
          {productionHubs.map(item => <button key={item.id} className={item.id === active ? styles.active : ""} style={{ left: `${item.x}%`, top: `${item.y}%` }} onClick={() => setActive(item.id)} aria-label={`Inspect ${item.state}`}><MapPin /><span>{item.id}</span></button>)}
        </div>
        <motion.article key={hub.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <span>{hub.id} / {hub.state}</span><strong>{hub.title}</strong><p>{hub.detail}</p>
        </motion.article>
      </div>

      <aside className={styles.story}>
        <div className={styles.bigFact}><span>REFERENCE MIX</span><strong>79%</strong><h3>comes from recovered fibre and agro residue routes.</h3><p>That is the starting point. The real story is how fibre moves, returns and supports the next useful product.</p></div>
        <div className={styles.routes}>{indiaReferenceFibreMix.map(item => <p key={item.label}><i style={{ background: item.color }} /><span>{item.short}</span><b>{item.share}%</b><em style={{ width: `${item.share}%`, background: item.color }} /></p>)}</div>
        <div className={styles.quickFacts}><article><Recycle /><strong>57%</strong><span>CSE estimated recovery rate</span></article><article><Factory /><strong>~550</strong><span>operational mills reported by DPIIT</span></article><article><Trees /><strong>1.2M+</strong><span>hectares under pulpwood plantations</span></article></div>
        <nav><Link href="/india-map">Explore India Fibre Atlas <ArrowRight /></Link><Link href="/india-snapshot">Open India Paper Ledger <ArrowRight /></Link></nav>
      </aside>
    </div>

    <footer className={styles.ticker}><span>RECOVERED FIBRE</span><i /><span>FARM FORESTRY</span><i /><span>AGRO RESIDUE</span><i /><span>PACKAGING</span><i /><span>RECOVERY</span></footer>
  </section>;
}
