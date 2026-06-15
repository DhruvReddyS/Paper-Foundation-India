"use client";

import { motion } from "framer-motion";
import { BookOpenCheck, Scale, SearchCheck, Sprout } from "lucide-react";

const principles = [
  { icon: SearchCheck, number: "01", title: "Evidence over assertion", description: "Important claims should lead to public research, data or a clearly named primary source." },
  { icon: Scale, number: "02", title: "Trade-offs over slogans", description: "We resist binary framings of complex material systems and say when context changes the answer." },
  { icon: BookOpenCheck, number: "03", title: "Method over conclusion", description: "How a number was produced matters as much as the number itself. Methods remain visible." },
  { icon: Sprout, number: "04", title: "Improvement over perfection", description: "Responsible sourcing, efficient use and recovery are practical habits, not purity tests." },
];

export default function WhatWeStandFor() {
  return <section className="about-principles">
    <div className="about-principles-head"><p className="home-micro-label">How we work</p><h2>Four promises behind<br />everything we publish.</h2></div>
    <div className="about-principles-grid">{principles.map((principle, index) => {
      const Icon = principle.icon;
      return <motion.article key={principle.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }}>
        <span>{principle.number}</span><Icon /><h3>{principle.title}</h3><p>{principle.description}</p>
      </motion.article>;
    })}</div>
  </section>;
}
