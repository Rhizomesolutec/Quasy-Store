import Link from "next/link";
import { RetroCatalogGrid } from "./RetroCatalogGrid";
import { productToCatalogItem } from "./CatalogPlate";
import type { Product } from "@/lib/types";

export function RetroCatalogPage({
  eyebrow,
  title,
  note,
  stamp,
  stampColor,
  products,
}: {
  eyebrow: string;
  title: string;
  note: string;
  stamp: string;
  stampColor: string;
  products: Product[];
}) {
  const count = products.length;

  return (
    <main className="relative w-full flex flex-col items-center bg-[#0c0b09]">
      <div className="bg-noise" />
      <section className="w-full px-4 md:px-12 lg:px-24 py-12 md:py-16 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
          <div className="overflow-hidden border-y-2 border-[#3a3428] bg-[#14110c] py-2">
            <p className="font-pixel text-[8px] sm:text-[10px] uppercase tracking-[0.35em] text-[#c4a574] animate-retro-marquee">
              {title} catalog · Old plates · Qusay Store · From the vault ·
            </p>
          </div>

          <div className="flex flex-col gap-4 border-b-2 border-[#3a3428] pb-5">
            <Link
              href="/"
              className="font-mono text-[10px] uppercase tracking-widest text-[#F5F2EF]/40 hover:text-[#E50914] transition-colors w-fit"
            >
              ◄ Home
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <span
                  className="font-pixel text-[8px] uppercase tracking-widest block mb-1"
                  style={{ color: stampColor }}
                >
                  ● {eyebrow}
                </span>
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#E8DCC4]">{title}</h1>
              </div>
              <div className="sm:text-right">
                <p className="font-mono text-[10px] sm:text-xs text-[#F5F2EF]/45 max-w-sm leading-relaxed">
                  {note}
                </p>
                <p className="font-pixel text-[8px] uppercase tracking-widest text-[#c4a574] mt-2">
                  {String(count).padStart(2, "0")} plates on file
                </p>
              </div>
            </div>
          </div>

          <RetroCatalogGrid
            products={products.map(productToCatalogItem)}
            stamp={stamp}
            stampColor={stampColor}
          />
        </div>
      </section>
    </main>
  );
}
