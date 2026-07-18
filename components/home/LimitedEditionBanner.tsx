"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Eyebrow, Divider } from "@/components/ui/Eyebrow";
import { LinkButton } from "@/components/ui/Button";

export function LimitedEditionBanner() {
  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-16 md:py-24">
      <div className="max-w-7xl mx-auto relative overflow-hidden rounded-sm border border-white/[0.08] min-h-[480px] md:min-h-[520px] flex items-center">
        <Image
          src={encodeURI("/images/Nacklace/Glow dark nacklace/vol 7/vol 7.jpg")}
          alt="Limited Edition Midnight Glow"
          fill
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070707] via-[#070707]/80 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 40%, #E50914 0%, transparent 50%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 px-6 sm:px-10 md:px-16 py-16 max-w-lg"
        >
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse" />
            <Eyebrow>Limited Edition</Eyebrow>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-[#F5F2EF] leading-[1.05] mb-5">
            The Midnight Glow
          </h2>
          <Divider className="mb-6" />
          <p className="font-sans text-sm md:text-base text-[#F5F2EF]/65 leading-relaxed mb-4">
            A unique luminescent inlay catches and holds ambient light, releasing a slow crimson glow after dark.
            Only a handful remain in this casting run.
          </p>
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#E50914] mb-8">
            6 pieces remaining · Serialized
          </p>
          <LinkButton href="/shop/midnight-glow-necklace" variant="filled" size="lg">
            Claim Yours
          </LinkButton>
        </motion.div>
      </div>
    </section>
  );
}
