"use client";

import { motion } from "framer-motion";

const badges = [
  { label: "FSC Certified Sources", icon: "🌲" },
  { label: "75% Recycled Fibre", icon: "♻️" },
  { label: "Peer-Reviewed Data", icon: "📊" },
  { label: "Carbon Neutral Goals", icon: "🍃" },
  { label: "Rural Livelihood Impact", icon: "🏘️" },
];

export function TrustStrip() {
  return (
    <section className="py-12 bg-paper-white border-y border-border overflow-hidden">
      <div className="container-wide">
        <p className="text-center text-xs font-mono text-mid-grey uppercase tracking-widest mb-8">
          Trusted &amp; Verified
        </p>
      </div>
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[...badges, ...badges].map((badge, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-6 py-3 bg-paper-warm rounded-full border border-border"
          >
            <span className="text-2xl">{badge.icon}</span>
            <span className="font-sans text-sm font-medium text-charcoal">
              {badge.label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
