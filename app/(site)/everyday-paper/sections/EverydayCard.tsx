"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BookOpenCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PaperEverywhereObject } from "@/content/paperEverywhere";
import styles from "./EverydayGrid.module.css";

export default function EverydayCard({ item, index }: { item: PaperEverywhereObject; index: number }) {
  return (
    <motion.article
      layout
      className={styles.card}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ delay: Math.min(index * 0.045, 0.22) }}
    >
      <Link href={`/everyday-paper/${item.slug}`} aria-label={`Open evidence file for ${item.title}`}>
        <div className={styles.image}>
          <Image src={item.image} alt={item.alt} fill sizes="(max-width:640px) 100vw, (max-width:980px) 50vw, 33vw" />
          <span>{item.number}</span>
        </div>
        <div className={styles.cardCopy}>
          <small>{item.category}</small>
          <h3>{item.title}</h3>
          <p>{item.thesis}</p>
          <div className={styles.figure}>
            <strong>{item.figure}</strong>
            <span>{item.figureLabel}</span>
          </div>
          <footer>
            <span><BookOpenCheck /> Evidence file</span>
            <ArrowUpRight />
          </footer>
        </div>
      </Link>
    </motion.article>
  );
}
