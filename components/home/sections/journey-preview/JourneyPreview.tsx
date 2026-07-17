"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Droplets, Factory, Layers3, Recycle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./JourneyPreview.module.css";

const chapters = [
  {
    no: "01",
    verb: "Source",
    note: "Fresh and recovered fibre begin through different, inspectable routes.",
    image: "/images/journey/spreads-v2/spread5.jpg",
    icon: Layers3,
  },
  {
    no: "02",
    verb: "Prepare",
    note: "Water, motion, screening and cleaning release useful fibre.",
    image: "/images/journey/spreads-v2/spread4.jpg",
    icon: Droplets,
  },
  {
    no: "03",
    verb: "Make",
    note: "A dilute furnish is formed, pressed, dried and converted.",
    image: "/images/journey/spreads-v2/spread6.jpg",
    icon: Factory,
  },
  {
    no: "04",
    verb: "Return",
    note: "Clean separation keeps suitable fibre moving toward another use.",
    image: "/images/journey/spreads-v2/spread3.jpg",
    icon: Recycle,
  },
] as const;

export default function JourneyPreview() {
  const reduced = useReducedMotion();

  return (
    <section className={styles.section} aria-labelledby="journey-home-title">
      <div className={styles.copy} data-reveal="left">
        <p>Paper Journey · process folio</p>
        <h2 id="journey-home-title">A sheet is not made in one moment.</h2>
        <span>
          Pull the process apart—source, prepare, make and return—then open the
          full field book for all thirteen evidence-led chapters.
        </span>
        <Link href="/journey">Enter the complete journey <ArrowRight /></Link>
      </div>

      <div className={styles.folio} data-reveal="right">
        <div className={styles.thread} aria-hidden="true"><i /><i /><i /><i /></div>
        {chapters.map((chapter, index) => {
          const Icon = chapter.icon;
          return (
            <motion.article
              key={chapter.no}
              className={styles.chapter}
              initial={reduced ? false : { opacity: 0, x: 60, rotate: index % 2 ? 1.5 : -1.5 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true, amount: .45 }}
              transition={{ delay: index * .08, duration: .62, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduced ? undefined : { x: -14 }}
            >
              <div className={styles.photo}>
                <Image src={chapter.image} alt="" fill sizes="(max-width: 760px) 35vw, 230px" />
              </div>
              <span>{chapter.no}</span>
              <Icon aria-hidden="true" />
              <div><strong>{chapter.verb}</strong><p>{chapter.note}</p></div>
              <ArrowRight aria-hidden="true" />
            </motion.article>
          );
        })}
        <Link href="/journey" className={styles.seal}>
          <span>13</span><small>chapters</small><strong>Open the field book</strong><ArrowRight />
        </Link>
      </div>
    </section>
  );
}
