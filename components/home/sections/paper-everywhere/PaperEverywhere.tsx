"use client";

import { ArrowRight } from "lucide-react";
import { motion, type MotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import styles from "./PaperEverywhere.module.css";

const moments = [
  { no: "01", title: "It carries what we learn.", label: "Education", copy: "Notes, maps and books turn information into something we can hold, revisit and share.", image: "/images/everyday/learning-in-paper.jpg", alt: "Student writing in a paper notebook beside books and a map", note: "The page keeps an idea available after the screen goes dark." },
  { no: "02", title: "It protects what keeps us well.", label: "Healthcare", copy: "Cartons, prescriptions and leaflets help medicine travel with identity, instructions and protection.", image: "/images/everyday/health-in-paper.jpg", alt: "Pharmacist handing over medicine in paper packaging", note: "Protection and information often travel in the same folded sheet." },
  { no: "03", title: "It helps livelihoods move.", label: "Enterprise", copy: "Corrugated boxes and paper cushioning connect a maker’s table to a doorstep.", image: "/images/everyday/business-in-paper.jpg", alt: "Small business owner packing a product in corrugated paper", note: "A box is infrastructure disguised as a simple object." },
  { no: "04", title: "It keeps a public record.", label: "News & civic life", copy: "Newsprint, receipts and public documents make information portable, inspectable and shareable.", image: "/images/everyday/newsprint-in-paper.jpg", alt: "Reader opening a newspaper at an Indian tea stall", note: "Paper lets a public conversation sit open on the table." },
  { no: "05", title: "It serves, wraps and separates.", label: "Food", copy: "Paperboard cartons, liners and sleeves help food businesses protect products and organise service.", image: "/images/everyday/food-in-paper.jpg", alt: "Bakery owner packing food in paperboard cartons", note: "The right grade is designed for the job—not chosen by appearance alone." },
  { no: "06", title: "It gives craft a surface.", label: "Print & culture", copy: "Prints, books, invitations and envelopes turn paper into memory, identity and skilled work.", image: "/images/everyday/craft-in-paper.jpg", alt: "Indian printmaker and bookbinder working with handmade paper", note: "Texture is not decoration here. It is part of how the work speaks." },
  { no: "07", title: "It quietly supports hygiene.", label: "Home & care", copy: "Tissue, towels and napkins solve short, practical tasks where absorbency and cleanliness matter.", image: "/images/everyday/hygiene-in-paper.jpg", alt: "Family using paper napkins in an everyday dining space", note: "Some paper lives are brief because the task itself is brief." },
] as const;

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
    <aside><small>FIELD TRANSCRIPT · {moment.no}</small><p>“{moment.note}”</p><i /></aside>
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
        <p>Paper Everywhere · seven field notes</p>
        <h2 id="everywhere-title">The material hiding <em>in plain sight.</em></h2>
        <span>Keep scrolling. Each ordinary scene reveals another job paper performs without asking for attention.</span>
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
