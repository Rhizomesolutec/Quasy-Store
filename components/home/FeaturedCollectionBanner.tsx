"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Eyebrow, Divider } from "@/components/ui/Eyebrow";
import { LinkButton } from "@/components/ui/Button";
import { COLLECTIONS } from "@/lib/products";

export function FeaturedCollectionBanner() {
  const collection = COLLECTIONS[0];
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="relative w-full min-h-[70vh] md:min-h-[80vh] overflow-hidden flex items-center">
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <Image
          src={collection.image}
          alt={collection.name}
          fill
          sizes="100vw"
          className="object-cover opacity-40"
          priority={false}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/75 to-[#111111]/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-[#111111]/50" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-12 lg:px-24 py-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          <Eyebrow className="mb-5">Featured Collection</Eyebrow>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-[#D8CFC0] leading-[1.05] mb-6">
            {collection.name}
          </h2>
          <Divider className="mb-6" />
          <p className="font-sans text-sm md:text-base text-[#D8CFC0]/65 leading-relaxed mb-10 max-w-md">
            {collection.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <LinkButton href={`/collections/${collection.slug}`} variant="filled" size="lg">
              Explore Collection
            </LinkButton>
            <Link
              href="/collections"
              className="inline-flex items-center font-sans text-xs uppercase tracking-widest text-[#D8CFC0]/70 hover:text-[#8E1F1F] transition-colors border-b border-transparent hover:border-[#8E1F1F] pb-0.5"
            >
              All Collections →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
