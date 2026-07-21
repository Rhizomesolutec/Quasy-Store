"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { ProductCard } from "@/components/ui/ProductCard";
import { getNewArrivals } from "@/lib/products";

export function NewArrivalsShowcase() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const products = getNewArrivals(6);

  const scrollBy = (dir: number) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="w-full py-24 md:py-32 border-t border-white/[0.05] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-4">
          <SectionHeader
            eyebrow="Just Restored"
            title="New Arrivals"
            description="Freshly cast, freshly catalogued. The newest relics to enter the vault."
            align="left"
            className="mb-0 md:mb-0"
          />
          <div className="flex items-center gap-3 self-start md:self-end md:mb-16">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Scroll left"
              className="w-10 h-10 border-2 border-white/60 text-white hover:border-[#FF0055] hover:text-[#FF0055] transition-colors flex items-center justify-center font-pixel text-xs font-bold retro-box-shadow"
            >
              ◄
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Scroll right"
              className="w-10 h-10 border-2 border-white/60 text-white hover:border-[#FF0055] hover:text-[#FF0055] transition-colors flex items-center justify-center font-pixel text-xs font-bold retro-box-shadow"
            >
              ►
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-5 md:gap-6 overflow-x-auto px-4 md:px-12 lg:px-24 pb-4 snap-x snap-mandatory scrollbar-thin"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 w-[70vw] sm:w-[42vw] md:w-[280px] lg:w-[300px] snap-start"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-24 mt-10 flex justify-center">
        <Link
          href="/new-arrivals"
          className="font-pixel text-[10px] uppercase font-bold tracking-widest text-[#E50914] border-b border-[#E50914]/50 pb-1.5 hover:text-white transition-colors"
        >
          View All New Arrivals ►
        </Link>
      </div>
    </section>
  );
}
