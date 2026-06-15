"use client";

import { motion } from "framer-motion";

export default function MissionVision() {
  return (
    <section className="about-editorial-hero">
      <div className="about-editorial-orbit" aria-hidden="true"><i /><i /><i /></div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="about-editorial-inner">
        <p className="home-micro-label">An editorial position · Paper Foundation India</p>
        <h1>Paper is not<br /><s>the enemy.</s> <em>It&apos;s a system.</em></h1>
        <p className="about-editorial-deck">One built from forests, fields, mills, hands, design decisions and the rare luxury of being recoverable.</p>
        <div className="about-mission-grid">
          <article><span>01 · Mission</span><h2>Make evidence usable.</h2><p>Translate research about paper, fibre and recovery into clear knowledge people can use without fear or greenwashing.</p></article>
          <article><span>02 · Vision</span><h2>Replace labels with literacy.</h2><p>Build a public culture that asks where a material came from, how it was used and whether it can enter another cycle.</p></article>
        </div>
      </motion.div>
    </section>
  );
}
