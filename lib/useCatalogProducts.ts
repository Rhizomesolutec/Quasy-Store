"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";

/** Client-side catalog fetch for pages that cannot be server-rendered with products. */
export function useCatalogProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load products");
        const json = await res.json();
        if (!cancelled) {
          setProducts(Array.isArray(json.products) ? json.products : []);
        }
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading };
}
