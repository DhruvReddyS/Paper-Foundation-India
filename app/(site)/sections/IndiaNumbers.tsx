"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 24, suffix: "M tonnes", label: "Annual paper production capacity" },
  { value: 75, suffix: "%", label: "Recycled fibre in raw material" },
  { value: 1.5, suffix: "M ha", label: "Land greened via social forestry" },
  { value: 5, suffix: "L+", label: "Rural livelihoods supported" },
];

function AnimatedStat({ value, suffix, label }: Stat) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.round(start * 10) / 10);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-serif text-4xl md:text-5xl font-bold text-forest mb-2">
        {Number.isInteger(display) ? display : display.toFixed(1)}
        <span className="text-copper ml-1 text-2xl">{suffix}</span>
      </p>
      <p className="font-sans text-sm text-mid-grey">{label}</p>
    </div>
  );
}

export function IndiaNumbers() {
  return (
    <section className="py-24 bg-paper-warm">
      <div className="container-wide">
        <div className="text-center mb-14">
          <span className="font-mono text-xs text-copper uppercase tracking-widest">
            India In Numbers
          </span>
          <h2 className="font-serif text-4xl font-bold text-charcoal mt-3 mb-4">
            The scale of India&apos;s paper story
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <AnimatedStat {...stat} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
