"use client";

import { motion } from "framer-motion";

export default function ContactSuccess() {
  return (
    <section className="bg-sage/5 py-16">
      <div className="max-w-lg mx-auto px-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full bg-forest flex items-center justify-center mx-auto mb-6"
        >
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-10 h-10 text-paper-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-serif font-bold text-charcoal mb-3">
            Message Sent Successfully!
          </h2>
          <p className="text-charcoal/60 mb-6">
            Thank you for reaching out. We typically respond within 24–48 hours.
            You&apos;ll receive a confirmation email shortly.
          </p>
          <button className="px-6 py-3 rounded-lg bg-forest text-paper-white font-semibold hover:bg-dark-green transition-colors">
            Send Another Message
          </button>
        </motion.div>
      </div>
    </section>
  );
}
