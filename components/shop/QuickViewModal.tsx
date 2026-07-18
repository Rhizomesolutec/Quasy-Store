"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Rating } from "@/components/ui/Rating";
import { Button } from "@/components/ui/Button";

export function QuickViewModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState(0);
  const [size, setSize] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (product) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resets local selection state when a new product opens
      setActiveImage(0);
      setColor(0);
      setSize(product.sizes[0]);
    }
  }, [product]);

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] w-[92vw] max-w-3xl max-h-[88vh] overflow-y-auto bg-[#170909] border border-white/[0.08] shadow-2xl p-6 md:p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close quick view"
              className="absolute top-4 right-4 text-[#F5F2EF] hover:text-[#E50914] transition-colors p-1 z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="relative aspect-[4/5] bg-black rounded-sm overflow-hidden">
                  <Image src={product.images[activeImage]} alt={product.name} fill className="object-cover" />
                </div>
                <div className="flex gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={img + idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative w-14 aspect-[4/5] rounded-sm overflow-hidden border ${
                        idx === activeImage ? "border-[#E50914]" : "border-white/[0.08]"
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#F5F2EF]/40 mb-2">
                  {product.category}
                </span>
                <h2 className="font-heading text-2xl text-[#F5F2EF] mb-2">{product.name}</h2>
                <Rating value={product.rating} count={product.reviewCount} />
                <div className="flex items-center gap-2 mt-3 mb-4">
                  <span className="font-heading text-xl text-[#FF2A45] drop-shadow-[0_0_6px_rgba(255,42,69,0.4)] tracking-wide">{formatPrice(product.price)}</span>
                  {product.compareAtPrice && (
                    <span className="font-heading text-sm text-[#F5F2EF]/40 line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                </div>
                <p className="font-sans text-sm text-[#F5F2EF]/60 leading-relaxed mb-5">{product.tagline}</p>

                <div className="mb-4">
                  <p className="font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/40 mb-2">
                    Finish — {product.colors[color]?.name}
                  </p>
                  <div className="flex gap-2">
                    {product.colors.map((c, idx) => (
                      <button
                        key={c.name}
                        onClick={() => setColor(idx)}
                        aria-label={c.name}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          idx === color ? "border-[#E50914] scale-110" : "border-white/[0.15]"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                {product.sizes.length > 0 && (
                  <div className="mb-6">
                    <p className="font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/40 mb-2">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className={`px-3 py-1.5 text-xs border transition-colors ${
                            size === s
                              ? "border-[#E50914] bg-[#E50914] text-[#F5F2EF]"
                              : "border-white/[0.12] text-[#F5F2EF]/70 hover:border-[#E50914]/50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-auto flex flex-col gap-3">
                  <Button
                    variant="filled"
                    size="lg"
                    disabled={!product.inStock}
                    onClick={() => {
                      addItem({
                        productId: product.id,
                        slug: product.slug,
                        name: product.name,
                        price: product.price,
                        image: product.images[0],
                        variant: product.colors[color]?.name ?? product.variantLabel,
                        size,
                      });
                      onClose();
                    }}
                  >
                    {product.inStock ? "Add to Bag" : "Sold Out"}
                  </Button>
                  <Link
                    href={`/shop/${product.slug}`}
                    onClick={onClose}
                    className="text-center font-sans text-xs uppercase tracking-widest text-[#F5F2EF]/60 hover:text-[#E50914] transition-colors"
                  >
                    View full details →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
