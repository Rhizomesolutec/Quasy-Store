"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

type PaymentMethod = "card" | "upi" | "netbanking";

const STORAGE_SESSION_KEY = "quasy_demo_session_v1";

export default function PaymentPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();

  // Redirect if cart is empty and checkout hasn't succeeded
  useEffect(() => {
    if (cart.length === 0 && !checkoutSuccess) {
      router.push("/cart");
    }
  }, [cart]);

  // Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [shippingZone, setShippingZone] = useState<"domestic" | "international">("domestic");

  // Payment Selection State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  // Credit Card Form States
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // UPI Form States
  const [upiId, setUpiId] = useState("");
  const [selectedUpiApp, setSelectedUpiApp] = useState<"gpay" | "phonepe" | "paytm" | "upi">("gpay");

  // Transaction States
  const [processing, setProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");

  // Populate from local storage session if available
  useEffect(() => {
    const savedEmail = localStorage.getItem(STORAGE_SESSION_KEY);
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const shipping = cart.length === 0 ? 0 : shippingZone === "domestic" ? 8 : 24;
  const total = subtotal + shipping;

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // 1. Generate Order ID (QS-10XXX)
      const orderNum = Math.floor(10000 + Math.random() * 90000);
      const orderId = `QS-${orderNum}`;
      setGeneratedOrderId(orderId);

      // 2. Insert User Profile Details
      const { error: profileError } = await supabase.from("profiles").upsert([
        {
          email: email.trim(),
          fullName: fullName.trim(),
          address: address.trim(),
          city: city.trim(),
          postalCode: postalCode.trim(),
        },
      ]);

      if (profileError) {
        console.error("Failed to upsert profile:", profileError);
      }

      // 3. Insert Purchase Order Details
      const { error: orderError } = await supabase.from("orders").insert([
        {
          id: orderId,
          customerName: fullName.trim(),
          customerEmail: email.trim(),
          items: cart, // Store full array of products
          total: total,
          status: "Pending",
          date: new Date().toISOString().split("T")[0],
        },
      ]);

      if (orderError) {
        alert("Failed to register order: " + orderError.message);
        setProcessing(false);
        return;
      }

      // 4. Trigger Success State
      setCheckoutSuccess(true);
      clearCart();
    } catch (err) {
      console.error("Checkout submission failed:", err);
      alert("Checkout failed due to an unexpected error.");
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
        bgImage={encodeURI("/images/Nacklace/Bracelet/Bracelet 4.jpg")}
      />

      <section className="w-full px-4 md:px-12 lg:px-24 py-16 pb-24 max-w-6xl">
        <AnimatePresence mode="wait">
          {checkoutSuccess ? (
            /* SUCCESS OVERLAY */
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="border border-[#8E1F1F]/20 bg-[#161616]/60 p-8 md:p-12 text-center max-w-2xl mx-auto space-y-6"
            >
              <span className="text-4xl text-[#8E1F1F]">✦</span>
              <h2 className="font-heading text-3xl text-[#D8CFC0]">Order Placed Successfully</h2>
              <p className="font-sans text-sm text-[#D8CFC0]/70 max-w-md mx-auto leading-relaxed">
                The order has been forged. Your confirmation receipt is registered under ID: 
                <span className="font-mono block text-lg font-semibold text-[#8E1F1F] mt-2 tracking-widest">
                  {generatedOrderId}
                </span>
              </p>
              <div className="border-t border-white/[0.06] pt-6 max-w-xs mx-auto">
                <p className="font-sans text-xs text-[#D8CFC0]/40 uppercase tracking-widest">
                  Shipping updates will be sent to
                </p>
                <p className="font-mono text-xs text-[#D8CFC0]/70 mt-1">{email}</p>
              </div>
              <div className="pt-4 flex justify-center gap-4">
                <Link
                  href="/shop"
                  className="border border-white/[0.08] hover:border-[#8E1F1F] hover:text-[#8E1F1F] px-6 py-3 text-xs uppercase tracking-widest transition-all duration-300"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/account"
                  className="border border-[#8E1F1F] bg-[#8E1F1F]/15 hover:bg-[#8E1F1F] text-[#D8CFC0] px-6 py-3 text-xs uppercase tracking-widest transition-all duration-300"
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
                  <h3 className="font-heading text-lg text-[#D8CFC0] border-b border-white/[0.06] pb-2">
                    1. Shipping Destination
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-sans text-[9px] uppercase tracking-widest text-[#D8CFC0]/40 mb-1.5">
                        Full Name
                      </label>
                      <input
                        id="checkout-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-white/[0.08] px-3.5 py-3 text-sm text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/50 transition-all font-sans"
                        placeholder="Alex Sterling"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-sans text-[9px] uppercase tracking-widest text-[#D8CFC0]/40 mb-1.5">
                        Email Address
                      </label>
                      <input
                        id="checkout-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-white/[0.08] px-3.5 py-3 text-sm text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/50 transition-all font-sans"
                        placeholder="alex@example.com"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-sans text-[9px] uppercase tracking-widest text-[#D8CFC0]/40 mb-1.5">
                        Street Address
                      </label>
                      <input
                        id="checkout-address"
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-white/[0.08] px-3.5 py-3 text-sm text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/50 transition-all font-sans"
                        placeholder="14 Cathedral Row, Suite 3"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-[9px] uppercase tracking-widest text-[#D8CFC0]/40 mb-1.5">
                        City
                      </label>
                      <input
                        id="checkout-city"
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-white/[0.08] px-3.5 py-3 text-sm text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/50 transition-all font-sans"
                        placeholder="New Haven Quarter"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-[9px] uppercase tracking-widest text-[#D8CFC0]/40 mb-1.5">
                        Postal Code
                      </label>
                      <input
                        id="checkout-postal"
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-white/[0.08] px-3.5 py-3 text-sm text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/50 transition-all font-sans font-mono"
                        placeholder="NH 06510"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-sans text-[9px] uppercase tracking-widest text-[#D8CFC0]/40 mb-1.5">
                        Shipping Zone
                      </label>
                      <select
                        id="checkout-shipping-zone"
                        value={shippingZone}
                        onChange={(e) => setShippingZone(e.target.value as any)}
                        className="w-full bg-[#1a1a1a] border border-white/[0.08] px-3.5 py-3 text-sm text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/50 transition-all"
                      >
                        <option value="domestic">Domestic Shipping — {formatPrice(8)} (2–4 days)</option>
                        <option value="international">International Shipping — {formatPrice(24)} (5–9 days)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-5">
                  <h3 className="font-heading text-lg text-[#D8CFC0] border-b border-white/[0.06] pb-2">
                    2. Payment Portal
                  </h3>

                  {/* Tabs */}
                  <div className="grid grid-cols-3 gap-2 border-b border-white/[0.06] pb-4">
                    {(["card", "upi", "netbanking"] as PaymentMethod[]).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2.5 text-[10px] uppercase tracking-widest transition-all duration-200 border-b cursor-pointer text-center ${
                          paymentMethod === method
                            ? "text-[#8E1F1F] border-[#8E1F1F]"
                            : "text-[#D8CFC0]/40 hover:text-[#D8CFC0] border-transparent"
                        }`}
                      >
                        {method === "card" ? "Credit Card" : method === "upi" ? "UPI ID" : "Net Banking"}
                      </button>
                    ))}
                  </div>

                  {/* Method Content */}
                  <div className="bg-[#141414] border border-white/[0.04] p-6">
                    {paymentMethod === "card" && (
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block font-sans text-[8px] uppercase tracking-widest text-[#D8CFC0]/40 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            required={paymentMethod === "card"}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim().slice(0, 19))}
                            className="w-full bg-[#1e1e1e] border border-white/[0.06] px-3 py-2.5 text-xs text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/40 font-mono"
                            placeholder="4000 1234 5678 9010"
                          />
                        </div>
                        <div>
                          <label className="block font-sans text-[8px] uppercase tracking-widest text-[#D8CFC0]/40 mb-1">
                            Expiration Date
                          </label>
                          <input
                            type="text"
                            required={paymentMethod === "card"}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value.replace(/\//g, "").replace(/(\d{2})/, "$1/").trim().slice(0, 5))}
                            className="w-full bg-[#1e1e1e] border border-white/[0.06] px-3 py-2.5 text-xs text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/40 font-mono"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block font-sans text-[8px] uppercase tracking-widest text-[#D8CFC0]/40 mb-1">
                            CVV / CVC
                          </label>
                          <input
                            type="password"
                            required={paymentMethod === "card"}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                            className="w-full bg-[#1e1e1e] border border-white/[0.06] px-3 py-2.5 text-xs text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/40 font-mono"
                            placeholder="•••"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block font-sans text-[8px] uppercase tracking-widest text-[#D8CFC0]/40 mb-1">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            required={paymentMethod === "card"}
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="w-full bg-[#1e1e1e] border border-white/[0.06] px-3 py-2.5 text-xs text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/40"
                            placeholder="Alex Sterling"
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === "upi" && (
                      <div className="space-y-4">
                        {/* Selector */}
                        <div className="grid grid-cols-4 gap-2 pt-1">
                          {[
                            {
                              id: "gpay",
                              name: "GPay",
                              logo: (
                                <svg viewBox="0 0 40 16" fill="none" className="h-3.5 w-auto">
                                  <path d="M5.5 8c0-.6.1-1.1.4-1.6l-3.6-2.8C1 5 0 6.4 0 8c0 1.6 1 3 2.3 4.4l3.6-2.8c-.3-.5-.4-1-.4-1.6z" fill="#EA4335"/>
                                  <path d="M5.5 8c0 .6.1 1.1.4 1.6l3.6 2.8c1.3-1.4 2.3-2.8 2.3-4.4 0-1.6-1-3-2.3-4.4L5.9 6.4c-.3.5-.4 1-.4 1.6z" fill="#34A853"/>
                                  <path d="M8 0C4.4 0 1.4 2.3.4 5.6l3.6 2.8C4.7 6 6.2 4.5 8 4.5c2 0 3.7 1.5 4.3 3.5l3.6-2.8C14.6 2.3 11.6 0 8 0z" fill="#4285F4"/>
                                  <path d="M8 16c3.6 0 6.6-2.3 7.6-5.6l-3.6-2.8c-.6 2-2.3 3.5-4.3 3.5-1.8 0-3.3-1.5-4-3.5l-3.6 2.8C1.4 13.7 4.4 16 8 16z" fill="#FBBC05"/>
                                  <text x="18" y="12" fill="#D8CFC0" fontFamily="sans-serif" fontSize="10" fontWeight="bold">Pay</text>
                                </svg>
                              )
                            },
                            {
                              id: "phonepe",
                              name: "PhonePe",
                              logo: (
                                <svg viewBox="0 0 54 16" fill="none" className="h-3.5 w-auto">
                                  <rect width="14" height="14" rx="3" fill="#5F259F" y="1" />
                                  <path d="M7 11c1.5 0 2.5-1 2.5-2.5S8.5 6 7 6H5v5h2zm-1-4h1c.8 0 1.3.4 1.3 1.2S7.8 9.5 7 9.5H6V7z" fill="white" />
                                  <text x="17" y="12" fill="#D8CFC0" fontFamily="sans-serif" fontSize="8" fontWeight="bold">PhonePe</text>
                                </svg>
                              )
                            },
                            {
                              id: "paytm",
                              name: "Paytm",
                              logo: (
                                <svg viewBox="0 0 42 16" fill="none" className="h-3.5 w-auto">
                                  <text x="0" y="12" fill="#00b9f5" fontFamily="sans-serif" fontSize="11" fontWeight="bold">pay</text>
                                  <text x="18" y="12" fill="#002e6e" fontFamily="sans-serif" fontSize="11" fontWeight="bold">tm</text>
                                </svg>
                              )
                            },
                            {
                              id: "upi",
                              name: "UPI",
                              logo: (
                                <svg viewBox="0 0 35 16" fill="none" className="h-3.5 w-auto">
                                  <path d="M2 14L8 2h3l-6 12H2z" fill="#097939" />
                                  <path d="M7 14l6-12h3l-6 12H7z" fill="#ED7D31" />
                                  <text x="17" y="12" fill="#D8CFC0" fontFamily="sans-serif" fontSize="9" fontWeight="bold">UPI</text>
                                </svg>
                              )
                            }
                          ].map((app) => (
                            <button
                              key={app.id}
                              type="button"
                              onClick={() => setSelectedUpiApp(app.id as any)}
                              className={`py-2.5 px-1 flex flex-col items-center justify-center gap-1.5 border transition-all duration-200 cursor-pointer rounded-sm ${
                                selectedUpiApp === app.id
                                  ? "border-[#8E1F1F] bg-[#8E1F1F]/10 text-white"
                                  : "border-white/[0.06] bg-[#1a1a1a] text-[#D8CFC0]/50 hover:border-white/20"
                              }`}
                            >
                              {app.logo}
                            </button>
                          ))}
                        </div>

                        <div>
                          <label className="block font-sans text-[8px] uppercase tracking-widest text-[#D8CFC0]/40 mb-1">
                            UPI ID
                          </label>
                          <input
                            type="text"
                            required={paymentMethod === "upi"}
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full bg-[#1e1e1e] border border-white/[0.06] px-3 py-2.5 text-xs text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/40 font-mono"
                            placeholder={
                              selectedUpiApp === "gpay"
                                ? "username@oksbi"
                                : selectedUpiApp === "phonepe"
                                ? "username@ybl"
                                : selectedUpiApp === "paytm"
                                ? "username@paytm"
                                : "username@upi"
                            }
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === "netbanking" && (
                      <div className="space-y-3">
                        <label className="block font-sans text-[8px] uppercase tracking-widest text-[#D8CFC0]/40 mb-1">
                          Select Bank
                        </label>
                        <select className="w-full bg-[#1e1e1e] border border-white/[0.06] px-3 py-2.5 text-xs text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/40">
                          <option>State Bank of India</option>
                          <option>HDFC Bank</option>
                          <option>ICICI Bank</option>
                          <option>Axis Bank</option>
                          <option>Federal Bank</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Complete Order Button */}
                <button
                  id="checkout-complete-order-btn"
                  type="submit"
                  disabled={processing}
                  className="w-full border border-[#8E1F1F] bg-[#8E1F1F]/15 hover:bg-[#8E1F1F] text-[#D8CFC0] py-4 px-6 font-sans text-xs uppercase tracking-widest transition-all duration-300 hover:tracking-[0.15em] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#D8CFC0] border-t-transparent rounded-full animate-spin" />
                      <span>Forging Receipt...</span>
                    </>
                  ) : (
                    <span>Complete Order · {formatPrice(total)}</span>
                  )}
                </button>
              </form>

              {/* Order Summary Sidebar */}
              <aside className="border border-white/[0.08] bg-[#161616]/40 p-6 space-y-6 lg:sticky lg:top-24">
                <h3 className="font-heading text-sm uppercase tracking-widest text-[#D8CFC0] border-b border-white/[0.06] pb-2">
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
                          <p className="font-sans text-xs text-[#D8CFC0] truncate">{item.name}</p>
                          <p className="font-sans text-[9px] text-[#D8CFC0]/40 uppercase tracking-widest mt-0.5">
                            Qty: {item.quantity} · {item.variant}
                          </p>
                        </div>
                        <p className="font-mono text-xs text-[#8E1F1F]">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/[0.08] pt-4 space-y-2.5 font-sans text-xs uppercase tracking-widest text-[#D8CFC0]/60">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-[#D8CFC0]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-mono text-[#D8CFC0]">{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-4 border-t border-white/[0.08]">
                    <span className="text-[#D8CFC0]/80 font-semibold">Total</span>
                    <span className="font-mono text-xl text-[#8E1F1F] font-semibold">{formatPrice(total)}</span>
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
