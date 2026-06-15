"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function AlphabetNav() {
  const [activeLetter, setActiveLetter] = useState("A");
  const availableLetters = ["A", "B", "C", "D", "E", "F", "G", "L", "M", "P", "R", "S", "W"];

  return (
    <section className="bg-paper-white sticky top-0 z-30 border-b border-kraft/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-wrap justify-center gap-1.5">
          {alphabet.map((letter) => {
            const isAvailable = availableLetters.includes(letter);
            const isActive = activeLetter === letter;

            return (
              <motion.button
                key={letter}
                whileTap={{ scale: 0.9 }}
                onClick={() => isAvailable && setActiveLetter(letter)}
                disabled={!isAvailable}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                  isActive
                    ? "bg-forest text-paper-white shadow-md"
                    : isAvailable
                    ? "bg-sage/10 text-forest hover:bg-sage/25"
                    : "bg-transparent text-charcoal/20 cursor-not-allowed"
                }`}
              >
                {letter}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
