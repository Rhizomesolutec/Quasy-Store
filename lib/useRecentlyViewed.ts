"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { useCatalogProducts } from "@/lib/useCatalogProducts";

const STORAGE_KEY = "qusay_recently_viewed_v1";
const MAX_ITEMS = 8;

export function trackRecentlyViewed(productId: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    const next = [productId, ...ids.filter((id) => id !== productId)].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore malformed storage
  }
}

export function useRecentlyViewed(excludeId?: string): Product[] {
  const { products: catalog } = useCatalogProducts();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const ids: string[] = raw ? JSON.parse(raw) : [];
      const found = ids
        .filter((id) => id !== excludeId)
        .map((id) => catalog.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resolve stored IDs against live catalog
      setProducts(found);
    } catch {
      setProducts([]);
    }
  }, [excludeId, catalog]);

  return products;
}
