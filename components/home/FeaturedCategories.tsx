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
    <section className="w-full px-4 md:px-12 lg:px-24 py-24 md:py-32">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Browse by Type"
          title="Featured Categories"
          description="Core silhouettes and signature lines — each carrying the same gothic scrollwork and hand-finished detail."
          ctaHref="/categories"
          ctaLabel="View All Categories"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
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
                  className="group relative block aspect-[5/4] overflow-hidden rounded-sm bg-black border-2 border-[#E50914]/50 retro-box-shadow transition-all duration-500 hover:border-[#E50914]"
                >
                  <div className="absolute top-3 left-3 z-20 px-3 py-1 text-[10px] font-black text-white uppercase tracking-wider border border-black font-mono shadow-sm bg-[#E50914]">
                    {meta.badge}
                  </div>

                  <Image
                    src={meta.image}
                    alt={category}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-8">
                    <span className="font-pixel text-[10px] uppercase tracking-wider font-bold mb-1 text-[#E50914]">
                      {count} {count === 1 ? "piece" : "pieces"}
                    </span>
                    <h3
                      className="font-heading hollow-red-text text-3xl md:text-4xl mb-2 tracking-wider transition-all duration-300 group-hover:translate-x-1"
                      style={{
                        color: "transparent",
                        WebkitTextFillColor: "transparent",
                        WebkitTextStroke: "1.4px #B3121D",
                        filter: "none",
                      }}
                    >
                      {category}
                    </h3>
                    <p className="font-sans text-xs text-[#F5F2EF]/70 max-w-xs leading-relaxed mb-4 opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 font-mono">
                      {meta.tagline}
                    </p>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#F5F2EF] border-b border-[#E50914]/40 pb-1 transition-colors duration-300 flex items-center gap-1 font-bold">
                      <span>Explore {category}</span>
                      <span className="text-[#E50914]">►</span>
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
