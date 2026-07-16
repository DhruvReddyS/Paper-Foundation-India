"use client";

import { ArrowDown, ArrowRight, BadgeCheck, BookOpen, Leaf } from "lucide-react";
import Link from "next/link";
import { useRef, type PointerEvent } from "react";
import styles from "./LivingCover.module.css";

const principles = [
  { icon: BadgeCheck, label: "Evidence before assumption" },
  { icon: BookOpen, label: "Context before conclusion" },
  { icon: Leaf, label: "Circularity beyond slogans" },
] as const;

export default function LivingCover() {
  const sectionRef = useRef<HTMLElement>(null);

  function moveSheet(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    sectionRef.current?.style.setProperty("--pointer-x", `${x * 22}px`);
    sectionRef.current?.style.setProperty("--pointer-y", `${y * 16}px`);
  }

  return (
    <section ref={sectionRef} className={styles.cover} onPointerMove={moveSheet} aria-labelledby="living-cover-title">
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.copy}>
        <p className={styles.issue}><span /> Paper Foundation India · Field edition 01</p>
        <h1 id="living-cover-title">Paper is more than<br /><em>what you throw away.</em></h1>
        <p className={styles.lead}>Follow one sheet through evidence, everyday life, industry and renewal—and see a familiar material with fresh context.</p>
        <div className={styles.actions}>
          <a href="#reconsidered">Follow the sheet <ArrowDown aria-hidden="true" /></a>
          <Link href="/knowledge">Explore the evidence <ArrowRight aria-hidden="true" /></Link>
        </div>
      </div>

      <div className={styles.paperStage} aria-hidden="true">
        <div className={styles.orbit}><i /><i /><i /></div>
        <div className={styles.sheet}>
          <span className={styles.sheetMark}>PFI</span>
          <strong>ONE<br />SHEET</strong>
          <small>many possible lives</small>
          <i className={styles.fold} />
        </div>
        <span className={`${styles.annotation} ${styles.annotationOne}`}>01 · fibre</span>
        <span className={`${styles.annotation} ${styles.annotationTwo}`}>02 · knowledge</span>
        <span className={`${styles.annotation} ${styles.annotationThree}`}>03 · renewal</span>
      </div>

      <div className={styles.principles}>
        {principles.map(({ icon: Icon, label }, index) => (
          <div key={label}>
            <span>0{index + 1}</span><Icon aria-hidden="true" /><p>{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
