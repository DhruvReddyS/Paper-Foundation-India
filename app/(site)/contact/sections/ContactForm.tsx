"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const inquiryTypes = [
  "General Inquiry",
  "Media / Press",
  "Partnership",
  "Fact-Check Request",
  "Report an Error",
  "Other",
];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "General Inquiry",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="bg-paper-warm py-20">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-forest/10 text-forest text-sm font-medium uppercase mb-4">
              Contact Us
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-4">
              We&apos;d Love to Hear From You
            </h1>
            <p className="text-charcoal/60 max-w-lg mx-auto">
              Have a question, suggestion, or want to collaborate? Drop us a line.
            </p>
          </div>

          <form className="bg-paper-white rounded-2xl p-8 md:p-10 border border-kraft/15 shadow-sm space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-kraft/30 focus:ring-2 focus:ring-forest/30 focus:border-forest outline-none"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-kraft/30 focus:ring-2 focus:ring-forest/30 focus:border-forest outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Inquiry Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-kraft/30 focus:ring-2 focus:ring-forest/30 focus:border-forest outline-none"
                >
                  {inquiryTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-kraft/30 focus:ring-2 focus:ring-forest/30 focus:border-forest outline-none"
                  placeholder="What's this about?"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-kraft/30 focus:ring-2 focus:ring-forest/30 focus:border-forest outline-none resize-none"
                placeholder="Your message…"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-forest text-paper-white rounded-xl font-bold text-lg hover:bg-dark-green transition-colors shadow-md"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
