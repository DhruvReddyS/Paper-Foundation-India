"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

interface MythCard {
  myth: string;
  fact: string;
  category: string;
}

const myths: MythCard[] = [
  {
    myth: "Paper production destroys forests",
    fact: "India's paper industry plants 6 trees for every 1 harvested through managed plantations on non-forest wasteland.",
    category: "Forests",
  },
  {
    myth: "Digital is always greener than paper",
    fact: "A single email with an attachment generates 50g of CO₂. The comparison isn't as clear-cut as you think.",
    category: "Digital vs Paper",
  },
  {
    myth: "Paper bags are worse than plastic",
    fact: "Paper bags biodegrade in 2–6 weeks. Plastic bags persist for 500+ years in landfills and oceans.",
    category: "Environment",
  },
];

function FlipCard({ myth, fact, category }: MythCard) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative h-72 cursor-pointer perspective-1000"
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front — Myth */}
        <div
          className="absolute inset-0 rounded-2xl bg-paper-warm border border-border p-8 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="inline-block self-start font-mono text-xs text-copper uppercase tracking-wider bg-copper/10 px-3 py-1 rounded-full">
            {category}
          </span>
          <div>
            <p className="text-xs font-mono text-red-500 uppercase tracking-wider mb-2">
              ✗ Myth
            </p>
            <p className="font-serif text-lg text-charcoal leading-snug">
              &ldquo;{myth}&rdquo;
            </p>
          </div>
          <p className="text-xs text-mid-grey font-sans">Tap to reveal fact →</p>
        </div>

        {/* Back — Fact */}
        <div
          className="absolute inset-0 rounded-2xl bg-forest text-white p-8 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="inline-block self-start font-mono text-xs text-copper uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
            {category}
          </span>
          <div>
            <p className="text-xs font-mono text-green-300 uppercase tracking-wider mb-2">
              ✓ Fact
            </p>
            <p className="font-serif text-lg leading-snug">{fact}</p>
          </div>
          <p className="text-xs text-white/60 font-sans">Tap to flip back →</p>
        </div>
      </motion.div>
    </div>
  );
}

export function MythTeaser() {
  return (
    <section className="py-24 bg-paper-white">
      <div className="container-wide">
        <div className="text-center mb-14">
          <span className="font-mono text-xs text-copper uppercase tracking-widest">
            Myths vs Facts
          </span>
          <h2 className="font-serif text-4xl font-bold text-charcoal mt-3 mb-4">
            What you&apos;ve heard is wrong
          </h2>
          <p className="text-mid-grey max-w-xl mx-auto">
            Tap a card to reveal the truth behind common misconceptions about paper.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {myths.map((m, i) => (
            <FlipCard key={i} {...m} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/myths" className="btn-secondary">
            See All 50+ Myths →
          </Link>
        </div>
      </div>
    </section>
  );
}
