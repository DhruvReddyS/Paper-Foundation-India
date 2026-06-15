"use client";

import { motion } from "framer-motion";

export default function CircularityText() {
  return (
    <section className="py-16 px-6 bg-paper-warm">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="prose prose-lg max-w-none"
        >
          <h2 className="text-3xl font-bold text-forest mb-6">
            Why Paper is the Model Circular Material
          </h2>

          <div className="space-y-4 text-forest/70 leading-relaxed">
            <p>
              The circular economy is built on three principles:{" "}
              <strong className="text-forest">eliminate waste, circulate materials,
              and regenerate nature</strong>. Paper checks every box.
            </p>

            <p>
              Unlike fossil-fuel-derived materials, paper starts from a renewable
              resource — trees grown on managed plantations, agricultural residues
              like wheat straw and bagasse, and previously recycled fibre. India&apos;s
              paper industry sources 75% of its raw material from recycled fibre,
              making it one of the most circular industries in the country.
            </p>

            <p>
              At end-of-life, paper biodegrades naturally. But before that, it can
              be collected and recycled up to 7 times — each cycle reducing the
              need for virgin material, saving energy, and lowering carbon emissions.
            </p>

            <div className="bg-forest/5 rounded-xl p-6 my-6 not-prose">
              <h3 className="font-bold text-forest text-lg mb-3">
                📊 Paper vs. Other Materials
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-forest">7×</div>
                  <p className="text-xs text-forest/60">Paper recycling cycles</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-forest">~70%</div>
                  <p className="text-xs text-forest/60">Global paper recovery rate</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-forest">2–6 mo</div>
                  <p className="text-xs text-forest/60">Biodegradation time</p>
                </div>
              </div>
            </div>

            <p>
              The industry is also a net-positive for green cover. India&apos;s paper
              companies have planted over 1.2 million hectares of trees under social
              farm forestry programmes, providing income to rural communities while
              expanding carbon sinks.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
