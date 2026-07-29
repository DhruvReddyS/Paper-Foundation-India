"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Factory, MapPin, Paperclip, Recycle, Stamp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./IndiaLedger.module.css";

const regions = [
  { id: "north", label: "North", stat: "23%", title: "Writing and print corridor", copy: "Education, publishing and converting demand connect large markets with mills across the northern belt.", x: "43%", y: "25%" },
  { id: "west", label: "West", stat: "33%", title: "Packaging and trade network", copy: "Dense manufacturing and distribution networks make recovered fibre and packaging especially visible here.", x: "30%", y: "49%" },
  { id: "east", label: "East", stat: "12%", title: "Fibre and mill landscape", copy: "Forest resources, bamboo histories and industrial centres shape a distinct eastern paper story.", x: "68%", y: "45%" },
  { id: "south", label: "South", stat: "26%", title: "Integrated fibre systems", copy: "Farm forestry, recovered paper and efficient mill networks meet strong regional demand across the south.", x: "47%", y: "72%" },
] as const;

export default function IndiaLedger() {
  const [active, setActive] = useState(0);
  const region = regions[active];
  return <section className={styles.section} aria-labelledby="india-preview-title">
    <header className={styles.heading}>
      <div><p><Stamp /> National material file / 04</p><h2 id="india-preview-title">Paper across <em>India.</em></h2></div>
      <div><span>Pin a region to follow how fibre, mills, markets and recovery connect across the country.</span><nav><Link href="/india-map">Open the state atlas <ArrowRight /></Link><Link href="/india-snapshot">Read the data brief <ArrowRight /></Link></nav></div>
    </header>

    <div className={styles.desk}>
      <div className={styles.folderTab}>INDIA / FIBRE / OPEN FILE</div>
      <svg className={styles.thread} viewBox="0 0 1200 700" preserveAspectRatio="none" aria-hidden="true"><path d="M185 180 C300 110 360 250 525 236 S760 115 908 188" /><path d="M165 500 C330 570 450 405 635 460 S870 520 1010 430" /></svg>

      <aside className={styles.factStack}>
        <motion.article whileHover={{ rotate: -2, y: -7 }}><Paperclip /><small>RECOVERY NOTE</small><strong>75%</strong><p>recycled fibre share in production</p><i /></motion.article>
        <motion.article whileHover={{ rotate: 2, y: -7 }}><Factory /><small>MILL REGISTER</small><strong>750</strong><p>mills reported across the country</p><i /></motion.article>
      </aside>

      <div className={styles.mapSheet}>
        <header><span>FIG. 01 / REGIONAL ACTIVITY</span><small>SELECT A PIN</small></header>
        <div className={styles.map}>
          <Image src="/images/maps/india-state-outline.png" alt="State outline map of India with selectable regional evidence pins" fill sizes="(max-width: 900px) 90vw, 660px" />
          {regions.map((item, index) => <button type="button" key={item.id} style={{ left: item.x, top: item.y }} className={active === index ? styles.activePin : ""} onClick={() => setActive(index)} aria-label={`Inspect ${item.label}`}><MapPin /><span>{item.label}</span></button>)}
        </div>
        <footer><span>20.5937° N / 78.9629° E</span><strong>FIBRE ROUTES ARE REGIONAL</strong></footer>
      </div>

      <AnimatePresence mode="wait">
        <motion.aside key={region.id} className={styles.regionCard} initial={{ opacity: 0, rotate: 5, y: 15 }} animate={{ opacity: 1, rotate: 2, y: 0 }} exit={{ opacity: 0, rotate: -3, y: -10 }}>
          <div className={styles.pin} />
          <header><span>REGION {String(active + 1).padStart(2, "0")}</span><strong>{region.stat}</strong></header>
          <small>{region.label}</small><h3>{region.title}</h3><p>{region.copy}</p>
          <footer>{regions.map((item, index) => <button key={item.id} className={active === index ? styles.activeStep : ""} onClick={() => setActive(index)}>{String(index + 1).padStart(2, "0")}</button>)}</footer>
        </motion.aside>
      </AnimatePresence>

      <div className={styles.legend}><Recycle /><span>Recovered fibre</span><i /><span>Mill activity</span><i /><span>Regional demand</span></div>
    </div>
  </section>;
}
