"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import { Rating } from "./Rating";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { isInWishlist, toggleItem } = useWishlist();
  const wished = isInWishlist(product.id);
  const onSale = !!product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-[4/5] bg-black rounded-sm overflow-hidden border border-white/[0.05]">
        <Link href={`/shop/${product.slug}`} className="block absolute inset-0 z-10" aria-label={product.name} />

        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover opacity-90 transition-all duration-700 ${
            product.images[1] ? "group-hover:opacity-0" : "group-hover:scale-110 group-hover:opacity-100"
          }`}
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-90"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          {onSale && (
            <span className="bg-[#8E1F1F] text-[#D8CFC0] text-[9px] uppercase tracking-widest font-semibold px-2 py-1">
              Sale
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#D8CFC0]/10 border border-[#D8CFC0]/30 text-[#D8CFC0] text-[9px] uppercase tracking-widest font-semibold px-2 py-1 backdrop-blur-sm">
              New
            </span>
          )}
          {!product.inStock && (
            <span className="bg-black/70 border border-white/[0.1] text-[#D8CFC0]/70 text-[9px] uppercase tracking-widest font-semibold px-2 py-1">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Toggle */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleItem({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.images[0],
              variant: product.variantLabel,
            });
          }}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 z-20 p-1.5 text-[#D8CFC0] hover:text-[#8E1F1F] transition-colors"
        >
          <svg className="w-5 h-5" fill={wished ? "#8E1F1F" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 21s-7.5-4.6-10-9.3C.5 8 2 4 6 4c2.2 0 3.7 1.2 4.5 2.4C11.3 5.2 12.8 4 15 4c4 0 5.5 4 4 7.7-2.5 4.7-10 9.3-10 9.3z"
            />
          </svg>
        </button>

        {/* Quick View */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onQuickView(product);
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-[#111111]/90 border border-white/[0.1] text-[#D8CFC0] text-[10px] uppercase tracking-widest px-4 py-2 hover:border-[#8E1F1F] whitespace-nowrap"
          >
            Quick View
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#D8CFC0]/40">{product.category}</span>
        <Link href={`/shop/${product.slug}`} className="font-heading text-lg text-[#D8CFC0] leading-tight hover:text-[#8E1F1F] transition-colors">
          {product.name}
        </Link>
        <Rating value={product.rating} count={product.reviewCount} />
        <div className="flex items-center gap-2 pt-0.5">
          <span className="font-sans text-sm text-[#D8CFC0]">{formatPrice(product.price)}</span>
          {onSale && (
            <span className="font-sans text-xs text-[#D8CFC0]/40 line-through">{formatPrice(product.compareAtPrice!)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
