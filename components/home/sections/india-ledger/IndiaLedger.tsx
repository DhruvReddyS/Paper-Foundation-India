"use client";

import { ArrowRight, Factory, MapPinned, Recycle, Trees } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import styles from "./IndiaLedger.module.css";

const facts = [
  { id: "north", number: "01", label: "Working landscapes", title: "Fibre begins with place", copy: "India's paper story includes farm forestry, recovered paper and varied regional supply systems.", icon: Trees },
  { id: "west", number: "02", label: "Making networks", title: "Mills connect many hands", copy: "Paper production links growers, collectors, transporters, mills, converters and local businesses.", icon: Factory },
  { id: "south", number: "03", label: "Recovery loops", title: "A sheet can return", copy: "Collection quality and local infrastructure influence whether used paper becomes useful fibre again.", icon: Recycle },
  { id: "east", number: "04", label: "Regional context", title: "No single map tells all", copy: "Material flows differ across states, products and communities. Good evidence stays specific.", icon: MapPinned },
] as const;

export default function IndiaLedger() {
  const [active, setActive] = useState(0);
  const fact = facts[active];
  const Icon = fact.icon;
  return (
    <section className={styles.section} aria-labelledby="india-ledger-title">
      <header className={styles.heading}>
        <div><p>One sheet across India</p><h2 id="india-ledger-title">A material story shaped<br /><em>by place and people.</em></h2></div>
        <p>Select a field point to explore how fibre, making and recovery connect across the country.</p>
      </header>
      <div className={styles.explorer}>
        <div className={styles.map}>
          <span className={styles.mapWord} aria-hidden="true">INDIA</span>
          <div className={styles.contour} aria-hidden="true"><i /><i /><i /></div>
          {facts.map((item, index) => (
            <button className={`${styles.pin} ${styles[item.id]} ${active === index ? styles.active : ""}`} onClick={() => setActive(index)} aria-label={`Show ${item.label}`} aria-pressed={active === index} key={item.id}><span>{item.number}</span></button>
          ))}
          <p className={styles.mapCaption}>Interactive field ledger · not to geographic scale</p>
        </div>
        <article className={styles.factCard} key={fact.id}>
          <header><span>Field point {fact.number}</span><Icon aria-hidden="true" /></header>
          <small>{fact.label}</small><h3>{fact.title}</h3><p>{fact.copy}</p>
          <div>{facts.map((item, index) => <button aria-label={`Open field point ${item.number}`} className={active === index ? styles.activeDot : ""} onClick={() => setActive(index)} key={item.id} />)}</div>
          <Link href="/india-map">Open the India Fibre Map <ArrowRight aria-hidden="true" /></Link>
        </article>
      </div>
      <div className={styles.routes}><Link href="/india-map">Explore places <ArrowRight /></Link><Link href="/india-snapshot">Explore the numbers <ArrowRight /></Link></div>
    </section>
  );
}
