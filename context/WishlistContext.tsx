"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { WishlistItem } from "@/lib/types";

const STORAGE_KEY = "qusay_wishlist_v1";

interface WishlistContextValue {
  wishlist: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  toggleItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage, unavailable during SSR
      if (raw) setWishlist(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const isInWishlist = (productId: string) => wishlist.some((item) => item.productId === productId);

  const toggleItem = (item: WishlistItem) => {
    setWishlist((prev) =>
      prev.some((line) => line.productId === item.productId)
        ? prev.filter((line) => line.productId !== item.productId)
        : [...prev, item]
    );
  };

  const removeItem = (productId: string) => {
    setWishlist((prev) => prev.filter((line) => line.productId !== productId));
  };

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider value={{ wishlist, isInWishlist, toggleItem, removeItem, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
