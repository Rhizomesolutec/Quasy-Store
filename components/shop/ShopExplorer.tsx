"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/ui/ProductCard";
import { QuickViewModal } from "./QuickViewModal";
import { ShopFilters, FilterState, PRICE_CEILING } from "./ShopFilters";
import { useRecentlyViewed } from "@/lib/useRecentlyViewed";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
] as const;

const PAGE_SIZE = 8;

export function ShopExplorer({ products, title }: { products: Product[]; title?: string }) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    colors: [],
    sizes: [],
    availability: "all",
    maxPrice: PRICE_CEILING,
  });
  const [sortBy, setSortBy] = useState<(typeof SORT_OPTIONS)[number]["value"]>("featured");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const recentlyViewed = useRecentlyViewed();

  const availableColors = useMemo(() => {
    const seen = new Map<string, { name: string; hex: string }>();
    products.forEach((p) => p.colors.forEach((c) => seen.set(c.name, c)));
    return Array.from(seen.values());
  }, [products]);

  const availableSizes = useMemo(() => {
    const seen = new Set<string>();
    products.forEach((p) => p.sizes.forEach((s) => seen.add(s)));
    return Array.from(seen.values());
  }, [products]);

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      if (filters.colors.length && !p.colors.some((c) => filters.colors.includes(c.name))) return false;
      if (filters.sizes.length && !p.sizes.some((s) => filters.sizes.includes(s))) return false;
      if (filters.availability === "in-stock" && !p.inStock) return false;
      if (filters.availability === "out-of-stock" && p.inStock) return false;
      if (p.price > filters.maxPrice) return false;
      return true;
    });

    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result = [...result].sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      default:
        break;
    }
    return result;
  }, [products, filters, sortBy]);

  const visibleProducts = filtered.slice(0, visibleCount);

  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Sticky Filter Sidebar (desktop) */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="sticky top-28">
            <ShopFilters
              filters={filters}
              setFilters={(updater) => {
                setFilters(updater);
                setVisibleCount(PAGE_SIZE);
              }}
              availableColors={availableColors}
              availableSizes={availableSizes}
              resultCount={filtered.length}
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {title && <h2 className="font-heading text-2xl text-[#D8CFC0] mb-6">{title}</h2>}

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06]">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-2 text-xs uppercase tracking-widest text-[#D8CFC0]/70 hover:text-[#D8CFC0] border border-white/[0.1] px-4 py-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              Filters
            </button>
            <p className="hidden md:block font-sans text-xs uppercase tracking-widest text-[#D8CFC0]/40">
              Showing {visibleProducts.length} of {filtered.length}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-[#1a1a1a] border border-white/[0.08] text-xs text-[#D8CFC0] px-3 py-2 outline-none focus:border-[#8E1F1F]/40 uppercase tracking-widest"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Grid */}
          {visibleProducts.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-heading text-xl text-[#D8CFC0] mb-2">No pieces match these filters</p>
              <p className="font-sans text-sm text-[#D8CFC0]/50">Try widening your price range or clearing a filter.</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              <AnimatePresence>
                {visibleProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} onQuickView={setQuickViewProduct} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Load More */}
          {visibleCount < filtered.length && (
            <div className="flex justify-center mt-16">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="border border-[#8E1F1F] px-8 py-3 text-xs tracking-widest uppercase text-[#D8CFC0] hover:bg-[#8E1F1F] transition-all duration-300"
              >
                Load More
              </button>
            </div>
          )}

          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <div className="mt-24 pt-12 border-t border-white/[0.06]">
              <h3 className="font-heading text-xl text-[#D8CFC0] mb-8">Recently Viewed</h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                {recentlyViewed.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-0 top-0 h-screen w-[85vw] max-w-sm bg-[#151515] border-r border-white/[0.08] shadow-2xl z-50 p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="font-heading text-sm uppercase tracking-widest text-[#D8CFC0]">Filter & Sort</span>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="text-[#D8CFC0] hover:text-[#8E1F1F] p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ShopFilters
                filters={filters}
                setFilters={(updater) => {
                  setFilters(updater);
                  setVisibleCount(PAGE_SIZE);
                }}
                availableColors={availableColors}
                availableSizes={availableSizes}
                resultCount={filtered.length}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </section>
  );
}
