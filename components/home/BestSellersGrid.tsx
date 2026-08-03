"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Product } from "@/lib/types";

export function BestSellersGrid({ products }: { products: Product[] }) {

  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-24 md:py-32 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Customer Favourites"
          title="Best Sellers"
          description="The pieces our collectors return for — proven, trending, and rarely in stock for long."
          ctaHref="/best-sellers"
          ctaLabel="Shop Best Sellers"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10 md:gap-x-6 md:gap-y-12">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.65, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
