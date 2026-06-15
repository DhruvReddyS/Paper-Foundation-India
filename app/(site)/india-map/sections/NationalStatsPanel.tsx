"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

const stats: StatItem[] = [
  { label: "Total Production", value: 24800, suffix: "K tonnes", icon: "🏭" },
  { label: "Recycling Rate", value: 70, suffix: "%", icon: "♻️" },
  { label: "Paper Mills", value: 860, suffix: "+", icon: "🏗️" },
  { label: "Employment", value: 500, suffix: "K jobs", icon: "👷" },
];

function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target, duration]);

  return { count, start: () => setStarted(true) };
}

function StatCard({ stat, delay }: { stat: StatItem; delay: number }) {
  const { count, start } = useCountUp(stat.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      onViewportEnter={start}
      className="bg-white rounded-xl p-5 shadow-sm border border-sage/20 text-center"
    >
      <div className="text-2xl mb-2">{stat.icon}</div>
      <div className="text-2xl font-bold text-forest">
        {count.toLocaleString()}
        <span className="text-sm font-normal text-forest/60 ml-1">{stat.suffix}</span>
      </div>
      <p className="text-sm text-forest/60 mt-1">{stat.label}</p>
    </motion.div>
  );
}

export default function NationalStatsPanel() {
  return (
    <section className="py-12 px-6 bg-paper-warm/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-forest text-center mb-8">
          National Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
