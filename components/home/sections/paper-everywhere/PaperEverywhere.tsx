"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import styles from "./PaperEverywhere.module.css";

const moments = [
  { no: "01", title: "It carries what we learn.", label: "Education", copy: "Notes, maps, books and records turn information into something we can hold, revisit and share.", image: "/images/everyday/learning-in-paper.jpg", alt: "Student writing in a paper notebook beside books and a map" },
  { no: "02", title: "It protects what keeps us well.", label: "Healthcare", copy: "Cartons, prescriptions and leaflets help medicine travel with identity, instructions and protection.", image: "/images/everyday/health-in-paper.jpg", alt: "Pharmacist handing over medicine in paper packaging" },
  { no: "03", title: "It helps livelihoods move.", label: "Enterprise", copy: "From a maker's table to a doorstep, corrugated boxes and paper cushioning quietly connect commerce.", image: "/images/everyday/business-in-paper.jpg", alt: "Small business owner packing a product in corrugated paper" },
] as const;

export default function PaperEverywhere() {
  const root = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end end"] });
  const yOne = useTransform(scrollYProgress, [0, .42], ["0%", "-18%"]);
  const yTwo = useTransform(scrollYProgress, [.2, .68], ["25%", "-8%"]);
  const yThree = useTransform(scrollYProgress, [.48, 1], ["30%", "-4%"]);
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return <section ref={root} className={styles.section} aria-labelledby="everywhere-title">
    <div className={styles.sticky}>
      <div className={styles.copy}>
        <p>Paper Everywhere · field notes</p>
        <h2 id="everywhere-title">Paper rarely asks for attention. <em>Look closer.</em></h2>
        <span>Scroll through three ordinary moments where paper carries knowledge, trust and livelihoods.</span>
        <Link href="/everyday-paper">See the everyday paper atlas <ArrowRight /></Link>
      </div>
      <div className={styles.gallery}>
        {moments.map((moment, index) => <motion.figure style={{ y: index === 0 ? yOne : index === 1 ? yTwo : yThree }} className={styles[`card${index + 1}`]} key={moment.title}>
          <Image src={moment.image} alt={moment.alt} fill sizes="(max-width: 760px) 84vw, 32vw" />
          <figcaption><span>{moment.no} / {moment.label}</span><strong>{moment.title}</strong><p>{moment.copy}</p></figcaption>
        </motion.figure>)}
      </div>
      <div className={styles.progress} aria-hidden="true"><motion.i style={{ height: progress }} /></div>
      <span className={styles.vertical}>THE MATERIAL HIDING IN PLAIN SIGHT</span>
    </div>
  </section>;
}
