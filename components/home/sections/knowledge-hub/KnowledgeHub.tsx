"use client";

import { ArrowRight, BookMarked, Clock, Factory, Library, Recycle, Sparkles, Trees } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./KnowledgeHub.module.css";

const reads = [
  { no: "FEATURE / 01", type: "Forestry", time: "8 min read", title: "How fibre sourcing shapes the paper story", deck: "Follow the sheet backwards—from the label to land, management and the decisions that create the outcome.", href: "/knowledge/sustainable-forestry-makes-paper-renewable", Icon: Trees, image: "/images/knowledge/fibre-sourcing.jpg", tone: "forest" },
  { no: "FIELD NOTE / 02", type: "Recovery", time: "6 min read", title: "What a recovery rate leaves out", deck: "Collection is only the beginning. Yield, contamination and final use complete the number.", href: "/knowledge/after-the-paper-bin", Icon: Recycle, image: "/images/knowledge/recovery-floor.jpg", tone: "copper" },
  { no: "MILL NOTE / 03", type: "Production", time: "7 min read", title: "Inside the decisions that form a sheet", deck: "Fibre preparation, water removal and energy choices all change performance.", href: "/knowledge/science-behind-paper-recycling", Icon: Factory, image: "/images/knowledge/forming-sheet.jpg", tone: "sage" },
] as const;

export default function KnowledgeHub() {
  return <section className={styles.section} aria-labelledby="knowledge-home-title">
    <header className={styles.heading} data-reveal>
      <div><p>Knowledge Hub · editorial desk</p><h2 id="knowledge-home-title">Read past the <span>headline.</span></h2></div>
      <div><p>Investigations, explainers and source material for readers who want the method—not just the answer.</p><Link href="/knowledge">Browse every article <ArrowRight /></Link></div>
    </header>

    <div className={styles.bento} data-reveal="left">
      {reads.map(({ no, type, time, title, deck, href, Icon, image, tone }, index) => <Link className={`${styles.article} ${styles[tone]} ${index === 0 ? styles.lead : ""}`} href={href} key={title}>
        <header><span>{no}</span><small><Clock /> {time}</small></header>
        <div className={styles.art}><Image src={image} alt="" fill sizes={index === 0 ? "(max-width: 900px) 100vw, 55vw" : "(max-width: 900px) 100vw, 28vw"} /><span /><Icon /><b>{type}</b></div>
        <div className={styles.articleCopy}><small>{type}</small><h3>{title}</h3><p>{deck}</p><span>Open article <ArrowRight /></span></div>
      </Link>)}
    </div>

    <div className={styles.shelf} data-reveal="right">
      <div className={styles.promptCard}><Sparkles /><div><small>Choose your own trail</small><strong><em>Start anywhere.</em></strong><span>Follow a question as far as your curiosity takes it.</span></div></div>
      <Link href="/glossary"><BookMarked /><div><small>Build your vocabulary</small><strong>Explore the glossary</strong><span>Plain-language paper terms →</span></div><ArrowRight /></Link>
      <Link href="/resources"><Library /><div><small>Reports, guides &amp; sources</small><strong>Browse resources</strong><span>Take the evidence with you →</span></div><ArrowRight /></Link>
    </div>
  </section>;
}
