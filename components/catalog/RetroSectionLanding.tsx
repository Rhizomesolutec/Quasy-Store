import Link from "next/link";
import type { Product } from "@/lib/types";
import type { ShowcaseLine } from "@/lib/showcase";
import { imageForSub, subToSlug } from "@/lib/showcase";
import { safePublicSrc } from "@/lib/chainImages";

export function RetroSectionLanding({
  line,
  counts,
  products = [],
}: {
  line: ShowcaseLine;
  counts: Record<string, number>;
  products?: Product[];
}) {
  return (
    <main className="relative w-full flex flex-col items-center bg-vintage-bg">
      <div className="bg-noise" />
      <section className="w-full px-4 md:px-12 lg:px-24 py-12 md:py-16 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
          <div className="overflow-hidden border-y-2 border-white bg-[#ED5903] py-2">
            <p className="font-pixel text-[8px] sm:text-[10px] uppercase tracking-[0.35em] text-white animate-retro-marquee">
              {line.name} catalog · Old plates · Qusay Store · From the vault ·
            </p>
          </div>

          <div className="flex flex-col gap-4 border-b-2 border-white/25 pb-5">
            <Link
              href="/"
              className="font-mono text-[10px] uppercase tracking-widest text-white/50 hover:text-[#FFD400] transition-colors w-fit"
            >
              ◄ Home
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <span
                  className="font-pixel text-[8px] uppercase tracking-widest block mb-1"
                  style={{ color: line.stampColor }}
                >
                  ● {line.eyebrow}
                </span>
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-white">{line.name}</h1>
              </div>
              <p className="font-mono text-[10px] sm:text-xs text-white/55 max-w-sm leading-relaxed">
                {line.note}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {line.subs.map((sub, idx) => {
              const count = counts[sub] || 0;
              const plate = String(idx + 1).padStart(2, "0");
              const image = imageForSub(line, sub, products);
              return (
                <Link key={sub} href={`/${line.slug}/${subToSlug(sub)}`} className="group block h-full">
                  <article className="relative h-full bg-[#14110c] border-2 border-white/40 p-2 sm:p-3 retro-box-shadow transition-colors duration-300 group-hover:border-[#ED5903]">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#FFD400] pointer-events-none" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#FFD400] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#FFD400] pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#FFD400] pointer-events-none" />

                    <div className="flex items-center justify-between mb-2 px-0.5">
                      <span className="font-pixel text-[7px] sm:text-[8px] uppercase tracking-widest text-[#FFD400]">
                        Plate {plate}
                      </span>
                      <span className="font-mono text-[7px] text-white/40">CH {plate}</span>
                    </div>

                    <div className="relative aspect-square overflow-hidden bg-black border border-[#2a261c]">
                      {image ? (
                        <img
                          src={safePublicSrc(image)}
                          alt={sub}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : null}
                      <span
                        className="absolute top-2 right-2 rotate-[-12deg] border-2 px-1 py-0.5 font-pixel text-[7px] uppercase tracking-widest bg-black/50"
                        style={{ color: line.stampColor, borderColor: line.stampColor }}
                      >
                        {line.stamp}
                      </span>
                    </div>

                    <div className="mt-2 px-0.5">
                      <h2 className="font-heading text-sm sm:text-lg text-white leading-tight truncate group-hover:text-[#FFD400]">
                        {sub}
                      </h2>
                      <div className="flex items-center justify-between mt-1.5 border-t border-white/20 pt-1.5">
                        <span className="font-pixel text-[8px] text-[#FFD400]">
                          {String(count).padStart(2, "0")} pcs
                        </span>
                        <span className="font-mono text-[8px] uppercase tracking-widest text-[#ED5903]">View ►</span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
