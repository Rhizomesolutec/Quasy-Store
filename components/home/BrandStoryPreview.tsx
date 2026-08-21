"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Eyebrow, Divider } from "@/components/ui/Eyebrow";
import { LinkButton } from "@/components/ui/Button";

export function BrandStoryPreview() {
  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-12 md:py-16 border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-3 sm:gap-6 md:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-square md:aspect-[4/5] max-h-[360px] md:max-h-[420px] bg-black rounded-sm overflow-hidden border-2 border-[#E50914]/50 retro-box-shadow"
        >
          <div className="absolute inset-0 crt-scanlines z-10 pointer-events-none opacity-20" />
          <Image
            src="/images/Nacklace/Spider Collection/vol 2/vol 2.webp"
            alt="Qusay Store Gothic Spider Necklace"
            fill
            sizes="(min-width: 768px) 40vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/50 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[8px] sm:text-[10px] font-pixel font-bold text-[#E50914] tracking-widest uppercase mb-1 sm:mb-2 block">
            ● ARCHIVAL CATALOG NO. 1924
          </span>
          <Eyebrow className="mb-2 sm:mb-3">Since 1924</Eyebrow>
          <h2 className="font-heading text-base sm:text-2xl md:text-4xl text-[#F5F2EF] leading-[1.1] mb-2 sm:mb-4">
            We didn&apos;t design this collection.
            <br />
            <span className="text-[#E50914]">We excavated it.</span>
          </h2>
          <Divider className="mb-2 sm:mb-4" />
          <p className="font-mono text-[10px] sm:text-xs md:text-sm text-[#F5F2EF]/70 leading-relaxed mb-3 sm:mb-6 line-clamp-3 sm:line-clamp-none">
            When the original moulds resurfaced in 2019, most were unusable. What survived was enough —
            and Qusay Store exists to finish what that first workshop started, slowly and without cutting corners.
          </p>
          <LinkButton
            href="/about"
            variant="outline"
            size="sm"
            className="sm:text-[10px] sm:px-4 sm:py-2.5"
          >
            Read Our Story ►
          </LinkButton>
        </motion.div>
      </div>
    </section>
  );
}
