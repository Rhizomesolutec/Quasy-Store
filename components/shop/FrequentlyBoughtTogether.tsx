"use client";

import Image from "next/image";
import { useState } from "react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";

export function FrequentlyBoughtTogether({ main, companions }: { main: Product; companions: Product[] }) {
  const { addItem } = useCart();
  const bundle = [main, ...companions];
  const [selected, setSelected] = useState<Set<string>>(new Set(bundle.map((p) => p.id)));

  const total = bundle.filter((p) => selected.has(p.id)).reduce((sum, p) => sum + p.price, 0);

  if (companions.length === 0) return null;

  return (
    <div className="border border-white/[0.08] p-6 md:p-8 bg-white/[0.015]">
      <h3 className="font-heading text-xl text-[#F5F2EF] mb-6">Frequently Bought Together</h3>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {bundle.map((p, idx) => (
          <div key={p.id} className="flex items-center gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.has(p.id)}
                disabled={p.id === main.id}
                onChange={() =>
                  setSelected((prev) => {
                    const next = new Set(prev);
                    if (next.has(p.id)) {
                      next.delete(p.id);
                    } else {
                      next.add(p.id);
                    }
                    return next;
                  })
                }
                className="w-4 h-4 accent-[#E50914]"
              />
              <div className="relative w-16 aspect-[4/5] bg-black rounded-sm overflow-hidden border border-white/[0.08]">
                <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
              </div>
              <div>
                <p className="font-sans text-xs text-[#F5F2EF]">{p.name}</p>
                <p className="font-heading text-xs text-[#FF2A45] drop-shadow-[0_0_4px_rgba(255,42,69,0.3)]">{formatPrice(p.price)}</p>
              </div>
            </label>
            {idx < bundle.length - 1 && <span className="text-[#F5F2EF]/30 font-heading text-xl">+</span>}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
        <p className="font-sans text-sm text-[#F5F2EF]">
          Total: <span className="text-[#FF2A45] font-heading drop-shadow-[0_0_4px_rgba(255,42,69,0.3)]">{formatPrice(total)}</span>
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            bundle
              .filter((p) => selected.has(p.id))
              .forEach((p) =>
                addItem({
                  productId: p.id,
                  slug: p.slug,
                  name: p.name,
                  price: p.price,
                  image: p.images[0],
                  variant: p.variantLabel,
                })
              );
          }}
        >
          Add Selected to Bag
        </Button>
      </div>
    </div>
  );
}
