"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutContact() {
  return (
    <section className="bg-forest py-20 text-paper-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Get in Touch
          </h2>
          <p className="text-paper-warm/70 mb-8 max-w-lg mx-auto">
            Have a question, story tip, or want to collaborate? We&apos;d love to hear from you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-copper text-paper-white rounded-xl font-semibold hover:bg-copper/90 transition-colors shadow-lg"
            >
              Contact Us
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              href="/join"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-paper-white/30 text-paper-white rounded-xl font-semibold hover:bg-paper-white/10 transition-colors"
            >
              Join the Foundation
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
