"use client";

import { motion } from "framer-motion";

const contactDetails = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Email",
    value: "hello@paperfoundation.in",
    href: "mailto:hello@paperfoundation.in",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Address",
    value: "123 Sustainability Lane, New Delhi 110001, India",
    href: "#",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: "Phone",
    value: "+91 11 2345 6789",
    href: "tel:+911123456789",
  },
];

const socials = [
  { name: "Twitter / X", handle: "@PaperFoundation" },
  { name: "Instagram", handle: "@paperfoundationindia" },
  { name: "LinkedIn", handle: "Paper Foundation India" },
  { name: "YouTube", handle: "Paper Foundation India" },
];

export default function ContactInfo() {
  return (
    <section className="bg-paper-white py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-serif font-bold text-charcoal mb-8">
              Contact Information
            </h2>
            <div className="space-y-6">
              {contactDetails.map((detail) => (
                <a
                  key={detail.label}
                  href={detail.href}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-forest/10 text-forest flex items-center justify-center flex-shrink-0 group-hover:bg-forest group-hover:text-paper-white transition-colors">
                    {detail.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal/50">{detail.label}</p>
                    <p className="text-charcoal font-medium">{detail.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-serif font-bold text-charcoal mb-8">
              Follow Us
            </h2>
            <div className="space-y-4">
              {socials.map((social) => (
                <div
                  key={social.name}
                  className="flex items-center justify-between p-4 bg-sage/5 rounded-xl border border-sage/15 hover:border-forest/20 transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-charcoal">{social.name}</span>
                  <span className="text-sm text-forest font-medium">{social.handle}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
