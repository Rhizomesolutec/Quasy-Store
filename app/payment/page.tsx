"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageHero } from "@/components/ui/PageHero";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { buildOrderWhatsAppUrl, isWhatsAppConfigured } from "@/lib/whatsapp";

type ShippingZone = "domestic" | "international";

const STORAGE_SESSION_KEY = "qusay_demo_session_v1";

function readSessionEmail() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(STORAGE_SESSION_KEY) || "";
}

export default function PaymentPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();

  // Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(readSessionEmail);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [shippingZone, setShippingZone] = useState<ShippingZone>("domestic");

  // Transaction States
  const [processing, setProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Redirect if cart is empty and checkout hasn't succeeded
  useEffect(() => {
    if (cart.length === 0 && !checkoutSuccess) {
      router.push("/cart");
    }
  }, [cart, checkoutSuccess, router]);

  const shipping = cart.length === 0 ? 0 : shippingZone === "domestic" ? 8 : 24;
  const total = subtotal + shipping;

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    const orderNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `QS-${orderNum}`;

    // Built before the cart is cleared so the message still has the line items.
    const messageUrl = buildOrderWhatsAppUrl({
      orderId,
      customerName: fullName.trim(),
      customerPhone: phone.trim(),
      customerEmail: email.trim(),
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      shippingZone,
      items: cart.map((item) => ({
        name: item.name,
        variant: item.variant,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      shipping,
      total,
    });

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orderId,
          customerName: fullName.trim(),
          customerEmail: email.trim(),
          customerPhone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          postalCode: postalCode.trim(),
          shippingZone,
          paymentMethod: "whatsapp",
          items: cart,
          total,
        }),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(result?.error || "Failed to register your order. Please try again.");
        setProcessing(false);
        return;
      }

      const savedId = result?.order?.id || orderId;
      setGeneratedOrderId(savedId);
      setWhatsappUrl(messageUrl);

      try {
        localStorage.setItem(STORAGE_SESSION_KEY, email.trim());
      } catch {
        // ignore
      }

      setCheckoutSuccess(true);
      clearCart();

      // Blocked popups are fine — the success screen shows the same link.
      window.open(messageUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Checkout submission failed:", err);
      setError("Checkout failed due to an unexpected error.");
      setProcessing(false);
    }
  };

  return (
    <main className="relative w-full flex flex-col items-center">
      <div className="bg-noise" />
      <PageHero
        eyebrow="Complete Your Order"
        title="Checkout & Payment"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
        bgImage={encodeURI("/images/Nacklace/Bracelet/Bracelet 4.webp")}
      />

      <section className="w-full px-4 md:px-12 lg:px-24 py-16 pb-24 max-w-6xl">
        <AnimatePresence mode="wait">
          {checkoutSuccess ? (
            /* SUCCESS OVERLAY */
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="border border-[#E50914]/20 bg-[#170909]/60 p-8 md:p-12 text-center max-w-2xl mx-auto space-y-6"
            >
              <span className="text-4xl text-[#E50914]">✦</span>
              <h2 className="font-heading text-3xl text-[#F5F2EF]">Order Registered</h2>
              <p className="font-sans text-sm text-[#F5F2EF]/70 max-w-md mx-auto leading-relaxed">
                Your order is saved under ID:
                <span className="font-mono block text-lg font-semibold text-[#E50914] mt-2 tracking-widest">
                  {generatedOrderId}
                </span>
              </p>

              <div className="border border-[#25D366]/30 bg-[#25D366]/[0.06] p-5 max-w-md mx-auto space-y-4">
                <p className="font-sans text-xs text-[#F5F2EF]/70 leading-relaxed">
                  Send us the order on WhatsApp to receive the payment details and
                  confirm dispatch. We reply with UPI or bank transfer options.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full border border-[#25D366] bg-[#25D366]/15 hover:bg-[#25D366] hover:text-[#070707] text-[#F5F2EF] px-6 py-3 text-xs uppercase tracking-widest transition-all duration-300"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.9-.95 1.08-.17.18-.35.2-.65.05-.3-.15-1.13-.42-2.15-1.33-.8-.71-1.33-1.59-1.48-1.89-.15-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.2 5.08 4.37.71.28 1.26.44 1.69.56.71.19 1.36.16 1.87.1.57-.07 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35z" />
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38a9.86 9.86 0 004.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.01h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.11.82.83-3.04-.19-.31a8.19 8.19 0 01-1.26-4.37c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.26.86 5.82 2.42a8.18 8.18 0 012.41 5.82c0 4.54-3.7 8.23-8.25 8.23z" />
                  </svg>
                  <span>Continue on WhatsApp</span>
                </a>
                <p className="font-sans text-[10px] text-[#F5F2EF]/40">
                  Didn&apos;t open automatically? Tap the button above.
                </p>
              </div>

              <div className="border-t border-white/[0.06] pt-6 max-w-xs mx-auto">
                <p className="font-sans text-xs text-[#F5F2EF]/40 uppercase tracking-widest">
                  Shipping updates will be sent to
                </p>
                <p className="font-mono text-xs text-[#F5F2EF]/70 mt-1">{email}</p>
                <p className="font-mono text-xs text-[#F5F2EF]/70">{phone}</p>
              </div>

              <div className="pt-4 flex justify-center gap-4">
                <Link
                  href="/shop"
                  className="border border-white/[0.08] hover:border-[#E50914] hover:text-[#E50914] px-6 py-3 text-xs uppercase tracking-widest transition-all duration-300"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/account"
                  className="border border-[#E50914] bg-[#E50914]/15 hover:bg-[#E50914] text-[#F5F2EF] px-6 py-3 text-xs uppercase tracking-widest transition-all duration-300"
                >
                  View My Vault
                </Link>
              </div>
            </motion.div>
          ) : (
            /* CHECKOUT FORM VIEW */
            <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">
              {/* Form Left Side */}
              <form onSubmit={handlePaymentSubmit} className="space-y-10">
                {/* Shipping Details */}
                <div className="space-y-5">
                  <h3 className="font-heading text-lg text-[#F5F2EF] border-b border-white/[0.06] pb-2">
                    1. Shipping Destination
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-sans text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1.5">
                        Full Name
                      </label>
                      <input
                        id="checkout-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3.5 py-3 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50 transition-all font-sans"
                        placeholder="Alex Sterling"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1.5">
                        WhatsApp Number
                      </label>
                      <input
                        id="checkout-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3.5 py-3 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50 transition-all font-mono"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1.5">
                        Email Address
                      </label>
                      <input
                        id="checkout-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3.5 py-3 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50 transition-all font-sans"
                        placeholder="alex@example.com"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-sans text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1.5">
                        Street Address
                      </label>
                      <input
                        id="checkout-address"
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3.5 py-3 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50 transition-all font-sans"
                        placeholder="14 Cathedral Row, Suite 3"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1.5">
                        City
                      </label>
                      <input
                        id="checkout-city"
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3.5 py-3 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50 transition-all font-sans"
                        placeholder="New Haven Quarter"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1.5">
                        Postal Code
                      </label>
                      <input
                        id="checkout-postal"
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3.5 py-3 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50 transition-all font-sans font-mono"
                        placeholder="NH 06510"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-sans text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1.5">
                        Shipping Zone
                      </label>
                      <select
                        id="checkout-shipping-zone"
                        value={shippingZone}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "domestic" || value === "international") {
                            setShippingZone(value);
                          }
                        }}
                        className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3.5 py-3 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50 transition-all"
                      >
                        <option value="domestic">Domestic Shipping — {formatPrice(8)} (2–4 days)</option>
                        <option value="international">International Shipping — {formatPrice(24)} (5–9 days)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment via WhatsApp */}
                <div className="space-y-5">
                  <h3 className="font-heading text-lg text-[#F5F2EF] border-b border-white/[0.06] pb-2">
                    2. Payment via WhatsApp
                  </h3>

                  <div className="bg-[#141414] border border-white/[0.04] p-6 space-y-5">
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38a9.86 9.86 0 004.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.01h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.11.82.83-3.04-.19-.31a8.19 8.19 0 01-1.26-4.37c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.26.86 5.82 2.42a8.18 8.18 0 012.41 5.82c0 4.54-3.7 8.23-8.25 8.23z" />
                        </svg>
                      </span>
                      <div className="space-y-1">
                        <p className="font-sans text-sm text-[#F5F2EF]">
                          No card needed — we settle on WhatsApp
                        </p>
                        <p className="font-sans text-xs text-[#F5F2EF]/50 leading-relaxed">
                          Submitting sends your item list, quantities and total straight to
                          our store chat. We reply with UPI or bank transfer details and
                          confirm dispatch once payment lands.
                        </p>
                      </div>
                    </div>

                    <ol className="space-y-2.5 border-t border-white/[0.06] pt-5">
                      {[
                        "Your order is saved to our vault with a reference ID.",
                        "WhatsApp opens with the full order pre-filled.",
                        "Send the message and we share the payment details.",
                      ].map((step, idx) => (
                        <li key={step} className="flex gap-3 items-start">
                          <span className="font-mono text-[10px] text-[#E50914] pt-0.5">
                            0{idx + 1}
                          </span>
                          <span className="font-sans text-xs text-[#F5F2EF]/60 leading-relaxed">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {!isWhatsAppConfigured() && (
                    <p className="font-sans text-xs text-amber-400 bg-amber-950/20 border border-amber-800/30 p-3 leading-relaxed">
                      Store WhatsApp number is not configured. Set
                      <span className="font-mono"> NEXT_PUBLIC_WHATSAPP_NUMBER </span>
                      in your environment to enable the handoff.
                    </p>
                  )}

                  {error && (
                    <p className="font-sans text-xs text-red-400 bg-red-950/20 border border-red-800/30 p-3">
                      {error}
                    </p>
                  )}
                </div>

                {/* Complete Order Button */}
                <button
                  id="checkout-complete-order-btn"
                  type="submit"
                  disabled={processing}
                  className="w-full border border-[#25D366] bg-[#25D366]/15 hover:bg-[#25D366] hover:text-[#070707] text-[#F5F2EF] py-4 px-6 font-sans text-xs uppercase tracking-widest transition-all duration-300 hover:tracking-[0.15em] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#F5F2EF] border-t-transparent rounded-full animate-spin" />
                      <span>Forging Receipt...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38a9.86 9.86 0 004.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.01h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.11.82.83-3.04-.19-.31a8.19 8.19 0 01-1.26-4.37c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.26.86 5.82 2.42a8.18 8.18 0 012.41 5.82c0 4.54-3.7 8.23-8.25 8.23z" />
                      </svg>
                      <span>Submit Order on WhatsApp · {formatPrice(total)}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Order Summary Sidebar */}
              <aside className="border border-white/[0.08] bg-[#170909]/40 p-6 space-y-6 lg:sticky lg:top-24">
                <h3 className="font-heading text-sm uppercase tracking-widest text-[#F5F2EF] border-b border-white/[0.06] pb-2">
                  Order Details
                </h3>

                <div className="divide-y divide-white/[0.04] max-h-60 overflow-y-auto pr-2 space-y-3">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-3 pt-3 first:pt-0">
                      <div className="relative w-12 aspect-[4/5] bg-black rounded-sm overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <p className="font-sans text-xs text-[#F5F2EF] truncate">{item.name}</p>
                          <p className="font-sans text-[9px] text-[#F5F2EF]/40 uppercase tracking-widest mt-0.5">
                            Qty: {item.quantity} · {item.variant}
                          </p>
                        </div>
                        <p className="font-mono text-xs text-[#E50914]">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/[0.08] pt-4 space-y-2.5 font-sans text-xs uppercase tracking-widest text-[#F5F2EF]/60">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-[#F5F2EF]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-mono text-[#F5F2EF]">{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-4 border-t border-white/[0.08]">
                    <span className="text-[#F5F2EF]/80 font-semibold">Total</span>
                    <span className="font-mono text-xl text-[#E50914] font-semibold">{formatPrice(total)}</span>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
