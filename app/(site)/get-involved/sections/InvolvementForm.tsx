"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { id: 1, title: "How would you like to help?", field: "involvement" },
  { id: 2, title: "Tell us about yourself", field: "details" },
  { id: 3, title: "Your message", field: "message" },
];

const involvementOptions = [
  { label: "Volunteer", icon: "🙋", description: "Help us with events, research, or content." },
  { label: "Partner", icon: "🤝", description: "Organizational or institutional partnership." },
  { label: "Donate", icon: "💚", description: "Support our mission with a contribution." },
  { label: "Spread the Word", icon: "📢", description: "Share our content and amplify impact." },
];

export default function InvolvementForm() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState("");

  return (
    <section className="bg-gradient-to-br from-forest to-dark-green py-24 text-paper-white">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-sage/20 text-sage text-sm font-medium uppercase mb-4">
            Get Involved
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Join the Movement
          </h1>
          <p className="text-paper-warm/70 max-w-xl mx-auto">
            There are many ways to support evidence-based information about paper sustainability.
          </p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s.id ? "bg-copper text-paper-white" : "bg-paper-white/20 text-paper-white/50"
                }`}
              >
                {s.id}
              </div>
              {s.id < steps.length && (
                <div className={`w-12 h-0.5 transition-all ${step > s.id ? "bg-copper" : "bg-paper-white/20"}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid sm:grid-cols-2 gap-4"
            >
              {involvementOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => { setSelected(option.label); setStep(2); }}
                  className={`p-6 rounded-2xl border text-left transition-all ${
                    selected === option.label
                      ? "border-copper bg-copper/10"
                      : "border-paper-white/20 bg-paper-white/5 hover:border-paper-white/40"
                  }`}
                >
                  <span className="text-3xl mb-3 block">{option.icon}</span>
                  <h3 className="text-lg font-bold mb-1">{option.label}</h3>
                  <p className="text-sm text-paper-warm/60">{option.description}</p>
                </button>
              ))}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-paper-white/10 rounded-2xl p-8 space-y-6"
            >
              <h3 className="text-xl font-bold mb-4">Your Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" className="px-4 py-3 rounded-lg bg-paper-white/10 border border-paper-white/20 placeholder:text-paper-warm/40 focus:ring-2 focus:ring-copper/50 outline-none" />
                <input type="email" placeholder="Email" className="px-4 py-3 rounded-lg bg-paper-white/10 border border-paper-white/20 placeholder:text-paper-warm/40 focus:ring-2 focus:ring-copper/50 outline-none" />
              </div>
              <input type="text" placeholder="Organization (optional)" className="w-full px-4 py-3 rounded-lg bg-paper-white/10 border border-paper-white/20 placeholder:text-paper-warm/40 focus:ring-2 focus:ring-copper/50 outline-none" />
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3 rounded-lg border border-paper-white/30 hover:bg-paper-white/10 transition">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-lg bg-copper text-paper-white font-bold hover:bg-copper/90 transition">Continue</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-paper-white/10 rounded-2xl p-8 space-y-6"
            >
              <h3 className="text-xl font-bold mb-4">Anything else?</h3>
              <textarea rows={5} placeholder="Tell us more about how you'd like to get involved…" className="w-full px-4 py-3 rounded-lg bg-paper-white/10 border border-paper-white/20 placeholder:text-paper-warm/40 focus:ring-2 focus:ring-copper/50 outline-none resize-none" />
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="px-6 py-3 rounded-lg border border-paper-white/30 hover:bg-paper-white/10 transition">Back</button>
                <button className="flex-1 py-3 rounded-lg bg-copper text-paper-white font-bold hover:bg-copper/90 transition">Submit</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
