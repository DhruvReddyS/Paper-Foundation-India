"use client";

import { ArrowDown, ArrowRight, BookOpen, Factory, Recycle, Trees, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import styles from "./LivingCover.module.css";

type Life = { number: string; label: string; title: string; note: string; icon: LucideIcon };
const lives: Life[] = [
  { number: "01", label: "Grown", title: "A fibre begins", note: "in a working landscape shaped by people and choices", icon: Trees },
  { number: "02", label: "Made", title: "A sheet takes form", note: "through fibre, water, engineering and careful recovery", icon: Factory },
  { number: "03", label: "Used", title: "An idea travels", note: "as paper teaches, protects, records and connects", icon: BookOpen },
  { number: "04", label: "Returned", title: "Another life opens", note: "when clean recovered fibre comes back into the loop", icon: Recycle },
];

const fieldNotes = [
  "Follow the fibre, not the assumption.",
  "A material is only as responsible as the system around it.",
  "The next life begins with a cleaner return.",
] as const;

export default function LivingCover() {
  const [active, setActive] = useState(0);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [newspaperOpen, setNewspaperOpen] = useState(false);
  const [note, setNote] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const life = lives[active];
  const Icon = life.icon;
  const nextLife = () => setActive((current) => (current + 1) % lives.length);

  function move(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    sectionRef.current?.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width - .5) * 18}px`);
    sectionRef.current?.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height - .5) * 13}px`);
  }

  return <section ref={sectionRef} className={styles.hero} onPointerMove={move} aria-labelledby="hero-title">
    <div className={styles.grain} aria-hidden="true" />
    <span className={styles.issue} aria-hidden="true">THE MATERIAL ISSUE · 001</span>
    <div className={styles.copy}>
      <p className={styles.kicker}><span /> A living material archive</p>
      <h1 id="hero-title"><span>Paper has more than</span> <em>one life.</em></h1>
      <p className={styles.deck}>One sheet can begin in a working landscape, carry an idea, protect what matters—and return as fibre for something new.</p>
      <div className={styles.actions}><a href="#understand-fairly">Unfold the story <ArrowDown /></a><Link href="/journey">Enter the paper journey <ArrowRight /></Link></div>
      <button className={styles.transcript} onClick={() => setNote((note + 1) % fieldNotes.length)} aria-label="Show the next field transcript"><small>Field transcript · 0{note + 1}</small><p>“{fieldNotes[note]}”</p><i /><b>Tap note · PFI</b></button>
    </div>

    <div className={styles.theatre} aria-label={`Current life: ${life.label}`}>
      <button className={styles.imageFrame} onClick={nextLife} aria-label="Advance to the next life of paper">
        <Image src="/images/hero/paper-craft-hero-v4.jpg" alt="An Indian papermaker lifting a newly formed sheet from a traditional paper vat" fill sizes="(max-width: 900px) 100vw, 58vw" priority />
        <span>CLICK THE MATERIAL / FOLLOW ITS NEXT LIFE</span>
      </button>
      <button className={`${styles.newspaper} ${newspaperOpen ? styles.newspaperOpen : ""}`} onClick={() => setNewspaperOpen(!newspaperOpen)} aria-expanded={newspaperOpen}><small>The Material Daily</small><strong>ONE SHEET.<br />MANY CHAPTERS.</strong><i /><i /><i /><p>Every chapter changes the question. Open the journey, then inspect the evidence.</p><b>{newspaperOpen ? "FOLD STORY" : "UNFOLD STORY"}</b></button>
      <button className={`${styles.envelope} ${envelopeOpen ? styles.envelopeOpen : ""}`} onClick={() => { setEnvelopeOpen(!envelopeOpen); if (!envelopeOpen) nextLife(); }} aria-expanded={envelopeOpen} aria-label={envelopeOpen ? "Close the paper life letter" : "Open the next paper life letter"}><i /><span><small>LIFE {life.number}</small><strong>{life.title}</strong><b>{life.label} →</b></span><em>{envelopeOpen ? "CLOSE LETTER" : "OPEN THE NEXT LIFE"}</em></button>
      <button className={styles.lifeCard} key={life.label} onClick={nextLife} aria-label="Show the next life of paper">
        <header><span>Life {life.number}</span><small>{life.label}</small></header>
        <Icon />
        <div><strong>{life.title}</strong><p>{life.note}</p></div>
        <b>NEXT LIFE ↗</b>
      </button>
      <div className={styles.paperClip} aria-hidden="true" />
      <div className={styles.orbit} aria-hidden="true"><i /><i /></div>
      <div className={styles.fibreTrail} aria-hidden="true"><i/><i/><i/><i/><i/><i/></div>
      <p className={styles.playHint}>Touch the paper objects <span>↗</span></p>
    </div>

    <nav className={styles.rail} aria-label="Explore the lives of one sheet">{lives.map((item, index) => <button className={active === index ? styles.active : ""} onClick={() => setActive(index)} aria-pressed={active === index} key={item.label}><span>{item.number}</span><strong>{item.label}</strong><small>{item.title}</small><i /></button>)}</nav>
  </section>;
}
