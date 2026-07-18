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
  },
  {
    author: "J. Okafor",
    role: "Verified Purchase",
    rating: 5,
    quote:
      "Exactly as pictured. The packaging alone felt ceremonial — and the piece itself is heavier and finer than I expected.",
  },
  {
    author: "R. Delacroix",
    role: "Repeat Buyer",
    rating: 5,
    quote:
      "I get asked about this constantly. The oxidized detailing catches light in a way photos don't do justice to.",
  },
];

export function CustomerReviews() {
  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-24 md:py-32 border-t border-white/[0.05] bg-gradient-to-b from-transparent via-[#E50914]/[0.03] to-transparent">
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
              className="relative border border-white/[0.08] bg-[#170909]/60 p-7 md:p-8 flex flex-col"
            >
              <span className="font-heading text-5xl text-[#E50914]/25 leading-none absolute top-5 right-6 select-none">
                &rdquo;
              </span>
              <Rating value={t.rating} />
              <p className="font-sans text-sm text-[#F5F2EF]/70 leading-relaxed mt-5 mb-8 flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer>
                <cite className="font-heading text-base text-[#F5F2EF] not-italic block">{t.author}</cite>
                <span className="font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/40 mt-1 block">
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
