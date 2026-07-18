"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";

const BENEFITS = [
  {
    title: "Premium Quality",
    body: "Cast in oxidized sterling silver and brass, finished by hand so every piece ages with intention.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M12 3l2.4 4.86L20 8.7l-4 3.9.94 5.5L12 15.9 7.06 18.1 8 12.6l-4-3.9 5.6-.84L12 3z" />
      </svg>
    ),
  },
  {
    title: "Fast Shipping",
    body: "Most orders leave the workshop within 2–4 business days, packed in unmarked cedar coffrets.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M3 7h11v10H3V7zm11 3h4l3 3v4h-7V10zM7 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm10 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      </svg>
    ),
  },
  {
    title: "Secure Payments",
    body: "Encrypted checkout with major cards and digital wallets. Your vault credentials never leave the gate.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4zm0 5v4m0 3h.01" />
      </svg>
    ),
  },
  {
    title: "Easy Returns",
    body: "Unworn pieces in original packaging can be returned within 30 days — no questions, no ceremony.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M4 12a8 8 0 0113.66-5.66M4 4v5h5m11 3a8 8 0 01-13.66 5.66M20 20v-5h-5" />
      </svg>
    ),
  },
];

export function WhyShopWithUs() {
  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-24 md:py-32 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="The Qusay Promise"
          title="Why Shop With Us"
          description="Four quiet assurances behind every relic that leaves the workshop."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {BENEFITS.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="group border border-white/[0.08] bg-white/[0.015] p-7 md:p-8 transition-colors duration-500 hover:border-[#E50914]/40 hover:bg-[#E50914]/[0.04]"
            >
              <div className="w-12 h-12 rounded-full border border-[#E50914]/30 bg-[#E50914]/[0.08] flex items-center justify-center text-[#E50914] mb-6 transition-all duration-500 group-hover:border-[#E50914]/60 group-hover:shadow-[0_0_24px_rgba(229, 9, 20,0.25)]">
                {item.icon}
              </div>
              <h3 className="font-heading text-xl text-[#F5F2EF] mb-3">{item.title}</h3>
              <p className="font-sans text-xs md:text-sm text-[#F5F2EF]/55 leading-relaxed">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
