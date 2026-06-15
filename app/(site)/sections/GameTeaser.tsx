"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const question = {
  text: "How many times can a single paper fibre be recycled before it degrades?",
  options: ["1–2 times", "3–4 times", "5–7 times", "10+ times"],
  correct: 2,
  explanation:
    "Paper fibres can typically be recycled 5 to 7 times before they become too short for papermaking. After that, they biodegrade naturally.",
};

export function GameTeaser() {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  return (
    <section className="py-24 bg-paper-white">
      <div className="container-wide">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="font-mono text-xs text-copper uppercase tracking-widest">
              Quick Quiz
            </span>
            <h2 className="font-serif text-3xl font-bold text-charcoal mt-3">
              Test your paper knowledge
            </h2>
          </div>

          <div className="bg-paper-warm rounded-2xl border border-border p-8">
            <p className="font-serif text-xl text-charcoal mb-6 leading-snug">
              {question.text}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {question.options.map((option, i) => {
                const isCorrect = i === question.correct;
                const isSelected = i === selected;

                let classes =
                  "rounded-xl border-2 p-4 text-center font-sans text-sm font-medium transition-all cursor-pointer ";
                if (!answered) {
                  classes += "border-border hover:border-forest hover:bg-forest/5";
                } else if (isCorrect) {
                  classes += "border-forest bg-forest/10 text-forest";
                } else if (isSelected && !isCorrect) {
                  classes += "border-red-400 bg-red-50 text-red-600";
                } else {
                  classes += "border-border opacity-50";
                }

                return (
                  <motion.button
                    key={i}
                    className={classes}
                    onClick={() => !answered && setSelected(i)}
                    whileTap={!answered ? { scale: 0.97 } : {}}
                  >
                    {option}
                  </motion.button>
                );
              })}
            </div>

            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-forest/5 border border-forest/20 p-4"
              >
                <p className="text-sm text-charcoal leading-relaxed">
                  <strong className="text-forest">
                    {selected === question.correct ? "✓ Correct!" : "✗ Not quite."}
                  </strong>{" "}
                  {question.explanation}
                </p>
              </motion.div>
            )}
          </div>

          <div className="text-center mt-8">
            <Link href="/games" className="btn-secondary">
              Play More Quizzes →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
