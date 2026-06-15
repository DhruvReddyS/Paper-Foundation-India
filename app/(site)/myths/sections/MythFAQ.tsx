"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Where does India's paper industry get its wood?",
    answer:
      "Over 80% of wood for India's paper industry comes from social and farm forestry plantations grown on degraded, non-forest land — not natural forests. These plantations have greened over 1.5 million hectares.",
  },
  {
    question: "Is paper packaging better than plastic?",
    answer:
      "Paper packaging biodegrades in weeks, is widely recyclable, and comes from a renewable resource. Plastic persists for centuries and is recycled at far lower rates globally.",
  },
  {
    question: "How many times can paper be recycled?",
    answer:
      "Paper fibres can be recycled 5–7 times before they become too short. After that, they biodegrade naturally, returning nutrients to the soil.",
  },
  {
    question: "How are myths selected and verified?",
    answer:
      "Our editorial team identifies common misconceptions from surveys, social media, and public discourse. Each myth is paired with a fact verified against peer-reviewed sources and official industry data.",
  },
];

export function MythFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-paper-warm">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <span className="font-mono text-xs text-copper uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="font-serif text-3xl font-bold text-charcoal mt-3">
            Common questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-paper-white rounded-xl border border-border overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-sans text-base font-medium text-charcoal pr-4">
                  {faq.question}
                </span>
                <span
                  className={`text-forest text-xl transition-transform ${
                    openIndex === i ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5">
                      <p className="text-sm text-mid-grey leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
