"use client";

import { ArrowRight } from "lucide-react";
import { motion, type MotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { paperEverywhereObjects } from "@/content/paperEverywhere";
import styles from "./PaperEverywhere.module.css";

const homeSlugs = ["notebooks", "corrugated-boxes", "tissue-and-towels", "newsprint", "food-contact-paper", "one-rupee-note", "medicine-cartons"];
const moments = homeSlugs.map((slug) => {
  const item = paperEverywhereObjects.find((entry) => entry.slug === slug)!;
  return {
    no: item.number,
    title: item.thesis,
    label: item.category,
    copy: item.figureContext,
    image: item.image,
    alt: item.alt,
    note: `${item.figure} / ${item.source.organisation} / ${item.source.year}`,
  };
});

function MomentFrame({ moment, index, total, progress }: { moment: typeof moments[number]; index: number; total: number; progress: MotionValue<number> }) {
  const start = index / total;
  const end = (index + 1) / total;
  const enter = Math.min(1, start + .035);
  const leave = Math.max(0, end - .035);
  const opacity = useTransform(progress, index === 0 ? [0, leave, end] : index === total - 1 ? [start, enter, 1] : [start, enter, leave, end], index === 0 ? [1, 1, 0] : index === total - 1 ? [0, 1, 1] : [0, 1, 1, 0]);
  const x = useTransform(progress, [start, (start + end) / 2, end], [index % 2 ? "18%" : "-18%", "0%", index % 2 ? "-7%" : "7%"]);
  const y = useTransform(progress, [start, end], ["5%", "-5%"]);
  const scale = useTransform(progress, [start, (start + end) / 2, end], [.92, 1, 1.045]);
  const imageY = useTransform(progress, [start, end], ["-6%", "6%"]);

  return <motion.article className={styles.frame} style={{ opacity, x, y, scale }} aria-hidden="true">
    <div className={styles.photo}><motion.div style={{ y: imageY }}><Image src={moment.image} alt={moment.alt} fill sizes="(max-width: 780px) 100vw, 62vw" /></motion.div><i /></div>
    <div className={styles.caption}><span>{moment.no} / {moment.label}</span><h3>{moment.title}</h3><p>{moment.copy}</p></div>
    <aside><small>VERIFIED RECORD · {moment.no}</small><p>{moment.note}</p><i /></aside>
  </motion.article>;
}

export default function PaperEverywhere() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end end"] });
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  useMotionValueEvent(scrollYProgress, "change", (latest) => setActive(Math.min(moments.length - 1, Math.floor(latest * moments.length))));

  function goTo(index: number) {
    if (!root.current) return;
    const available = root.current.offsetHeight - window.innerHeight;
    window.scrollTo({ top: root.current.offsetTop + available * ((index + .12) / moments.length), behavior: "smooth" });
  }

  return <section ref={root} className={styles.section} aria-labelledby="everywhere-title">
    <div className={styles.sticky}>
      <div className={styles.copy}>
        <p>Paper Everywhere · seven evidence notes</p>
        <h2 id="everywhere-title">Look closer. <em>The object has a job.</em></h2>
        <span>Move through familiar scenes, then open the atlas to inspect the source, scope and material decision behind each one.</span>
        <div className={styles.counter}><strong>{moments[active].no}</strong><span>{moments[active].label}</span></div>
        <Link href="/everyday-paper">Open the complete paper atlas <ArrowRight /></Link>
      </div>

      <div className={styles.stage}>
        {moments.map((moment, index) => <MomentFrame moment={moment} index={index} total={moments.length} progress={scrollYProgress} key={moment.title} />)}
        <span className={styles.stageMark} aria-hidden="true">SCROLL / OBSERVE / CONNECT</span>
      </div>

      <nav className={styles.index} aria-label="Paper Everywhere chapters">{moments.map((moment, index) => <button className={active === index ? styles.active : ""} onClick={() => goTo(index)} aria-label={`Go to ${moment.label}`} aria-current={active === index ? "step" : undefined} key={moment.no}><span>{moment.no}</span><i /></button>)}</nav>
      <div className={styles.progress} aria-hidden="true"><motion.i style={{ height: progress }} /></div>
    </div>
  </section>;
}
