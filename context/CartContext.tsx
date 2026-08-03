"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { CartItem } from "@/lib/types";

const STORAGE_KEY = "qusay_cart_v1";

interface CartContextValue {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (productId: string, variant: string, size: string | undefined, delta: number) => void;
  removeItem: (productId: string, variant: string, size?: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  checkoutStep: "idle" | "processing" | "success";
  startCheckout: () => void;
  resetCheckout: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function sameLine(a: CartItem, productId: string, variant: string, size?: string) {
  return a.productId === productId && a.variant === variant && (a.size ?? "") === (size ?? "");
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"idle" | "processing" | "success">("idle");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage, unavailable during SSR
      if (raw) setCart(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addItem = useCallback<CartContextValue["addItem"]>((item, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((line) => sameLine(line, item.productId, item.variant, item.size));
      if (existing) {
        return prev.map((line) =>
          sameLine(line, item.productId, item.variant, item.size)
            ? { ...line, quantity: line.quantity + quantity }
            : line
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setIsCartOpen(true);
  }, []);

  const updateQuantity = useCallback<CartContextValue["updateQuantity"]>((productId, variant, size, delta) => {
    setCart((prev) =>
      prev
        .map((line) =>
          sameLine(line, productId, variant, size) ? { ...line, quantity: Math.max(0, line.quantity + delta) } : line
        )
        .filter((line) => line.quantity > 0)
    );
  }, []);

  const removeItem = useCallback<CartContextValue["removeItem"]>((productId, variant, size) => {
    setCart((prev) => prev.filter((line) => !sameLine(line, productId, variant, size)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const totalItems = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );
  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  const startCheckout = useCallback(() => {
    setCheckoutStep("processing");
    setTimeout(() => setCheckoutStep("success"), 1800);
  }, []);

  const resetCheckout = useCallback(() => {
    setCheckoutStep("idle");
    setCart([]);
    setIsCartOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      cart,
      isCartOpen,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      totalItems,
      subtotal,
      checkoutStep,
      startCheckout,
      resetCheckout,
    }),
    [
      cart,
      isCartOpen,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      totalItems,
      subtotal,
      checkoutStep,
      startCheckout,
      resetCheckout,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
