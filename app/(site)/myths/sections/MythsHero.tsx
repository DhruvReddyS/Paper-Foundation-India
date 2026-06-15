"use client";

import { motion } from "framer-motion";
import { ArrowDown, ScanSearch, Stamp } from "lucide-react";

export function MythsHero() {
  return <section className="myths-editorial-hero">
    <div className="myths-editorial-grid">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        <p className="home-micro-label">Myths · Facts · Missing context</p>
        <h1>Do not just<br />spot the claim.<br /><em>Interrogate it.</em></h1>
        <p>Paper conversations are full of confident one-line answers. This desk slows them down, checks the evidence and prints the fuller story.</p>
        <a href="#myth-of-the-day">Open today&apos;s case <ArrowDown /></a>
      </motion.div>
      <motion.div initial={{ opacity: 0, rotate: 4, scale: .94 }} animate={{ opacity: 1, rotate: -1, scale: 1 }} transition={{ delay: .14 }} className="myths-case-file">
        <header><span><ScanSearch /> Case file 001</span><small>PUBLIC / OPEN</small></header>
        <div><small>Claim awaiting context</small><strong>“Paper is always the enemy of forests.”</strong><span><Stamp /> Verdict cannot be printed without checking the source.</span></div>
        <footer><i /> Source <i /> Method <i /> Local system</footer>
      </motion.div>
    </div>
  </section>;
}
