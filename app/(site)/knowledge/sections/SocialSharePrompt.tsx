"use client";

import { motion } from "framer-motion";

export function SocialSharePrompt() {
  const platforms = [
    { label: "Twitter / X", icon: "𝕏" },
    { label: "LinkedIn", icon: "in" },
    { label: "WhatsApp", icon: "💬" },
    { label: "Copy Link", icon: "🔗" },
  ];

  return (
    <section className="py-16 bg-paper-warm border-t border-border">
      <div className="container-narrow">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-serif text-2xl font-bold text-charcoal mb-3">
            Share the Knowledge
          </h3>
          <p className="text-sm text-mid-grey mb-6">
            Help spread facts about India&apos;s paper industry
          </p>

          <div className="flex items-center justify-center gap-3">
            {platforms.map((p) => (
              <button
                key={p.label}
                className="w-12 h-12 rounded-full border border-border bg-paper-white flex items-center justify-center text-sm font-medium text-charcoal hover:bg-forest hover:text-white hover:border-forest transition-colors"
                title={p.label}
              >
                {p.icon}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
