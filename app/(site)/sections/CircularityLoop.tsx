"use client";

import { motion } from "framer-motion";

export function CircularityLoop() {
  const steps = [
    { label: "Plant", angle: 0 },
    { label: "Harvest", angle: 60 },
    { label: "Mill", angle: 120 },
    { label: "Use", angle: 180 },
    { label: "Collect", angle: 240 },
    { label: "Recycle", angle: 300 },
  ];

  return (
    <section className="py-24 bg-dark-green text-white overflow-hidden">
      <div className="container-wide">
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-copper uppercase tracking-widest">
            Circular Economy
          </span>
          <h2 className="font-serif text-4xl font-bold mt-3 mb-4">
            The never-ending loop
          </h2>
          <p className="text-paper-warm/70 max-w-xl mx-auto">
            Paper is inherently circular — grown, used, collected, recycled, and grown again.
          </p>
        </div>

        <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto">
          {/* Animated ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-dashed border-sage/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="font-serif text-2xl font-bold">∞</p>
              <p className="font-mono text-xs text-sage mt-1">Circular</p>
            </div>
          </div>

          {/* Step nodes */}
          {steps.map((step, i) => {
            const radius = 140;
            const rad = (step.angle - 90) * (Math.PI / 180);
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;

            return (
              <motion.div
                key={step.label}
                className="absolute w-16 h-16 md:w-20 md:h-20 rounded-full bg-forest border-2 border-sage/40 flex items-center justify-center"
                style={{
                  left: `calc(50% + ${x}px - 2.5rem)`,
                  top: `calc(50% + ${y}px - 2.5rem)`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <span className="font-sans text-xs font-medium text-center leading-tight">
                  {step.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
