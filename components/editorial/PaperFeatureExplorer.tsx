"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BookOpen, Box, FileHeart, Newspaper, PackageCheck, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const features = [
  {
    label: "Learning",
    title: "A page can hold attention without asking for power.",
    copy: "Books, worksheets and notebooks create a stable physical position for ideas, annotation and return visits.",
    fact: "The right format depends on the reader, the task and the expected life of the information.",
    image: "/images/everyday/learning-in-paper.jpg",
    icon: BookOpen,
  },
  {
    label: "Protection",
    title: "Paper packaging is engineering, not decoration.",
    copy: "Flutes, folds and fibre direction work together to protect products while keeping the pack light.",
    fact: "Recyclability still depends on coatings, adhesives, contamination and the local recovery route.",
    image: "/images/everyday/business-in-paper.jpg",
    icon: PackageCheck,
  },
  {
    label: "Healthcare",
    title: "Protection and instructions travel together.",
    copy: "Cartons and folded leaflets keep medicine identifiable and carry safety information into the home.",
    fact: "Fit-for-purpose design matters: barrier performance and readable information are part of the material job.",
    image: "/images/everyday/health-in-paper.jpg",
    icon: FileHeart,
  },
  {
    label: "Public record",
    title: "Some information needs to stay open on the table.",
    copy: "Newsprint and public documents make a shared record portable, inspectable and easy to pass between people.",
    fact: "Print and digital both have physical systems; responsible communication starts with the real use case.",
    image: "/images/everyday/newsprint-in-paper.jpg",
    icon: Newspaper,
  },
  {
    label: "Food service",
    title: "One paper-looking pack can contain several materials.",
    copy: "Cartons, wraps and sleeves may use barriers or laminates to handle grease, moisture and temperature.",
    fact: "The paper label alone does not prove recyclability, compostability or plastic-free construction.",
    image: "/images/everyday/food-in-paper.jpg",
    icon: Box,
  },
] as const;

export default function PaperFeatureExplorer() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const current = features[active];

  return (
    <section className="paper-feature-explorer" aria-labelledby="feature-explorer-title">
      <header>
        <p>Paper Everywhere · feature desk</p>
        <h2 id="feature-explorer-title">Touch a paper role.<br /><em>See the system behind it.</em></h2>
      </header>
      <div className="paper-feature-stage">
        <nav aria-label="Everyday paper roles">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const selected = index === active;
            return (
              <motion.button
                layout
                type="button"
                key={feature.label}
                onClick={() => setActive(index)}
                className={selected ? "is-active" : ""}
                aria-expanded={selected}
              >
                <span><Icon /><b>{feature.label}</b><Plus /></span>
                <AnimatePresence initial={false}>{selected && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>{feature.copy}</motion.p>}</AnimatePresence>
              </motion.button>
            );
          })}
        </nav>
        <div className="paper-feature-visual">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.image}
              initial={reduced ? false : { opacity: 0, clipPath: "inset(0 0 100% 0)", scale: 1.06 }}
              animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)", scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, clipPath: "inset(100% 0 0 0)", scale: 1.03 }}
              transition={{ duration: reduced ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image src={current.image} alt="" fill sizes="(max-width: 900px) 100vw, 58vw" />
            </motion.div>
          </AnimatePresence>
          <motion.article key={current.title} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <span>FIELD FACT / {String(active + 1).padStart(2, "0")}</span>
            <strong>{current.title}</strong>
            <p>{current.fact}</p>
            <a href="#everyday-atlas">Inspect the everyday atlas <ArrowUpRight /></a>
          </motion.article>
          <i className="paper-feature-fibre" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
