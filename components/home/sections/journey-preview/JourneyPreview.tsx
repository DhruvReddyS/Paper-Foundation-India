"use client";

import { ArrowRight, Factory, PackageOpen, Recycle, Sprout, Store, Trees } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import styles from "./JourneyPreview.module.css";

const steps = [
  { label: "Grown", title: "A working landscape", copy: "Fibre begins in managed landscapes where decisions about species, soil, water and livelihoods matter.", icon: Trees },
  { label: "Made", title: "Fibre becomes a sheet", copy: "At the mill, preparation, energy, water and process choices shape the paper that leaves the machine.", icon: Factory },
  { label: "Designed", title: "Purpose takes form", copy: "A sheet becomes packaging, communication, hygiene, education or one of countless useful products.", icon: PackageOpen },
  { label: "Used", title: "Value lives with people", copy: "How long a product serves, and how thoughtfully it is used, are part of its material story.", icon: Store },
  { label: "Recovered", title: "The next life begins", copy: "Clean collection and capable systems can return used paper to the fibre loop.", icon: Recycle },
  { label: "Renewed", title: "The loop needs care", copy: "Recovered and responsibly sourced fresh fibre work together to keep useful paper circulating.", icon: Sprout },
] as const;

export default function JourneyPreview() {
  const [active, setActive] = useState(0);
  const step = steps[active];
  const Icon = step.icon;
  return (
    <section className={styles.section} aria-labelledby="journey-preview-title">
      <header><p>Follow the fibre</p><h2 id="journey-preview-title">Six moments.<br /><em>One connected journey.</em></h2><Link href="/journey">Open the full Paper Journey <ArrowRight /></Link></header>
      <div className={styles.book}>
        <nav aria-label="Paper journey stages">
          {steps.map((item, index) => <button className={active === index ? styles.active : ""} onClick={() => setActive(index)} aria-current={active === index ? "step" : undefined} key={item.label}><span>0{index + 1}</span><b>{item.label}</b></button>)}
        </nav>
        <article key={step.label}>
          <div className={styles.pageNumber}>0{active + 1}</div>
          <Icon aria-hidden="true" /><small>{step.label}</small><h3>{step.title}</h3><p>{step.copy}</p>
          <div className={styles.pageLines} aria-hidden="true"><i /><i /><i /></div>
        </article>
      </div>
    </section>
  );
}
