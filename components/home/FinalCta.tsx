"use client";

import { motion } from "framer-motion";
import { Eyebrow, Divider } from "@/components/ui/Eyebrow";
import { LinkButton } from "@/components/ui/Button";

export function FinalCta() {
  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-24 md:py-36 border-t border-white/[0.05]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto text-center relative"
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,520px)] h-[min(90vw,520px)] rounded-full pointer-events-none opacity-[0.12]"
          style={{
            background: "radial-gradient(circle, #E50914 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10">
          <Eyebrow className="mb-5">Begin the Ritual</Eyebrow>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#F5F2EF] leading-[1.05] mb-6">
            Find the Relic
            <br />
            That Finds You
          </h2>
          <Divider className="mx-auto mb-8" />
          <p className="font-sans text-sm md:text-base text-[#F5F2EF]/60 leading-relaxed max-w-lg mx-auto mb-12">
            Browse the full catalog of gothic fine jewelry — cast slowly, finished by hand, and built to deepen with age.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <LinkButton href="/shop" variant="filled" size="lg">
              Shop the Collection
            </LinkButton>
            <LinkButton href="/collections" variant="outline" size="lg">
              Explore Collections
            </LinkButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
