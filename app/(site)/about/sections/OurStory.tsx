"use client";

import { motion } from "framer-motion";

export default function OurStory() {
  return (
    <section className="bg-paper-white py-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-8 text-center">
            Our Story
          </h2>

          <div className="prose prose-lg max-w-none text-charcoal/80">
            <div className="bg-sage/5 rounded-2xl p-8 md:p-12 border border-sage/15">
              <p className="text-lg leading-relaxed mb-6">
                Paper Foundation India was born from a simple observation: the public narrative
                around paper was dominated by myths, half-truths, and outdated assumptions.
                While the paper industry in India had made tremendous strides in sustainability,
                the conversation hadn&apos;t kept up.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                Founded in 2023, we set out to bridge this gap. Our team of researchers,
                journalists, and sustainability experts began documenting the real story — 
                one backed by data, verified by experts, and told with clarity.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                From our first article debunking the myth that &ldquo;paper destroys forests&rdquo;
                to our comprehensive sustainability reports, every piece of content is crafted
                with one goal: helping people make informed decisions about the materials
                they use daily.
              </p>

              <p className="text-lg leading-relaxed">
                Today, Paper Foundation India is the country&apos;s leading independent voice on
                paper sustainability — trusted by educators, policymakers, journalists, and
                millions of citizens who want the facts.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
