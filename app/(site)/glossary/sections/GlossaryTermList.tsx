"use client";

import { motion } from "framer-motion";

interface Term {
  term: string;
  definition: string;
}

const glossaryData: Record<string, Term[]> = {
  A: [
    { term: "Agro-residue Pulp", definition: "Pulp derived from agricultural waste such as bagasse, wheat straw, or rice husk, used as an alternative to wood-based pulp." },
    { term: "Acid-free Paper", definition: "Paper made with a neutral or slightly alkaline pH, ensuring long-term durability and resistance to yellowing." },
  ],
  B: [
    { term: "Bagasse", definition: "The fibrous residue left after sugarcane stalks are crushed to extract juice. Widely used in Indian paper mills as a sustainable pulp source." },
    { term: "Bleaching", definition: "Chemical process to whiten pulp by removing lignin and other coloring agents. Modern mills increasingly use ECF (Elemental Chlorine Free) methods." },
    { term: "Biodegradable", definition: "Capable of being broken down by natural biological processes. Paper is inherently biodegradable, unlike most plastics." },
  ],
  C: [
    { term: "Carbon Sequestration", definition: "The long-term storage of carbon dioxide. Managed forests for paper production act as carbon sinks, absorbing CO₂ during tree growth." },
    { term: "Cellulose", definition: "The primary structural component of plant cell walls and the main raw material in paper production." },
    { term: "Corrugated Board", definition: "A multi-layered packaging material consisting of a fluted (wavy) inner layer sandwiched between flat linerboards." },
  ],
  D: [
    { term: "Deinking", definition: "The industrial process of removing printing inks, toners, and other contaminants from recovered paper during recycling." },
  ],
  F: [
    { term: "FSC Certification", definition: "Forest Stewardship Council certification ensuring that paper products come from responsibly managed forests." },
  ],
  P: [
    { term: "Pulp", definition: "A wet, fibrous material produced by mechanically or chemically processing wood or other plant materials, used as the base for making paper." },
    { term: "Post-Consumer Waste", definition: "Paper products that have been used by consumers and then collected for recycling." },
  ],
  R: [
    { term: "Recycled Fibre", definition: "Paper fibre recovered from used paper products and reprocessed into new paper. Paper can typically be recycled 5–7 times." },
  ],
  S: [
    { term: "Sustainable Forestry", definition: "Forest management practices that balance environmental, social, and economic needs while maintaining forest health for future generations." },
  ],
};

export default function GlossaryTermList() {
  const letters = Object.keys(glossaryData).sort();

  return (
    <section className="bg-paper-warm py-16">
      <div className="max-w-4xl mx-auto px-6">
        {letters.map((letter) => (
          <div key={letter} id={`letter-${letter}`} className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-forest text-paper-white font-serif font-bold text-xl">
                {letter}
              </span>
              <div className="flex-1 h-px bg-kraft/30" />
            </div>

            <div className="space-y-4">
              {glossaryData[letter].map((item, index) => (
                <motion.div
                  key={item.term}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-paper-white rounded-xl p-6 border border-kraft/15 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-bold text-forest mb-2">{item.term}</h3>
                  <p className="text-charcoal/70 leading-relaxed">{item.definition}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
