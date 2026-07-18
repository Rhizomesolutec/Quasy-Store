"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { formatPrice, clamp } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Rating } from "@/components/ui/Rating";
import { Button } from "@/components/ui/Button";
import { trackRecentlyViewed } from "@/lib/useRecentlyViewed";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [color, setColor] = useState(0);
  const [size, setSize] = useState<string | undefined>(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const wished = isInWishlist(product.id);

  useEffect(() => {
    trackRecentlyViewed(product.id);
  }, [product.id]);

  useEffect(() => {
    const onScroll = () => setIsStickyBarVisible(window.scrollY > 560);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0],
        variant: product.colors[color]?.name ?? product.variantLabel,
        size,
      },
      quantity
    );
  };

  const onSale = !!product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <>
      <div className="flex flex-col">
        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#F5F2EF]/40 mb-2">
          {product.category} · {product.collection.replace("-", " ")}
        </span>
        <h1 className="font-heading text-3xl md:text-4xl text-[#F5F2EF] mb-3 leading-tight">{product.name}</h1>
        <Rating value={product.rating} count={product.reviewCount} size="md" />

        <div className="flex items-center gap-3 mt-4 mb-1">
          <span className="font-heading text-2xl text-[#FF2A45] drop-shadow-[0_0_6px_rgba(255,42,69,0.4)] tracking-wide">{formatPrice(product.price)}</span>
          {onSale && <span className="font-heading text-base text-[#F5F2EF]/40 line-through">{formatPrice(product.compareAtPrice!)}</span>}
          {onSale && (
            <span className="bg-[#E50914]/15 border border-[#E50914]/40 text-[#FF2A45] text-[10px] uppercase tracking-widest font-semibold px-2 py-1">
              Save {formatPrice(product.compareAtPrice! - product.price)}
            </span>
          )}
        </div>

        <p className="font-sans text-sm text-[#F5F2EF]/60 leading-relaxed mt-5 border-b border-[#F5F2EF]/10 pb-6">
          {product.tagline}
        </p>

        {/* Stock indicator */}
        <div className="flex items-center gap-2 mt-5">
          <span className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-600" : "bg-[#E50914]"}`} />
          <span className="font-sans text-xs uppercase tracking-widest text-[#F5F2EF]/60">
            {product.inStock
              ? product.stockCount <= 10
                ? `Only ${product.stockCount} left in stock`
                : "In Stock"
              : "Currently Out of Stock"}
          </span>
        </div>

        {/* Color selector */}
        <div className="mt-6">
          <p className="font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/40 mb-2.5">
            Finish — {product.colors[color]?.name}
          </p>
          <div className="flex gap-2.5">
            {product.colors.map((c, idx) => (
              <button
                key={c.name}
                onClick={() => setColor(idx)}
                aria-label={c.name}
                title={c.name}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  idx === color ? "border-[#E50914] scale-110" : "border-white/[0.15] hover:border-white/30"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        {/* Size selector */}
        {product.sizes.length > 0 && (
          <div className="mt-6">
            <p className="font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/40 mb-2.5">Size — {size}</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 text-xs border transition-colors ${
                    size === s ? "border-[#E50914] bg-[#E50914] text-[#F5F2EF]" : "border-white/[0.12] text-[#F5F2EF]/70 hover:border-[#E50914]/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity + Add to cart */}
        <div className="mt-8 flex items-stretch gap-3">
          <div className="flex items-center border border-white/[0.12]">
            <button
              onClick={() => setQuantity((q) => clamp(q - 1, 1, 99))}
              className="px-3.5 h-full text-[#F5F2EF]/60 hover:text-[#F5F2EF] transition-colors"
            >
              −
            </button>
            <span className="px-4 font-mono text-sm text-[#F5F2EF] min-w-[2.5rem] text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => clamp(q + 1, 1, 99))}
              className="px-3.5 h-full text-[#F5F2EF]/60 hover:text-[#F5F2EF] transition-colors"
            >
              +
            </button>
          </div>
          <Button variant="filled" size="lg" className="flex-1" disabled={!product.inStock} onClick={handleAddToCart}>
            {product.inStock ? "Add to Bag" : "Sold Out"}
          </Button>
          <button
            onClick={() =>
              toggleItem({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.images[0],
                variant: product.variantLabel,
              })
            }
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className="w-12 flex items-center justify-center border border-white/[0.12] text-[#F5F2EF] hover:border-[#E50914] transition-colors"
          >
            <svg className="w-5 h-5" fill={wished ? "#E50914" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 21s-7.5-4.6-10-9.3C.5 8 2 4 6 4c2.2 0 3.7 1.2 4.5 2.4C11.3 5.2 12.8 4 15 4c4 0 5.5 4 4 7.7-2.5 4.7-10 9.3-10 9.3z"
              />
            </svg>
          </button>
        </div>

        <p className="font-sans text-[10px] text-[#F5F2EF]/40 italic leading-relaxed mt-4">{product.shippingInfo}</p>
      </div>

      {/* Sticky Add to Cart Bar */}
      <div
        className={`fixed bottom-0 left-0 w-full z-30 bg-[#170909]/95 backdrop-blur-md border-t border-white/[0.08] transition-transform duration-300 ${
          isStickyBarVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-12 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-heading text-sm text-[#F5F2EF] truncate">{product.name}</span>
            <span className="font-heading text-sm text-[#FF2A45] drop-shadow-[0_0_4px_rgba(255,42,69,0.35)] flex-shrink-0">{formatPrice(product.price)}</span>
          </div>
          <Button variant="filled" size="sm" disabled={!product.inStock} onClick={handleAddToCart} className="flex-shrink-0">
            {product.inStock ? "Add to Bag" : "Sold Out"}
          </Button>
        </div>
      </div>
    </>
  );
}
