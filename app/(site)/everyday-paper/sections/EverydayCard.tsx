"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import styles from "./EverydayGrid.module.css";

interface EverydayCardProps {
  item: { title: string; image: string; front: string; back: string; category: string };
  index: number;
}

export default function EverydayCard({ item, index }: EverydayCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <motion.article
      className={`${styles.card} ${open ? styles.open : ""}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: .2 }}
      transition={{ delay: Math.min(index * .05, .25) }}
      whileHover={{ y: -8, rotate: index % 2 ? .25 : -.25 }}
    >
      <button type="button" onClick={() => setOpen(value => !value)} aria-expanded={open}>
        <div className={styles.image}><Image src={item.image} alt="" fill sizes="(max-width:640px) 100vw, (max-width:980px) 50vw, 33vw" /></div>
        <span>{String(index + 1).padStart(2, "0")} / {item.category}</span>
        <h3>{item.title}</h3>
        <p>{item.front}</p>
        <i>{open ? <X /> : <ArrowUpRight />}</i>
      </button>
      <AnimatePresence initial={false}>
        {open && <motion.div className={styles.reveal} initial={{ clipPath: "inset(100% 0 0)" }} animate={{ clipPath: "inset(0% 0 0)" }} exit={{ clipPath: "inset(100% 0 0)" }} transition={{ duration: .35, ease: [0.22, 1, 0.36, 1] }}><small>OBJECT NOTE</small><p>{item.back}</p></motion.div>}
      </AnimatePresence>
    </motion.article>
  );
}
