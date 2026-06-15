"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function ShockStatSection() {
  return (
    <section className="bg-dark-green text-white py-24">
      <div className="container-wide text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-sm text-copper tracking-wider uppercase mb-6">
            Did you know?
          </p>
          <h2 className="font-serif text-6xl md:text-8xl font-bold mb-4">
            <CountUp target={75} suffix="%" />
          </h2>
          <p className="text-xl md:text-2xl text-paper-warm/80 max-w-2xl mx-auto leading-relaxed">
            of India&apos;s paper raw material comes from{" "}
            <strong className="text-white">recycled fibre</strong> — making it one
            of the most circular industries in the country.
          </p>
          <p className="mt-6 text-sm text-sage">
            Source: Indian Paper Manufacturers Association (IPMA), 2024
          </p>
        </motion.div>
      </div>
    </section>
  );
}
