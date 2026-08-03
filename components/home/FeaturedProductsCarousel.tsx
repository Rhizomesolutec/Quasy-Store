"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function FeaturedProductsCarousel({ products }: { products: Product[] }) {
  const items = products.slice(0, 8);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const scrollBy = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section className="w-full py-24 md:py-32 border-t border-white/[0.05] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeader
            eyebrow="From the Catalog"
            title="Featured Relics"
            description="A curated selection of pieces that define the Qusay aesthetic."
            align="left"
            className="mb-0"
          />
          <div className="flex items-center gap-3 self-start md:self-end mb-6 md:mb-16">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Previous"
              className="w-10 h-10 border-2 border-white/60 text-white hover:border-[#FF0055] hover:text-[#FF0055] transition-colors flex items-center justify-center font-pixel text-xs font-bold retro-box-shadow"
            >
              ◄
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Next"
              className="w-10 h-10 border-2 border-white/60 text-white hover:border-[#FF0055] hover:text-[#FF0055] transition-colors flex items-center justify-center font-pixel text-xs font-bold retro-box-shadow"
            >
              ►
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        className={`flex gap-5 md:gap-6 overflow-x-auto px-4 md:px-12 lg:px-24 pb-2 snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none ${
          isDragging ? "scroll-auto" : ""
        }`}
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 w-[75vw] sm:w-[45vw] md:w-[340px] snap-start"
          >
            <Link href={`/shop/${product.slug}`} className="group block">
              <div className="relative aspect-[4/5] bg-black rounded-sm overflow-hidden border-2 border-[#E50914]/40 mb-4 retro-box-shadow group-hover:border-[#E50914] transition-colors">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="340px"
                  draggable={false}
                  className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="absolute bottom-4 left-4 right-4 font-mono text-[10px] uppercase font-bold tracking-widest text-[#E50914] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-1">
                  <span>View Details</span>
                  <span>►</span>
                </span>
              </div>
              <p className="font-pixel text-[9px] font-bold uppercase tracking-widest text-[#E50914] mb-1">
                {product.category}
              </p>
              <h3 className="font-heading product-card-title text-lg transition-colors">
                {product.name}
              </h3>
              <p className="font-pixel text-xs text-[#FF2A45] drop-shadow-[0_0_4px_rgba(255,42,69,0.3)] mt-1">{formatPrice(product.price)}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
