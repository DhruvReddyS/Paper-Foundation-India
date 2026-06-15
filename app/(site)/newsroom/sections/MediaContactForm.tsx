"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function MediaContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    outlet: "",
    email: "",
    phone: "",
    type: "Interview Request",
    message: "",
    deadline: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="bg-kraft/5 py-20">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-serif font-bold text-charcoal mb-2 text-center">
            Media Inquiry
          </h2>
          <p className="text-charcoal/60 text-center mb-10">
            Working on a story? Reach out and we&apos;ll get back to you within 24 hours.
          </p>

          <form className="bg-paper-white rounded-2xl p-8 border border-kraft/15 shadow-sm space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-kraft/30 focus:ring-2 focus:ring-forest/30 focus:border-forest outline-none"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Media Outlet</label>
                <input
                  type="text"
                  name="outlet"
                  value={formData.outlet}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-kraft/30 focus:ring-2 focus:ring-forest/30 focus:border-forest outline-none"
                  placeholder="Publication / Channel"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-kraft/30 focus:ring-2 focus:ring-forest/30 focus:border-forest outline-none"
                  placeholder="you@outlet.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Inquiry Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-kraft/30 focus:ring-2 focus:ring-forest/30 focus:border-forest outline-none"
                >
                  <option>Interview Request</option>
                  <option>Expert Commentary</option>
                  <option>Data Request</option>
                  <option>Event Invitation</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-kraft/30 focus:ring-2 focus:ring-forest/30 focus:border-forest outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-kraft/30 focus:ring-2 focus:ring-forest/30 focus:border-forest outline-none resize-none"
                placeholder="Brief description of your story and what you need…"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-forest text-paper-white rounded-xl font-bold text-lg hover:bg-dark-green transition-colors shadow-md"
            >
              Submit Media Inquiry
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
