"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/utils";

const SHOP_LINKS = [
  { label: "Shop All", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "Collections", href: "/collections" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Best Sellers", href: "/best-sellers" },
];

const PRIMARY_LINKS = [{ label: "About", href: "/about" }, { label: "Contact", href: "/contact" }];

const MOBILE_LINKS = [
  { label: "Shop All", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Account", href: "/account" },
];

export default function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);

  const {
    cart,
    isCartOpen,
    openCart,
    closeCart,
    updateQuantity,
    removeItem,
    totalItems: cartTotalItems,
    subtotal: cartSubtotal,
    checkoutStep,
    startCheckout,
    resetCheckout,
  } = useCart();
  const { wishlist } = useWishlist();

  // Track page scroll to shrink and blur navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(searchValue.trim() ? `/search?q=${encodeURIComponent(searchValue.trim())}` : "/search");
    setIsSearchOpen(false);
    setSearchValue("");
  };

  // Nav link animations
  const linkVariants = {
    hover: {
      color: "#E50914",
      textShadow: "0 0 8px rgba(229, 9, 20, 0.6)",
      transition: { duration: 0.2 },
    },
  };

  const borderVariants = {
    initial: { scaleX: 0 },
    hover: { scaleX: 1, transition: { duration: 0.3 } },
  };

  return (
    <>
      {/* Sticky Main Navigation */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 font-sans ${isScrolled
          ? "py-4 bg-[#0b0b0b]/85 backdrop-blur-md border-b border-[#E50914]/20 shadow-lg shadow-black/35"
          : "py-6 bg-transparent border-b border-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
          {/* Mobile Hamburguer Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col justify-center items-start gap-1.5 w-6 h-6 focus:outline-none group"
            aria-label="Toggle Menu"
          >
            <span className={`h-[1px] bg-[#F5F2EF] transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-[5px] w-6" : "w-6 group-hover:w-4"}`} />
            <span className={`h-[1px] bg-[#F5F2EF] transition-all duration-300 ${isMobileMenuOpen ? "opacity-0 w-0" : "w-4 group-hover:w-6"}`} />
          </button>

          {/* Nav Links (Desktop Left) */}
          <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#F5F2EF]/70">
            {/* Shop mega-menu trigger */}
            <div
              className="relative"
              onMouseEnter={() => setIsShopMenuOpen(true)}
              onMouseLeave={() => setIsShopMenuOpen(false)}
            >
              <Link href="/shop" className="relative py-1 cursor-pointer select-none group inline-flex items-center gap-1">
                <motion.span variants={linkVariants} whileHover="hover">
                  Shop
                </motion.span>
                <svg className={`w-3 h-3 transition-transform duration-300 ${isShopMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <motion.span
                  variants={borderVariants}
                  initial="initial"
                  animate={isShopMenuOpen ? "hover" : "initial"}
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-[#E50914] origin-left"
                />
              </Link>

              <AnimatePresence>
                {isShopMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-0 pt-3 w-56"
                  >
                    <div className="bg-[#070707]/95 backdrop-blur-md border border-white/[0.08] shadow-xl py-2">
                      {SHOP_LINKS.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] text-[#F5F2EF]/70 hover:text-[#E50914] hover:bg-white/[0.03] transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {PRIMARY_LINKS.map((link) => (
              <motion.div key={link.href} className="relative py-1">
                <Link href={link.href} className="relative cursor-pointer select-none group">
                  <motion.span variants={linkVariants} whileHover="hover">
                    {link.label}
                  </motion.span>
                  <motion.span
                    variants={borderVariants}
                    className="absolute bottom-0 left-0 w-full h-[1px] bg-[#E50914] origin-left"
                    style={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Branding Logo (Centered) */}
          <Link
            href="/"
            className={`absolute left-1/2 -translate-x-1/2 font-heading text-xl md:text-2xl text-[#E50914] tracking-[0.25em] font-bold drop-shadow-[0_0_8px_rgba(229,9,20,0.5)] hover:text-[#FF3B5C] hover:drop-shadow-[0_0_12px_rgba(229,9,20,0.75)] transition-all duration-300 ${
              isSearchOpen ? "hidden md:block" : "block"
            }`}
          >
            QUSAY STORE
          </Link>

          {/* Action Utilities (Right) */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            {/* Slide-Open Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 140, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    type="text"
                    autoFocus
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search relics..."
                    className="bg-[#1A0A0A]/90 border border-white/[0.12] rounded px-3 py-1 text-xs text-[#F5F2EF] placeholder-[#F5F2EF]/40 outline-none focus:border-[#E50914]/60 mr-1.5 max-xs:w-28"
                  />
                )}
              </AnimatePresence>
              <button
                type={isSearchOpen ? "submit" : "button"}
                onClick={() => {
                  if (!isSearchOpen) setIsSearchOpen(true);
                }}
                className="text-[#F5F2EF] hover:text-[#E50914] transition-colors p-1 flex items-center justify-center cursor-pointer select-none"
                aria-label="Search"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="4" width="10" height="10" strokeWidth="2" />
                  <line x1="12" y1="12" x2="19" y2="19" strokeWidth="3" />
                </svg>
              </button>
              {isSearchOpen && (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-[#F5F2EF]/50 hover:text-[#E50914] text-xs p-1 ml-0.5"
                  aria-label="Close search"
                >
                  ✕
                </button>
              )}
            </form>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="hidden sm:block relative text-[#F5F2EF] hover:text-[#E50914] transition-colors p-1 select-none"
              aria-label="Wishlist"
            >
              <svg className="w-5 h-5" viewBox="0 0 9 9" fill="currentColor">
                <rect x="1" y="1" width="2" height="2" />
                <rect x="6" y="1" width="2" height="2" />
                <rect x="0" y="3" width="9" height="2" />
                <rect x="1" y="5" width="7" height="1" />
                <rect x="2" y="6" width="5" height="1" />
                <rect x="3" y="7" width="3" height="1" />
                <rect x="4" y="8" width="1" height="1" />
              </svg>
              <AnimatePresence>
                {wishlist.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#E50914] text-[#F5F2EF] rounded-full text-[8px] font-pixel font-bold flex items-center justify-center"
                  >
                    {wishlist.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Profile Link */}
            <Link
              href="/account"
              className="hidden sm:block text-[#F5F2EF] hover:text-[#E50914] transition-colors p-1 select-none"
              aria-label="Account"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                <rect x="3" y="4" width="18" height="12" />
                <rect x="5" y="6" width="14" height="8" />
                <path d="M8 16l-2 4h12l-2-4" />
                <line x1="8" y1="10" x2="11" y2="10" strokeWidth="1.5" />
              </svg>
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative text-[#F5F2EF] hover:text-[#E50914] transition-colors p-1 flex items-center select-none cursor-pointer"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                <path d="M3 3h3l3 12h10l3-8H8" />
                <circle cx="9" cy="19" r="1.5" fill="currentColor" />
                <circle cx="17" cy="19" r="1.5" fill="currentColor" />
              </svg>
              {/* Badge */}
              <AnimatePresence>
                {cartTotalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 right-0 sm:-right-1.5 w-4 h-4 bg-[#E50914] text-[#F5F2EF] rounded-full text-[8px] font-pixel font-bold flex items-center justify-center"
                  >
                    {cartTotalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Slide-Out Curtain */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#070707] z-50 flex flex-col justify-center items-center gap-5 overflow-y-auto py-24"
          >
            {/* Close Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 text-[#F5F2EF] hover:text-[#E50914] transition-colors p-2"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Menu Items */}
            {MOBILE_LINKS.map((link, idx) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-heading text-xl md:text-2xl tracking-widest text-[#F5F2EF] hover:text-[#E50914] transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shopping Cart Drawer Overlay & Sliding Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Background Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 h-screen w-full sm:w-[420px] bg-[#170909] border-l border-white/[0.08] shadow-2xl z-50 flex flex-col p-6 text-left"
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center pb-6 border-b border-white/[0.05]">
                <h3 className="font-heading text-lg text-[#F5F2EF] tracking-wider uppercase font-semibold">Shopping Bag</h3>
                <button
                  onClick={closeCart}
                  className="text-[#F5F2EF] hover:text-[#E50914] transition-colors p-2"
                  aria-label="Close cart"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer Content */}
              {checkoutStep === "idle" && (
                <>
                  {cart.length === 0 ? (
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-6 space-y-4">
                      <p className="font-sans text-xs tracking-widest text-[#F5F2EF]/40 uppercase">Your bag is empty</p>
                      <Link
                        href="/shop"
                        onClick={closeCart}
                        className="border border-[#E50914] px-6 py-2 text-xs tracking-widest uppercase text-[#F5F2EF] hover:bg-[#E50914] transition-all duration-300"
                      >
                        Browse Shop
                      </Link>
                    </div>
                  ) : (
                    <>
                      {/* Items List */}
                      <div className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-thin">
                        {cart.map((item) => (
                          <div key={`${item.productId}-${item.variant}-${item.size ?? ""}`} className="flex gap-4 border-b border-white/[0.03] pb-6">
                            {/* Product Thumbnail */}
                            <div className="relative w-20 aspect-[4/5] bg-black rounded overflow-hidden border border-white/[0.05]">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover opacity-80"
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <h4 className="font-heading text-sm text-[#F5F2EF] leading-none mb-1.5">{item.name}</h4>
                                <p className="font-sans text-[10px] text-[#F5F2EF]/40 uppercase tracking-widest">
                                  {item.variant}
                                  {item.size ? ` · ${item.size}` : ""}
                                </p>
                              </div>

                              {/* Quantity & Delete Controls */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center border border-white/[0.08] rounded">
                                  <button
                                    onClick={() => updateQuantity(item.productId, item.variant, item.size, -1)}
                                    className="px-2 py-0.5 text-xs text-[#F5F2EF]/60 hover:text-[#F5F2EF]"
                                  >
                                    -
                                  </button>
                                  <span className="px-2 text-xs text-[#F5F2EF] font-mono">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.productId, item.variant, item.size, 1)}
                                    className="px-2 py-0.5 text-xs text-[#F5F2EF]/60 hover:text-[#F5F2EF]"
                                  >
                                    +
                                  </button>
                                </div>

                                <button
                                  onClick={() => removeItem(item.productId, item.variant, item.size)}
                                  className="text-[#F5F2EF]/40 hover:text-[#E50914] transition-colors p-1"
                                  aria-label="Remove item"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Product Price */}
                            <div className="font-mono text-sm text-[#F5F2EF]">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Summary and Action */}
                      <div className="pt-6 border-t border-white/[0.05] space-y-4">
                        <div className="flex justify-between items-center text-xs tracking-wider uppercase text-[#F5F2EF]/60">
                          <span>Subtotal</span>
                          <span className="font-mono text-[#F5F2EF]">{formatPrice(cartSubtotal)}</span>
                        </div>
                        <p className="text-[10px] text-[#F5F2EF]/40 italic leading-relaxed">
                          Shipping, taxes, and discounts calculated at checkout. Relics are packaged in dark cedar coffrets.
                        </p>

                        <Link
                          href="/cart"
                          onClick={closeCart}
                          className="block w-full text-center border border-[#E50914] text-[#F5F2EF] uppercase tracking-widest text-xs py-3 font-semibold hover:bg-[#E50914] transition-all duration-300"
                        >
                          View Full Bag
                        </Link>
                        <Link
                          href="/payment"
                          onClick={closeCart}
                          className="block w-full text-center bg-[#E50914] text-[#F5F2EF] uppercase tracking-widest text-xs py-3.5 font-semibold hover:bg-[#660000] transition-all duration-300 shadow-[0_0_20px_rgba(229, 9, 20,0.2)]"
                        >
                          Proceed to Checkout
                        </Link>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Checkout Progress States */}
              {checkoutStep === "processing" && (
                <div className="flex-1 flex flex-col justify-center items-center text-center p-6 space-y-4">
                  <div className="w-8 h-8 border-2 border-[#F5F2EF]/20 border-t-[#E50914] rounded-full animate-spin" />
                  <p className="font-sans text-xs tracking-widest text-[#F5F2EF]/60 uppercase animate-pulse">Securing Transaction...</p>
                </div>
              )}

              {checkoutStep === "success" && (
                <div className="flex-1 flex flex-col justify-center items-center text-center p-6 space-y-6">
                  <div className="w-12 h-12 bg-[#E50914]/20 rounded-full flex items-center justify-center border border-[#E50914]/40 animate-bounce">
                    <svg className="w-6 h-6 text-[#F5F2EF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-heading text-lg text-[#F5F2EF] uppercase tracking-wider">Transaction Complete</h4>
                    <p className="font-sans text-xs text-[#F5F2EF]/60 leading-relaxed max-w-xs mx-auto">
                      Your order has been recorded into the vault. A dispatch raven will notify you once shipment commences.
                    </p>
                  </div>
                  <button
                    onClick={resetCheckout}
                    className="border border-[#E50914] px-8 py-2.5 text-xs tracking-widest uppercase text-[#F5F2EF] hover:bg-[#E50914] transition-all duration-300"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
