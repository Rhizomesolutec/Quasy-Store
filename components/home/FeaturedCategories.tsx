"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { categoryToSlug } from "@/lib/catalog";
import type { Product } from "@/lib/types";

const PREFERRED_ORDER = [
  "Necklaces",
  "Glow Dark Necklace",
  "Bracelets",
  "Denim Sling Bag",
];

const CATEGORY_META: Record<
  string,
  { image: string; tagline: string; badge: string }
> = {
  Necklaces: {
    image: encodeURI("/images/Nacklace/Spider Collection/vol 2/vol 2.webp"),
    tagline: "Chain-drawn pendants built around the house spider motif.",
    badge: "SITCOMS",
  },
  "Glow Dark Necklace": {
    image: encodeURI("/images/Nacklace/Glow dark nacklace/vol 11/vol 11.webp"),
    tagline: "Photoluminescent crystal pieces that charge by day and glow after dark.",
    badge: "KIDS",
  },
  Bracelets: {
    image: encodeURI("/images/Nacklace/Bracelet/Bracelet 1.webp"),
    tagline: "Cuffs and chains that translate cathedral scrollwork to the wrist.",
    badge: "MOVIES",
  },
  "Denim Sling Bag": {
    image: encodeURI("/images/Nacklace/Denim Sling Bag/Bag 1/Denim sling bag 1.webp"),
    tagline: "Hand-stitched denim carriers finished with industrial metal rings.",
    badge: "SLING BAGS",
  },
};

const DEFAULT_META = {
  image: "/images/spider-1.webp",
  tagline: "Original handcrafted gothic relic from the Qusay vault.",
  badge: "NEW",
};

export function FeaturedCategories({
  products,
  categories = [],
}: {
  products: Product[];
  categories?: string[];
}) {
  const liveNames =
    categories.length > 0
      ? categories
      : Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  const ordered = [
    ...PREFERRED_ORDER.filter((name) =>
      liveNames.some((n) => n.toLowerCase() === name.toLowerCase())
    ),
    ...liveNames.filter(
      (name) =>
        !PREFERRED_ORDER.some((p) => p.toLowerCase() === name.toLowerCase())
    ),
  ].slice(0, 4);

  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-12 md:py-32">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Browse by Type"
          title="Featured Categories"
          description="Core silhouettes and signature lines — each carrying the same gothic scrollwork and hand-finished detail."
          ctaHref="/categories"
          ctaLabel="View All Categories"
          className="mb-6 md:mb-16"
        />

        <div className="grid grid-cols-2 gap-3 md:gap-6">
          {ordered.map((category, idx) => {
            const meta = CATEGORY_META[category] || DEFAULT_META;
            const count = products.filter(
              (p) => p.category.toLowerCase() === category.toLowerCase()
            ).length;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={`/categories/${categoryToSlug(category)}`}
                  className="group relative block aspect-square sm:aspect-[5/4] overflow-hidden rounded-sm bg-black border-2 border-[#E50914]/50 retro-box-shadow transition-all duration-500 hover:border-[#E50914]"
                >
                  <div className="absolute top-2 left-2 md:top-3 md:left-3 z-20 px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-[10px] font-black text-white uppercase tracking-wider border border-black font-mono shadow-sm bg-[#E50914]">
                    {meta.badge}
                  </div>

                  <Image
                    src={meta.image}
                    alt={category}
                    fill
                    sizes="50vw"
                    className="object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-start justify-end p-3 sm:p-4 md:p-8">
                    <span className="font-pixel text-[9px] md:text-[10px] uppercase tracking-wider font-bold mb-1 text-[#E50914]">
                      {count} {count === 1 ? "piece" : "pieces"}
                    </span>
                    <h3
                      className="font-heading hollow-red-text text-sm sm:text-2xl md:text-4xl mb-1 md:mb-2 tracking-wide sm:tracking-wider whitespace-nowrap sm:whitespace-normal transition-all duration-300 group-hover:translate-x-1"
                      style={{
                        color: "transparent",
                        WebkitTextFillColor: "transparent",
                        WebkitTextStroke: "1.4px #B3121D",
                        filter: "none",
                      }}
                    >
                      {category}
                    </h3>
                    <p className="hidden sm:block font-sans text-[11px] md:text-xs text-[#F5F2EF]/70 max-w-xs leading-relaxed mb-2 md:mb-4 opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 font-mono">
                      {meta.tagline}
                    </p>
                    <span className="font-mono text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-wider sm:tracking-widest text-[#F5F2EF] border-b border-[#E50914]/40 pb-0.5 sm:pb-1 transition-colors duration-300 flex items-center gap-1 font-bold max-w-full">
                      <span className="truncate">Explore {category}</span>
                      <span className="text-[#E50914] shrink-0">►</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
