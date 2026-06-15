"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface EverydayCardProps {
  item: {
    title: string;
    emoji: string;
    front: string;
    back: string;
    category: string;
  };
  index: number;
}

export default function EverydayCard({ item, index }: EverydayCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="perspective-1000 cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative w-full h-56 preserve-3d"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl bg-white shadow-sm border border-sage/20 p-5 flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-4xl mb-3">{item.emoji}</span>
          <h3 className="font-semibold text-forest text-lg mb-1">{item.title}</h3>
          <p className="text-sm text-forest/60">{item.front}</p>
          <span className="mt-3 text-xs bg-sage/20 text-forest/60 px-2 py-0.5 rounded-full">
            {item.category}
          </span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl bg-forest text-paper-white p-5 flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-3xl mb-3">{item.emoji}</span>
          <p className="text-sm leading-relaxed">{item.back}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
