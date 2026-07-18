"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";

const EXPERIENCES = [
  {
    title: "Curated Catalog",
    body: "Every piece traces back to an archival sketch or original mould — nothing is designed in a vacuum.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5V6.5A2.5 2.5 0 016.5 4H20v15.5M4 19.5H20" />
      </svg>
    ),
  },
  {
    title: "Lifetime Care",
    body: "Free re-polishing and clasp repair for as long as you own the piece. Relics are meant to last.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Discreet Packaging",
    body: "Every order ships in an unmarked cedar coffret — no branding on the outside, ceremony within.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    title: "Slow Production",
    body: "Small batches, cast to order where possible, so we never warehouse dead stock or rush the finish.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M9.75 3.1l.35 1.4M14.25 3.1l-.35 1.4M4.5 9.75l1.4.35M4.5 14.25l1.4-.35M19.5 9.75l-1.4.35M19.5 14.25l-1.4-.35M9.75 20.9l.35-1.4M14.25 20.9l-.35-1.4M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    ),
  },
  {
    title: "Serialized Pieces",
    body: "Limited runs with serialized engraving on the clasp — each relic is numbered into the vault.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M7 7h.01M7 3h5c.5 0 1 .2 1.4.6l7 7c.8.8.8 2 0 2.8l-5 5c-.8.8-2 .8-2.8 0l-7-7A2 2 0 013 9V4a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    title: "Expert Guidance",
    body: "Our workshop team answers sizing, finish, and care questions within one to two business days.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
];

export function ShoppingExperience() {
  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-24 md:py-32 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="The Experience"
          title="Shopping, Elevated"
          description="From first glance to lifetime care — every step is designed to feel intentional."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06] border border-white/[0.06]">
          {EXPERIENCES.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-[#070707] p-8 md:p-10 hover:bg-[#170909] transition-colors duration-500"
            >
              <div className="text-[#E50914] mb-5 transition-transform duration-500 group-hover:scale-110 origin-left">
                {item.icon}
              </div>
              <h3 className="font-heading text-lg text-[#F5F2EF] mb-2.5">{item.title}</h3>
              <p className="font-sans text-xs text-[#F5F2EF]/55 leading-relaxed">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
