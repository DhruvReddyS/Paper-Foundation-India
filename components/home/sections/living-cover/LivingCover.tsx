"use client";

import { ArrowDown, ArrowRight, BookOpen, Factory, Recycle, Trees, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import styles from "./LivingCover.module.css";

type Life = { number: string; label: string; title: string; note: string; icon: LucideIcon };

const lives: Life[] = [
  { number: "01", label: "Grown", title: "A fibre begins", note: "in a landscape shaped by people and choices", icon: Trees },
  { number: "02", label: "Made", title: "A purpose forms", note: "as fibre, water and engineering become a sheet", icon: Factory },
  { number: "03", label: "Used", title: "Value is carried", note: "through learning, protection, hygiene and exchange", icon: BookOpen },
  { number: "04", label: "Returned", title: "A next life opens", note: "when clean fibre finds its way back into the loop", icon: Recycle },
];

export default function LivingCover() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const life = lives[active];
  const Icon = life.icon;

  function moveArt(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    sectionRef.current?.style.setProperty("--x", `${((event.clientX - rect.left) / rect.width - .5) * 18}px`);
    sectionRef.current?.style.setProperty("--y", `${((event.clientY - rect.top) / rect.height - .5) * 14}px`);
  }

  return (
    <section ref={sectionRef} className={styles.hero} onPointerMove={moveArt} aria-labelledby="hero-title">
      <div className={styles.ink} aria-hidden="true" />
      <div className={styles.copy}>
        <h1 id="hero-title">Paper has more<br />{" "}than <em>one life.</em></h1>
        <p>A sheet is not a finish line. It can begin in a working landscape, carry an idea, protect what matters and return as fibre for something new.</p>
        <div className={styles.actions}>
          <a href="#understand-fairly">See the whole story <ArrowDown /></a>
          <Link href="/journey">Take the paper tour <ArrowRight /></Link>
        </div>
      </div>

      <div className={styles.art}>
        <div className={styles.halo} aria-hidden="true"><i /><i /><i /></div>
        <div className={styles.lifeSheet} key={life.label}>
          <header><span>Life {life.number}</span><small>{life.label}</small></header>
          <Icon aria-hidden="true" />
          <div><strong>{life.title}</strong><p>{life.note}</p></div>
          <i className={styles.corner} />
        </div>
        <div className={styles.ghostSheet} aria-hidden="true" />
        <div className={styles.fibreLines} aria-hidden="true"><i /><i /><i /><i /><i /></div>
      </div>

      <nav className={styles.lifeRail} aria-label="Explore the lives of one sheet">
        {lives.map((item, index) => (
          <button className={active === index ? styles.active : ""} onClick={() => setActive(index)} aria-pressed={active === index} key={item.label}>
            <span>{item.number}</span><strong>{item.label}</strong><i />
          </button>
        ))}
      </nav>
    </section>
  );
}
