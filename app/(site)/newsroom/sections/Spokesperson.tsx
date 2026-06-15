"use client";

import { motion } from "framer-motion";

export default function Spokesperson() {
  return (
    <section className="bg-paper-warm py-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-paper-white rounded-2xl p-8 md:p-10 border border-kraft/15 shadow-sm flex flex-col md:flex-row gap-8 items-center"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-forest to-sage flex items-center justify-center flex-shrink-0">
            <span className="text-paper-white font-bold text-2xl">PS</span>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold text-copper uppercase tracking-wider mb-1">
              Media Spokesperson
            </h3>
            <h2 className="text-2xl font-bold text-charcoal mb-2">Dr. Priya Sharma</h2>
            <p className="text-charcoal/60 mb-4">
              Editor-in-Chief, Paper Foundation India. Available for interviews,
              expert commentary, and panel discussions on paper sustainability.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <a
                href="mailto:press@paperfoundation.in"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest text-paper-white rounded-lg text-sm font-semibold hover:bg-dark-green transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                press@paperfoundation.in
              </a>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-sage/10 text-forest rounded-lg text-sm font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +91 98765 43210
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
