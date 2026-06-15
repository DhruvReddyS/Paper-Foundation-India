"use client";

import { motion } from "framer-motion";

export default function CorrectionsPolicy() {
  return (
    <section className="bg-paper-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-copper/5 rounded-2xl p-8 md:p-12 border border-copper/15"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🔄</span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-charcoal">
              Our Corrections Policy
            </h2>
          </div>

          <div className="space-y-4 text-charcoal/70 leading-relaxed">
            <p>
              We hold ourselves to the highest standards of accuracy. When we make a mistake — 
              and we know it will happen — we correct it promptly, transparently, and visibly.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-paper-white rounded-xl p-6 border border-kraft/15">
                <h4 className="font-bold text-charcoal mb-2">1. Identify</h4>
                <p className="text-sm">Errors are flagged by our team, readers, or external fact-checkers.</p>
              </div>
              <div className="bg-paper-white rounded-xl p-6 border border-kraft/15">
                <h4 className="font-bold text-charcoal mb-2">2. Verify</h4>
                <p className="text-sm">Our editorial team investigates and confirms the error within 48 hours.</p>
              </div>
              <div className="bg-paper-white rounded-xl p-6 border border-kraft/15">
                <h4 className="font-bold text-charcoal mb-2">3. Correct</h4>
                <p className="text-sm">We update the article with a visible correction note and publish on our corrections page.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
