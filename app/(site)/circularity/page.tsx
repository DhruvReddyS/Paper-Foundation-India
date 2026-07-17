"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import styles from "../paper-everywhere-pages.module.css";

const stages = [
  { title: "Source", image: "/images/journey/spreads-v2/spread5.jpg", heading: "Begin with traceable fibre.", copy: "Fresh fibre, recovered paper and suitable agricultural residues enter through different routes. Each route needs its own evidence and controls.", note: "SOURCE / TRACE / MATCH THE PURPOSE" },
  { title: "Make", image: "/images/journey/spreads-v2/spread4.jpg", heading: "Turn a fibre recipe into a sheet.", copy: "Pulping, screening, refining, forming, pressing and drying build the performance required for the next paper product.", note: "PREPARE / FORM / DRY" },
  { title: "Convert", image: "/images/journey/spreads-v2/spread6.jpg", heading: "Design the product for its real job.", copy: "Coatings, adhesives, print, folds and barriers can add function—but can also change the recovery route.", note: "DESIGN / PROTECT / COMMUNICATE" },
  { title: "Use", image: "/images/journey/spreads-v2/spread1.jpg", heading: "Keep the service life useful.", copy: "Use both sides when appropriate, protect reusable packaging and avoid contamination before the material reaches collection.", note: "USE / REUSE / KEEP CLEAN" },
  { title: "Collect", image: "/images/journey/spreads-v2/spread3.jpg", heading: "The next sheet starts at separation.", copy: "Dry paper sorted into the right stream is easier to grade, transport and prepare for another production cycle.", note: "SEPARATE / GRADE / MOVE" },
  { title: "Recover", image: "/images/journey/spreads-v2/spread2.jpg", heading: "Return suitable fibre to production.", copy: "Recovery is not automatic. Local collection, product design, contamination and fibre quality determine what can become paper again.", note: "REPULP / CLEAN / REMAKE" },
] as const;

export default function CircularityPage() {
  const [active, setActive] = useState(0);
  const stage = stages[active];

  return (
    <main className={styles.cycle}>
      <header className={styles.cycleHeader}>
        <div><p className={styles.cycleLabel}>Paper circularity / six connected decisions</p><h1>A loop you can inspect.</h1></div>
        <p>Circularity is not a symbol stamped at the end. Move through the six decisions that keep suitable fibre useful—and see where the loop can weaken.</p>
      </header>
      <section className={styles.cycleStage}>
        <nav className={styles.cycleNav} aria-label="Circular paper stages">
          {stages.map((item, index) => <button type="button" key={item.title} onClick={() => setActive(index)} className={active === index ? styles.active : ""}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong></button>)}
        </nav>
        <AnimatePresence mode="wait">
          <motion.article key={stage.title} className={styles.cycleCard} initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -22 }} transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }}>
            <div className={styles.cyclePhoto}><Image src={stage.image} alt="" fill sizes="(max-width:900px) 100vw, 55vw" priority={active === 0} /></div>
            <div className={styles.cycleCopy}><span>STAGE {String(active + 1).padStart(2, "0")} / {stage.title.toUpperCase()}</span><h2>{stage.heading}</h2><p>{stage.copy}</p><footer>{stage.note}</footer></div>
          </motion.article>
        </AnimatePresence>
      </section>
    </main>
  );
}
