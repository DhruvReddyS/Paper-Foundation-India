"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const stages = [
  {
    step: "01",
    title: "Source & Grow",
    description: "Sustainable plantations on degraded land provide raw fibre without touching natural forests.",
    icon: "🌱",
  },
  {
    step: "02",
    title: "Mill & Make",
    description: "Modern mills convert fibre into paper using clean energy and closed-loop water systems.",
    icon: "🏭",
  },
  {
    step: "03",
    title: "Use & Return",
    description: "Paper is used, collected, and recycled — closing the loop in one of the most circular supply chains.",
    icon: "♻️",
  },
];

export function JourneyTeaser() {
  return (
    <section className="py-24 bg-paper-warm">
      <div className="container-wide">
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-copper uppercase tracking-widest">
            The Paper Journey
          </span>
          <h2 className="font-serif text-4xl font-bold text-charcoal mt-3 mb-4">
            From seed to sheet — and back again
          </h2>
          <p className="text-mid-grey max-w-xl mx-auto">
            Follow the lifecycle of paper and discover why it&apos;s one of the
            most sustainable materials on earth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.step}
              className="bg-paper-white rounded-2xl p-8 border border-border text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <span className="text-4xl mb-4 block">{stage.icon}</span>
              <span className="font-mono text-xs text-copper uppercase tracking-wider">
                Step {stage.step}
              </span>
              <h3 className="font-serif text-xl font-bold text-charcoal mt-2 mb-3">
                {stage.title}
              </h3>
              <p className="text-sm text-mid-grey leading-relaxed">
                {stage.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/journey" className="btn-primary">
            Start the Full Journey →
          </Link>
        </div>
      </div>
    </section>
  );
}
