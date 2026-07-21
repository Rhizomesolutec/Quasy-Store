"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { Rating } from "@/components/ui/Rating";

const TESTIMONIALS = [
  {
    author: "M. Ashworth",
    role: "Verified Collector",
    rating: 5,
    quote:
      "The filigree work is genuinely intricate in person. Sits perfectly at the collarbone and the finish hasn't dulled after weeks of wear.",
    color: "#00FF66",
  },
  {
    author: "J. Okafor",
    role: "Verified Purchase",
    rating: 5,
    quote:
      "Exactly as pictured. The packaging alone felt ceremonial — and the piece itself is heavier and finer than I expected.",
    color: "#00F0FF",
  },
  {
    author: "R. Delacroix",
    role: "Repeat Buyer",
    rating: 5,
    quote:
      "I get asked about this constantly. The oxidized detailing catches light in a way photos don't do justice to.",
    color: "#FF0055",
  },
];

export function CustomerReviews() {
  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-24 md:py-32 border-t border-white/[0.05] bg-gradient-to-b from-transparent via-[#FF0055]/[0.02] to-transparent">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="From the Vault"
          title="What Collectors Say"
          description="Quiet praise from those who wear the relics daily."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <motion.blockquote
              key={t.author}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="relative border-2 border-[#E50914]/50 bg-[#0a0a0c] p-7 md:p-8 flex flex-col retro-box-shadow transition-all duration-500 hover:border-[#E50914]"
            >
              <span className="font-heading text-5xl leading-none absolute top-5 right-6 select-none opacity-30 text-[#E50914]">
                &rdquo;
              </span>
              <Rating value={t.rating} />
              <p className="font-mono text-xs text-[#F5F2EF]/80 leading-relaxed mt-5 mb-8 flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="pt-4 border-t border-[#222]">
                <cite className="font-heading text-base text-[#F5F2EF] not-italic block">{t.author}</cite>
                <span className="inline-block font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 mt-2 font-bold text-white bg-[#E50914]">
                  {t.role}
                </span>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
