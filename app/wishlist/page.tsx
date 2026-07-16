"use client";

import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton, Button } from "@/components/ui/Button";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { wishlist, removeItem } = useWishlist();
  const { addItem } = useCart();

  return (
    <main className="relative w-full flex flex-col items-center">
      <div className="bg-noise" />
      <PageHero
        eyebrow="Saved for Later"
        title="Wishlist"
        description="Pieces you're keeping an eye on."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
        bgImage={encodeURI("/images/Nacklace/Spider Collection/vol 9/vol 9.jpg")}
      />

      <section className="w-full px-4 md:px-12 lg:px-24 py-16 pb-24 max-w-6xl">
        {wishlist.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 21s-7.5-4.6-10-9.3C.5 8 2 4 6 4c2.2 0 3.7 1.2 4.5 2.4C11.3 5.2 12.8 4 15 4c4 0 5.5 4 4 7.7-2.5 4.7-10 9.3-10 9.3z"
                />
              </svg>
            }
            title="Your wishlist is empty"
            description="Tap the heart icon on any piece to save it here for later."
            action={
              <LinkButton href="/shop" variant="outline" size="md">
                Browse the Shop
              </LinkButton>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((item) => (
              <div key={item.productId} className="flex flex-col border border-white/[0.08] p-4">
                <Link href={`/shop/${item.slug}`} className="relative aspect-[4/5] bg-black rounded-sm overflow-hidden mb-4">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </Link>
                <Link href={`/shop/${item.slug}`} className="font-heading text-lg text-[#D8CFC0] hover:text-[#8E1F1F] transition-colors mb-1">
                  {item.name}
                </Link>
                <p className="font-sans text-[10px] uppercase tracking-widest text-[#D8CFC0]/40 mb-3">{item.variant}</p>
                <p className="font-sans text-sm text-[#8E1F1F] mb-4">{formatPrice(item.price)}</p>
                <div className="mt-auto flex gap-2">
                  <Button
                    variant="filled"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      addItem({
                        productId: item.productId,
                        slug: item.slug,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        variant: item.variant,
                      });
                      removeItem(item.productId);
                    }}
                  >
                    Move to Bag
                  </Button>
                  <button
                    onClick={() => removeItem(item.productId)}
                    aria-label="Remove from wishlist"
                    className="w-10 flex items-center justify-center border border-white/[0.1] text-[#D8CFC0]/50 hover:text-[#8E1F1F] hover:border-[#8E1F1F]/50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
