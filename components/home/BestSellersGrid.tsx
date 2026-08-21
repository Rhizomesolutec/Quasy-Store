"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Product } from "@/lib/types";

export function BestSellersGrid({ products }: { products: Product[] }) {

  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-12 md:py-16 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Customer Favourites"
          title="Best Sellers"
          description="The pieces our collectors return for — proven, trending, and rarely in stock for long."
          ctaHref="/best-sellers"
          ctaLabel="Shop Best Sellers"
          className="mb-6 md:mb-8"
        />

        <div
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 scrollbar-thin md:mx-0 md:px-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-x-4 md:gap-y-8"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.65, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex-shrink-0 w-[45vw] min-[480px]:w-[200px] snap-start md:w-auto md:flex-shrink"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
