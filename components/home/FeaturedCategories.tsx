"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { categoryToSlug, getProductsByCategory } from "@/lib/products";
import { SHARED_SPIDER_IMAGES } from "@/lib/sharedImages";

const HOME_FEATURED_CATEGORIES = [
  "Necklaces",
  "Glow Dark Necklace",
  "Bracelets",
  "Denim Sling Bag",
] as const;

const CATEGORY_META: Record<string, { image: string; tagline: string }> = {
  Necklaces: {
    image: encodeURI("/images/Nacklace/Spider Collection/vol 2/vol 2.jpg"),
    tagline: "Chain-drawn pendants built around the house spider motif.",
  },
  "Glow Dark Necklace": {
    image: encodeURI("/images/Nacklace/Glow dark nacklace/vol 11/vol 11.jpg"),
    tagline: "Photoluminescent crystal pieces that charge by day and glow after dark.",
  },
  Bracelets: {
    image: encodeURI("/images/Nacklace/Bracelet/Bracelet 1.jpg"),
    tagline: "Cuffs and chains that translate cathedral scrollwork to the wrist.",
  },
  "Denim Sling Bag": {
    image: encodeURI("/images/Nacklace/Denim Sling Bag/Bag 1/Denim sling bag 1.jpg"),
    tagline: "Hand-stitched denim carriers finished with industrial metal rings.",
  },
};

export function FeaturedCategories() {
  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-24 md:py-32">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Browse by Type"
          title="Featured Categories"
          description="Four core silhouettes, each carrying the same gothic scrollwork and hand-finished detail."
          ctaHref="/categories"
          ctaLabel="View All Categories"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {HOME_FEATURED_CATEGORIES.map((category, idx) => {
            const meta = CATEGORY_META[category];
            const count = getProductsByCategory(category).length;

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
                  className="group relative block aspect-[5/4] overflow-hidden rounded-sm bg-black border border-white/[0.06]"
                >
                  <Image
                    src={meta.image}
                    alt={category}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-8">
                    <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#8E1F1F] mb-2">
                      {count} {count === 1 ? "piece" : "pieces"}
                    </span>
                    <h3 className="font-heading text-3xl md:text-4xl text-[#D8CFC0] mb-2 transition-colors duration-300 group-hover:text-[#D8CFC0]">
                      {category}
                    </h3>
                    <p className="font-sans text-xs text-[#D8CFC0]/55 max-w-xs leading-relaxed mb-4 opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                      {meta.tagline}
                    </p>
                    <span className="font-sans text-[10px] uppercase tracking-widest text-[#D8CFC0] border-b border-[#8E1F1F] pb-1 transition-colors duration-300 group-hover:text-[#8E1F1F]">
                      Explore {category} →
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
