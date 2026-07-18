"use client";

import { formatPrice } from "@/lib/utils";
import { CATEGORIES } from "@/lib/products";

export interface FilterState {
  categories: string[];
  colors: string[];
  sizes: string[];
  availability: "all" | "in-stock" | "out-of-stock";
  maxPrice: number;
}

export const PRICE_CEILING = 250;

interface ShopFiltersProps {
  filters: FilterState;
  setFilters: (updater: (prev: FilterState) => FilterState) => void;
  availableColors: { name: string; hex: string }[];
  availableSizes: string[];
  resultCount: number;
}

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function ShopFilters({ filters, setFilters, availableColors, availableSizes, resultCount }: ShopFiltersProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm uppercase tracking-widest text-[#F5F2EF]">Filters</h3>
        <button
          onClick={() =>
            setFilters(() => ({ categories: [], colors: [], sizes: [], availability: "all", maxPrice: PRICE_CEILING }))
          }
          className="font-sans text-[10px] uppercase tracking-widest text-[#E50914] hover:text-[#660000] transition-colors"
        >
          Reset
        </button>
      </div>

      <p className="font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/40">{resultCount} results</p>

      {/* Category */}
      <div>
        <p className="font-sans text-xs uppercase tracking-widest text-[#F5F2EF]/70 mb-3">Category</p>
        <div className="space-y-2.5">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => setFilters((prev) => ({ ...prev, categories: toggleValue(prev.categories, cat) }))}
                className="w-3.5 h-3.5 accent-[#E50914] bg-transparent border border-white/20"
              />
              <span className="font-sans text-xs text-[#F5F2EF]/70 group-hover:text-[#F5F2EF] transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="font-sans text-xs uppercase tracking-widest text-[#F5F2EF]/70 mb-3">
          Price — Up to {formatPrice(filters.maxPrice)}
        </p>
        <input
          type="range"
          min={20}
          max={PRICE_CEILING}
          step={5}
          value={filters.maxPrice}
          onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
          className="w-full accent-[#E50914]"
        />
      </div>

      {/* Color */}
      <div>
        <p className="font-sans text-xs uppercase tracking-widest text-[#F5F2EF]/70 mb-3">Finish</p>
        <div className="flex flex-wrap gap-2.5">
          {availableColors.map((color) => {
            const active = filters.colors.includes(color.name);
            return (
              <button
                key={color.name}
                onClick={() => setFilters((prev) => ({ ...prev, colors: toggleValue(prev.colors, color.name) }))}
                aria-label={color.name}
                title={color.name}
                className={`w-7 h-7 rounded-full border-2 transition-all ${active ? "border-[#E50914] scale-110" : "border-white/15"}`}
                style={{ backgroundColor: color.hex }}
              />
            );
          })}
        </div>
      </div>

      {/* Size */}
      {availableSizes.length > 0 && (
        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-[#F5F2EF]/70 mb-3">Size</p>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => {
              const active = filters.sizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => setFilters((prev) => ({ ...prev, sizes: toggleValue(prev.sizes, size) }))}
                  className={`px-3 py-1.5 text-xs border transition-colors ${
                    active ? "border-[#E50914] bg-[#E50914] text-[#F5F2EF]" : "border-white/[0.12] text-[#F5F2EF]/70 hover:border-[#E50914]/50"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Availability */}
      <div>
        <p className="font-sans text-xs uppercase tracking-widest text-[#F5F2EF]/70 mb-3">Availability</p>
        <div className="space-y-2.5">
          {(
            [
              ["all", "All"],
              ["in-stock", "In Stock"],
              ["out-of-stock", "Out of Stock"],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="availability"
                checked={filters.availability === value}
                onChange={() => setFilters((prev) => ({ ...prev, availability: value }))}
                className="w-3.5 h-3.5 accent-[#E50914] bg-transparent border border-white/20"
              />
              <span className="font-sans text-xs text-[#F5F2EF]/70 group-hover:text-[#F5F2EF] transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
