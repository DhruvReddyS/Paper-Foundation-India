"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function SubmitMythCTA() {
  return (
    <section className="py-20 bg-dark-green text-white">
      <div className="container-narrow text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-4xl mb-4 block">💡</span>
          <h2 className="font-serif text-3xl font-bold mb-4">
            Heard a myth we haven&apos;t covered?
          </h2>
          <p className="text-paper-warm/70 max-w-md mx-auto mb-8">
            Submit a myth and our editorial team will research, verify, and add it
            to our database — with full source citations.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-copper text-white font-sans font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Submit a Myth →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
