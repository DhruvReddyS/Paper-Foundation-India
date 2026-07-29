"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, CheckCircle2, ExternalLink, Recycle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { journeySteps } from "./journeyData";
import styles from "./JourneySaga.module.css";

export default function JourneySaga() {
  const [active, setActive] = useState(1);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-journey-step]"));
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(Number((visible.target as HTMLElement).dataset.journeyStep));
    }, { threshold: [.35, .55, .75] });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function goTo(id: number) {
    document.getElementById(`journey-step-${id}`)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  }

  return <main className={styles.journey}>
    <nav className={styles.rail} aria-label="Paper journey steps">
      {journeySteps.map(step => <button key={step.id} onClick={() => goTo(step.id)} className={active === step.id ? styles.active : ""} aria-label={`Go to step ${step.id}: ${step.title}`}><span>{String(step.id).padStart(2, "0")}</span><i /></button>)}
    </nav>

    {journeySteps.map((step, index) => (
      <section
        id={`journey-step-${step.id}`}
        data-journey-step={step.id}
        className={styles.page}
        style={{ "--step-tone": step.tone } as CSSProperties}
        key={step.id}
      >
        <motion.article
          className={styles.copy}
          initial={reducedMotion ? false : { opacity: 0, y: 35 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ amount: .45, once: true }}
          transition={{ duration: .7, ease: [0.22, 1, 0.36, 1] }}
        >
          <header><span>{String(step.id).padStart(2, "0")}</span><p>{step.phase} / {step.process}</p></header>
          <h1>{step.title}</h1>
          <div className={styles.body}>{step.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
          <aside><CheckCircle2 /><p>{step.insight}</p></aside>
          <footer>
            {index < journeySteps.length - 1 ? <button onClick={() => goTo(step.id + 1)}>Continue to step {String(step.id + 1).padStart(2, "0")} <ArrowDown /></button> : <Link href="/circularity">Keep the fibre in motion <ArrowRight /></Link>}
          </footer>
        </motion.article>

        <motion.figure
          className={styles.image}
          initial={reducedMotion ? false : { opacity: 0, scale: 1.04 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ amount: .3, once: true }}
          transition={{ duration: 1 }}
        >
          <Image src={step.image} alt={step.alt} fill sizes="(max-width: 800px) 100vw, 58vw" priority={step.id <= 2} />
          <figcaption><span>PROCESS IMAGE / {String(step.id).padStart(2, "0")}</span><p>{step.process}</p></figcaption>
        </motion.figure>
      </section>
    ))}

    <section className={styles.sources}>
      <div><Recycle /><span>One sheet. Twelve controlled decisions.</span></div>
      <p>This journey shows a representative combined route. Actual mill sequences and fibre recipes vary by grade, raw material, equipment and quality target.</p>
      <a href="https://www.cseindia.org/improving-wastepaper-circularity-for-the-pulp-and-paper-sector-12004" target="_blank" rel="noreferrer">Read the CSE circularity study <ExternalLink /></a>
    </section>
  </main>;
}
