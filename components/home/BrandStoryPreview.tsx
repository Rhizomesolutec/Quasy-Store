"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Eyebrow, Divider } from "@/components/ui/Eyebrow";
import { LinkButton } from "@/components/ui/Button";
import { SHARED_SPIDER_IMAGES } from "@/lib/sharedImages";

export function BrandStoryPreview() {
  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-24 md:py-32 border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] bg-black rounded-sm overflow-hidden border-2 border-[#E50914]/50 retro-box-shadow"
        >
          <div className="absolute inset-0 crt-scanlines z-10 pointer-events-none opacity-20" />
          <Image
            src="/images/Nacklace/Spider Collection/vol 2/vol 2.jpg"
            alt="Qusay Store Gothic Spider Necklace"
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
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
          <span className="text-[10px] font-pixel font-bold text-[#E50914] tracking-widest uppercase mb-2 block">
            ● ARCHIVAL CATALOG NO. 1924
          </span>
          <Eyebrow className="mb-4">Since 1924</Eyebrow>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#F5F2EF] leading-[1.1] mb-6">
            We didn&apos;t design this collection.
            <br />
            <span className="text-[#E50914]">We excavated it.</span>
          </h2>
          <Divider className="mb-6" />
          <p className="font-mono text-xs md:text-sm text-[#F5F2EF]/70 leading-relaxed mb-4">
            When the original moulds resurfaced in 2019, most were unusable. What survived was enough: sketches of a
            spider motif meant to symbolize patience, and a heart-shaped cavity built to hold a hidden inlay.
          </p>
          <p className="font-mono text-xs md:text-sm text-[#F5F2EF]/70 leading-relaxed mb-10">
            Qusay Store exists to finish what that first workshop started — slowly, and without cutting corners.
          </p>
          <LinkButton href="/about" variant="outline" size="lg">
            Read Our Story ►
          </LinkButton>
        </motion.div>
      </div>
    </section>
  );
}
