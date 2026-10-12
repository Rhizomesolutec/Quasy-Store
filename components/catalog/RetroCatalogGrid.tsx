"use client";

import { motion } from "framer-motion";
import { CatalogPlate, type CatalogItem } from "./CatalogPlate";

export function RetroCatalogGrid({
  products,
  stamp,
  stampColor,
}: {
  products: CatalogItem[];
  stamp: string;
  stampColor: string;
}) {
  if (products.length === 0) {
    return (
      <div className="border-2 border-[#3a3428] bg-[#14110c] p-8 sm:p-12 text-center retro-box-shadow">
        <p className="font-pixel text-[10px] uppercase tracking-widest text-[#c4a574] mb-3">
          ● Empty drawer
        </p>
        <p className="font-mono text-xs text-[#F5F2EF]/50">
          No plates in this catalog yet. New pieces will land here first.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-5">
      {products.map((product, idx) => (
        <motion.div
          key={`${stamp}-${product.id}-${idx}`}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: Math.min(idx, 8) * 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          <CatalogPlate product={product} index={idx} stamp={stamp} stampColor={stampColor} />
        </motion.div>
      ))}
    </div>
  );
}
