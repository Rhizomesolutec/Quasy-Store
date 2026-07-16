"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { Accordion } from "@/components/ui/Accordion";
import { LinkButton } from "@/components/ui/Button";

const FAQ_ITEMS = [
  {
    title: "How long does shipping take?",
    content:
      "Most orders ship within 2–4 business days and arrive within 5–10 days domestically. International orders typically take 10–18 days.",
  },
  {
    title: "Do you offer repairs or re-polishing?",
    content:
      "Yes — we offer lifetime re-polishing on all pieces, and repairs can be requested through our contact form.",
  },
  {
    title: "What is your return policy?",
    content:
      "Unworn pieces in original packaging can be returned within 30 days for a full refund. Relics are packaged in dark cedar coffrets.",
  },
  {
    title: "Is the silver hypoallergenic?",
    content:
      "Our sterling silver and gold vermeil pieces are nickel-free and suitable for most sensitive skin.",
  },
];

export function FaqPreview() {
  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-24 md:py-32 border-t border-white/[0.05]">
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          eyebrow="Questions"
          title="Frequently Asked"
          description="Quick answers before you reach the workshop."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Accordion items={FAQ_ITEMS} defaultOpen={0} />
        </motion.div>

        <div className="mt-12 flex justify-center">
          <LinkButton href="/contact" variant="ghost" size="md">
            Still Have Questions?
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
