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
  backHref = "/",
  backLabel = "◄ Home",
}: {
  eyebrow: string;
  title: string;
  note: string;
  stamp: string;
  stampColor: string;
  products: Product[];
  backHref?: string;
  backLabel?: string;
}) {
  const count = products.length;

  return (
    <main className="relative w-full flex flex-col items-center bg-vintage-bg">
      <div className="bg-noise" />
      <section className="w-full px-4 md:px-12 lg:px-24 py-12 md:py-16 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
          <div className="overflow-hidden border-y-2 border-white bg-[#ED5903] py-2">
            <p className="font-pixel text-[8px] sm:text-[10px] uppercase tracking-[0.35em] text-white animate-retro-marquee">
              {title} catalog · Old plates · Qusay Store · From the vault ·
            </p>
          </div>

          <div className="flex flex-col gap-4 border-b-2 border-white/25 pb-5">
            <Link
              href={backHref}
              className="font-mono text-[10px] uppercase tracking-widest text-white/50 hover:text-[#FFD400] transition-colors w-fit"
            >
              {backLabel}
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <span
                  className="font-pixel text-[8px] uppercase tracking-widest block mb-1"
                  style={{ color: stampColor }}
                >
                  ● {eyebrow}
                </span>
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-white">{title}</h1>
              </div>
              <div className="sm:text-right">
                <p className="font-mono text-[10px] sm:text-xs text-white/55 max-w-sm leading-relaxed">
                  {note}
                </p>
                <p className="font-pixel text-[8px] uppercase tracking-widest text-[#FFD400] mt-2">
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
