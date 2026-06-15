"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";

export function MythOfTheDay() {
  const [flipped, setFlipped] = useState(false);

  return (
    <section id="myth-of-the-day" className="py-20 bg-paper-white">
      <div className="container-wide">
        <div className="text-center mb-8">
          <span className="font-mono text-xs text-copper uppercase tracking-widest">
            Myth of the day · Tap the case file
          </span>
        </div>

        <div
          className="max-w-2xl mx-auto cursor-pointer"
          onClick={() => setFlipped(!flipped)}
        >
          <motion.div
            className="relative h-80 rounded-2xl"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: "preserve-3d", perspective: 1000 }}
          >
            {/* Front — Myth */}
            <div
              className="absolute inset-0 rounded-2xl border-2 border-copper bg-gradient-to-br from-paper-warm to-kraft p-10 flex flex-col justify-between"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-copper uppercase tracking-wider bg-copper/10 px-3 py-1 rounded-full">
                  Forests
                </span>
                <span className="text-xs text-mid-grey">June 1, 2026</span>
              </div>
              <div>
                <p className="text-xs font-mono text-red-500 uppercase tracking-wider mb-3">
                  <X className="inline h-3.5 w-3.5" /> Common myth
                </p>
                <p className="font-serif text-2xl text-charcoal leading-snug">
                  &ldquo;Using paper causes deforestation in India.&rdquo;
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-mid-grey">Tap to reveal the fact →</span>
                <RotateCcw className="text-copper" />
              </div>
            </div>

            {/* Back — Fact */}
            <div
              className="absolute inset-0 rounded-2xl border-2 border-forest bg-forest text-white p-10 flex flex-col justify-between"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-green-300 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
                  Forests
                </span>
                <span className="text-xs text-white/60">June 1, 2026</span>
              </div>
              <div>
                <p className="text-xs font-mono text-green-300 uppercase tracking-wider mb-3">
                  <Check className="inline h-3.5 w-3.5" /> Context check
                </p>
                <p className="font-serif text-xl leading-snug mb-4">
                  Using paper does not automatically prove deforestation. The
                  outcome depends on fibre source, land-use change, forest
                  management and whether credible sourcing evidence is available.
                </p>
                <p className="text-sm text-white/60">
                  Read the cited sourcing and forestry evidence before sharing the claim.
                </p>
              </div>
              <span className="text-sm text-white/60">Tap to flip back →</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
