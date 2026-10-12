import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { safePublicSrc } from "@/lib/chainImages";
import type { Product } from "@/lib/types";

export type CatalogItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
};

export function productToCatalogItem(product: Product): CatalogItem {
  const image = product.images[0] || "/images/spider-1.webp";
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: safePublicSrc(image),
  };
}

export function CatalogPlate({
  product,
  index,
  stamp,
  stampColor,
}: {
  product: CatalogItem;
  index: number;
  stamp: string;
  stampColor: string;
}) {
  const plate = String(index + 1).padStart(2, "0");

  return (
    <Link href={`/shop/${product.slug}`} className="group block h-full">
      <article className="relative h-full bg-[#14110c] border-2 border-[#3a3428] p-2 sm:p-3 retro-box-shadow transition-colors duration-300 group-hover:border-[#E50914]">
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#c4a574] pointer-events-none" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#c4a574] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#c4a574] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#c4a574] pointer-events-none" />

        <div className="flex items-center justify-between mb-2 px-0.5">
          <span className="font-pixel text-[7px] sm:text-[8px] uppercase tracking-widest text-[#c4a574]">
            Plate {plate}
          </span>
          <span className="font-mono text-[8px] sm:text-[9px] text-[#F5F2EF]/35">CH {plate}</span>
        </div>

        <div className="relative aspect-square overflow-hidden bg-[#1a1610] border border-[#2a261c]">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span
            className="absolute top-2 right-2 sm:top-3 sm:right-3 rotate-[-12deg] border-2 px-1.5 py-0.5 font-pixel text-[7px] sm:text-[8px] uppercase tracking-widest bg-black/60"
            style={{ color: stampColor, borderColor: stampColor }}
          >
            {stamp}
          </span>
        </div>

        <div className="mt-2 sm:mt-3 px-0.5">
          <h3 className="font-heading text-sm sm:text-lg text-[#E8DCC4] leading-tight truncate group-hover:text-[#F5F2EF] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-1.5 border-t border-[#3a3428] pt-1.5">
            <span className="font-pixel text-[9px] sm:text-[10px] text-[#FFE600]">{formatPrice(product.price)}</span>
            <span className="font-mono text-[8px] uppercase tracking-widest text-[#E50914]">View ►</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
