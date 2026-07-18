"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PRODUCTS } from "@/lib/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { EmptyState } from "@/components/ui/EmptyState";

const RECENT_KEY = "qusay_recent_searches_v1";
const POPULAR_SEARCHES = ["Spider Necklace", "Glow Necklace", "Silver Bracelet", "Midnight Coven", "Locket"];

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecent(query: string) {
  const current = readRecent();
  const next = [query, ...current.filter((q) => q.toLowerCase() !== query.toLowerCase())].slice(0, 6);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  return next;
}

export function SearchClient({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage, unavailable during SSR
    setRecent(readRecent());
  }, []);

  useEffect(() => {
    if (initialQuery.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- records the incoming ?q= as a recent search on navigation
      setRecent(saveRecent(initialQuery.trim()));
    }
  }, [initialQuery]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q)
    );
  }, [query]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 5);
  }, [query]);

  const runSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      setRecent(saveRecent(value.trim()));
      router.replace(`/search?q=${encodeURIComponent(value.trim())}`, { scroll: false });
    } else {
      router.replace("/search", { scroll: false });
    }
  };

  return (
    <div className="w-full">
      {/* Large animated search input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-2xl mx-auto mb-4"
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => runSearch(e.target.value)}
          placeholder="Search for spiders, silver, gold..."
          className="w-full bg-transparent border-b-2 border-[#F5F2EF]/20 focus:border-[#E50914] outline-none font-heading text-2xl md:text-4xl text-[#F5F2EF] placeholder-[#F5F2EF]/25 py-4 transition-colors"
        />
        <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 text-[#F5F2EF]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        {/* Suggestions dropdown */}
        {query.trim() && suggestions.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-[#170909] border border-white/[0.08] shadow-xl z-10 mt-1">
            {suggestions.map((s) => (
              <button
                key={s.id}
                onClick={() => runSearch(s.name)}
                className="w-full text-left px-5 py-3 text-sm text-[#F5F2EF]/70 hover:text-[#F5F2EF] hover:bg-white/[0.03] transition-colors font-sans"
              >
                {s.name} <span className="text-[#F5F2EF]/30 text-xs">— {s.category}</span>
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {!query.trim() ? (
        <div className="max-w-2xl mx-auto mt-16 space-y-10">
          {recent.length > 0 && (
            <div>
              <p className="font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/40 mb-3">Recent Searches</p>
              <div className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <button
                    key={r}
                    onClick={() => runSearch(r)}
                    className="px-4 py-2 text-xs border border-white/[0.1] text-[#F5F2EF]/70 hover:border-[#E50914] hover:text-[#F5F2EF] transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/40 mb-3">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((s) => (
                <button
                  key={s}
                  onClick={() => runSearch(s)}
                  className="px-4 py-2 text-xs border border-[#E50914]/30 text-[#F5F2EF]/70 hover:border-[#E50914] hover:text-[#F5F2EF] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
          title="No relics found"
          description={`Nothing matches "${query}". Try a category like Necklaces, Bracelets, or a collection name.`}
        />
      ) : (
        <div className="mt-16">
          <p className="font-sans text-xs uppercase tracking-widest text-[#F5F2EF]/40 mb-8 text-center">
            {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
          </p>
          <ProductGrid products={results} />
        </div>
      )}
    </div>
  );
}
