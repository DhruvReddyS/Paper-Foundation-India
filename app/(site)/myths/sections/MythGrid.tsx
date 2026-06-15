"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface MythItem {
  id: number;
  myth: string;
  fact: string;
  category: string;
  source: string;
}

const mythsData: MythItem[] = [
  {
    id: 1,
    myth: "Paper production destroys forests",
    fact: "India's paper industry sources wood from managed plantations on non-forest degraded land, greening 1.5M+ hectares.",
    category: "Forests",
    source: "IPMA 2024",
  },
  {
    id: 2,
    myth: "Digital is always greener than paper",
    fact: "Data centres consume ~1% of global electricity. A single Google search uses 0.3 Wh. The comparison is nuanced.",
    category: "Digital vs Paper",
    source: "IEA 2023",
  },
  {
    id: 3,
    myth: "Paper bags are worse than plastic bags",
    fact: "Paper bags biodegrade in 2–6 weeks and are widely recyclable. Plastic bags persist for 500+ years.",
    category: "Environment",
    source: "CPCB India",
  },
  {
    id: 4,
    myth: "Recycled paper is lower quality",
    fact: "Modern de-inking and processing allows recycled paper to match virgin quality for most applications.",
    category: "Recycling",
    source: "IPMA Technical Reports",
  },
  {
    id: 5,
    myth: "Paper mills are massive water polluters",
    fact: "Water consumption has dropped 80% over two decades. Most mills now run closed-loop water treatment systems.",
    category: "Water",
    source: "CPPRI Studies",
  },
  {
    id: 6,
    myth: "India should go fully paperless to save trees",
    fact: "Paper demand actually incentivizes tree planting. Without it, 1.5M hectares of plantations may not exist.",
    category: "Forests",
    source: "FSI 2023",
  },
];

function MythFlipCard({ myth, fact, category, source }: MythItem) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative h-64 cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl bg-paper-warm border border-border p-6 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="self-start font-mono text-xs text-copper uppercase tracking-wider bg-copper/10 px-2 py-1 rounded-full">
            {category}
          </span>
          <div>
            <p className="text-xs font-mono text-red-500 uppercase tracking-wider mb-2">
              ✗ Myth
            </p>
            <p className="font-serif text-base text-charcoal leading-snug">
              &ldquo;{myth}&rdquo;
            </p>
          </div>
          <p className="text-xs text-mid-grey">Tap to see fact →</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl bg-forest text-white p-6 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="self-start font-mono text-xs text-green-300 uppercase tracking-wider bg-white/10 px-2 py-1 rounded-full">
            {category}
          </span>
          <div>
            <p className="text-xs font-mono text-green-300 uppercase tracking-wider mb-2">
              ✓ Fact
            </p>
            <p className="font-serif text-base leading-snug">{fact}</p>
          </div>
          <p className="text-xs text-white/50">Source: {source}</p>
        </div>
      </motion.div>
    </div>
  );
}

export function MythGrid() {
  return (
    <section className="py-16 bg-paper-white">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mythsData.map((myth) => (
            <MythFlipCard key={myth.id} {...myth} />
          ))}
        </div>
      </div>
    </section>
  );
}
