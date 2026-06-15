"use client";

import { motion } from "framer-motion";

const team = [
  { name: "Dr. Priya Sharma", role: "Editor-in-Chief", bio: "Environmental journalist with 15 years covering sustainability.", avatar: "PS" },
  { name: "Rajesh Menon", role: "Head of Research", bio: "Former TERI researcher specializing in lifecycle analysis.", avatar: "RM" },
  { name: "Ananya Verma", role: "Content Director", bio: "Award-winning science communicator and myth-buster.", avatar: "AV" },
  { name: "Dr. Sanjay Patel", role: "Advisory Board", bio: "Professor of Environmental Science, IIT Bombay.", avatar: "SP" },
  { name: "Kavita Nair", role: "Community Manager", bio: "Builds bridges between industry, educators, and the public.", avatar: "KN" },
  { name: "Arjun Gupta", role: "Data & Analytics", bio: "Data scientist focused on environmental impact modeling.", avatar: "AG" },
];

export default function TeamGrid() {
  return (
    <section className="bg-paper-warm py-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
            Our Team &amp; Advisors
          </h2>
          <p className="text-charcoal/60 max-w-xl mx-auto">
            A multidisciplinary team united by a passion for truth and sustainability.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-paper-white rounded-2xl p-8 border border-kraft/15 text-center shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-forest to-sage flex items-center justify-center mx-auto mb-5">
                <span className="text-paper-white font-bold text-lg">{member.avatar}</span>
              </div>
              <h3 className="text-lg font-bold text-charcoal group-hover:text-forest transition-colors">
                {member.name}
              </h3>
              <p className="text-sm font-semibold text-copper mb-3">{member.role}</p>
              <p className="text-sm text-charcoal/60 leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
