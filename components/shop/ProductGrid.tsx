"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/ui/ProductCard";
import { QuickViewModal } from "./QuickViewModal";

export function ProductGrid({ products, columns = 4 }: { products: Product[]; columns?: 2 | 3 | 4 }) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const colClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
      ? "grid-cols-2 sm:grid-cols-3"
      : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <>
      <div className={`grid ${colClass} gap-x-6 gap-y-12`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
        ))}
      </div>
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}
