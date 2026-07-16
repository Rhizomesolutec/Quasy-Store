"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PageHero } from "@/components/ui/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton, Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { getBestSellers } from "@/lib/products";

const VALID_COUPONS: Record<string, number> = {
  QUSAY10: 0.1,
  RELIC15: 0.15,
};

const SHIPPING_RATES: Record<string, number> = {
  domestic: 8,
  international: 24,
};

export default function CartPage() {
  const { cart, updateQuantity, removeItem, subtotal } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; rate: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [shippingZone, setShippingZone] = useState<"domestic" | "international">("domestic");

  const discount = appliedCoupon ? subtotal * appliedCoupon.rate : 0;
  const shipping = cart.length === 0 ? 0 : SHIPPING_RATES[shippingZone];
  const total = subtotal - discount + shipping;

  const recommended = useMemo(() => {
    const cartIds = new Set(cart.map((c) => c.productId));
    return getBestSellers().filter((p) => !cartIds.has(p.id)).slice(0, 4);
  }, [cart]);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      setAppliedCoupon({ code, rate: VALID_COUPONS[code] });
      setCouponError("");
    } else {
      setCouponError("Invalid or expired code.");
      setAppliedCoupon(null);
    }
  };

  return (
    <main className="relative w-full flex flex-col items-center">
      <div className="bg-noise" />
      <PageHero
        eyebrow="Review Your Order"
        title="Shopping Bag"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]}
        bgImage={encodeURI("/images/Nacklace/Bracelet/Bracelet 2.jpg")}
      />

      <section className="w-full px-4 md:px-12 lg:px-24 py-16 pb-24 max-w-6xl">
        {cart.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
            title="Your bag is empty"
            description="Add a piece from the catalog to begin your order."
            action={
              <LinkButton href="/shop" variant="outline" size="md">
                Browse the Shop
              </LinkButton>
            }
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.variant}-${item.size ?? ""}`} className="flex gap-4 md:gap-6 border-b border-white/[0.06] pb-6">
                  <Link href={`/shop/${item.slug}`} className="relative w-24 md:w-28 aspect-[4/5] bg-black rounded-sm overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <Link href={`/shop/${item.slug}`} className="font-heading text-lg text-[#D8CFC0] hover:text-[#8E1F1F] transition-colors">
                        {item.name}
                      </Link>
                      <p className="font-sans text-[10px] uppercase tracking-widest text-[#D8CFC0]/40 mt-1">
                        {item.variant}
                        {item.size ? ` · ${item.size}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-white/[0.1]">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variant, item.size, -1)}
                          className="px-3 py-1.5 text-[#D8CFC0]/60 hover:text-[#D8CFC0] text-sm"
                        >
                          −
                        </button>
                        <span className="px-3 font-mono text-sm text-[#D8CFC0]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variant, item.size, 1)}
                          className="px-3 py-1.5 text-[#D8CFC0]/60 hover:text-[#D8CFC0] text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.variant, item.size)}
                        className="font-sans text-[10px] uppercase tracking-widest text-[#D8CFC0]/40 hover:text-[#8E1F1F] transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="font-mono text-sm text-[#D8CFC0] flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-6">
              <div className="border border-white/[0.08] p-6 space-y-5">
                <h3 className="font-heading text-sm uppercase tracking-widest text-[#D8CFC0]">Order Summary</h3>

                {/* Coupon */}
                <div>
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon code"
                      className="flex-1 bg-[#1a1a1a] border border-white/[0.08] px-3 py-2 text-xs text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/50"
                    />
                    <Button variant="outline" size="sm" onClick={handleApplyCoupon}>
                      Apply
                    </Button>
                  </div>
                  {couponError && <p className="font-sans text-[10px] text-[#8E1F1F] mt-2">{couponError}</p>}
                  {appliedCoupon && (
                    <p className="font-sans text-[10px] text-green-500 mt-2">
                      Code {appliedCoupon.code} applied — {Math.round(appliedCoupon.rate * 100)}% off.
                    </p>
                  )}
                  <p className="font-sans text-[9px] text-[#D8CFC0]/30 mt-2">Try QUSAY10 or RELIC15</p>
                </div>

                {/* Shipping estimator */}
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-[#D8CFC0]/50 mb-2">Estimate Shipping</p>
                  <select
                    value={shippingZone}
                    onChange={(e) => setShippingZone(e.target.value as "domestic" | "international")}
                    className="w-full bg-[#1a1a1a] border border-white/[0.08] px-3 py-2 text-xs text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/50"
                  >
                    <option value="domestic">Domestic — {formatPrice(SHIPPING_RATES.domestic)}</option>
                    <option value="international">International — {formatPrice(SHIPPING_RATES.international)}</option>
                  </select>
                </div>

                <div className="space-y-2 pt-4 border-t border-white/[0.06] font-sans text-xs uppercase tracking-widest text-[#D8CFC0]/60">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-[#D8CFC0]">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount</span>
                      <span className="font-mono">−{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-mono text-[#D8CFC0]">{formatPrice(shipping)}</span>
                  </div>
                </div>

                <motion.div
                  key={total}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-between items-baseline pt-4 border-t border-white/[0.08]"
                >
                  <span className="font-sans text-xs uppercase tracking-widest text-[#D8CFC0]/70">Total</span>
                  <span className="font-mono text-2xl text-[#8E1F1F]">{formatPrice(total)}</span>
                </motion.div>

                <LinkButton href="/payment" variant="filled" size="lg" className="w-full text-center">
                  Proceed to Checkout
                </LinkButton>
              </div>
            </div>
          </div>
        )}
      </section>

      {recommended.length > 0 && (
        <section className="w-full px-4 md:px-12 lg:px-24 pb-24 max-w-7xl border-t border-white/[0.06] pt-16">
          <h2 className="font-heading text-2xl text-[#D8CFC0] text-center mb-12">You Might Also Like</h2>
          <ProductGrid products={recommended} />
        </section>
      )}
    </main>
  );
}
