"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SHOWCASE_LINES } from "@/lib/showcase";
import { ProductImage } from "@/components/ui/ProductImage";

export function HandmadeShowcase() {
  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-12 md:py-16 border-t border-white/[0.05] bg-vintage-bg">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        <div className="overflow-hidden border-y-2 border-white bg-[#ED5903] py-2">
          <p className="font-pixel text-[8px] sm:text-[10px] uppercase tracking-[0.35em] text-white animate-retro-marquee">
            Handmade · Hand Picked · Qusay Made · Toys · Crystals · Old catalog plates · Qusay Store ·
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          {SHOWCASE_LINES.map((line, idx) => (
            <motion.div
              key={line.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={`/${line.slug}`} className="group block h-full">
                <article className="relative h-full bg-[#14110c] border-2 border-white/40 p-2 sm:p-3 retro-box-shadow transition-colors duration-300 group-hover:border-[#ED5903]">
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#FFD400] pointer-events-none" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#FFD400] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#FFD400] pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#FFD400] pointer-events-none" />

                  <div className="flex items-center justify-between mb-2 px-0.5">
                    <span
                      className="font-pixel text-[7px] sm:text-[8px] uppercase tracking-widest truncate"
                      style={{ color: line.stampColor }}
                    >
                      ● {line.eyebrow}
                    </span>
                    <span className="font-mono text-[7px] sm:text-[8px] text-[#F5F2EF]/35 shrink-0">
                      CH {line.channel}
                    </span>
                  </div>

                  <div className="relative aspect-square overflow-hidden bg-black border border-[#2a261c]">
                    <ProductImage
                      src={line.image}
                      alt={line.name}
                      fill
                      sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
                      className="sepia-[0.35] contrast-110 saturate-75 group-hover:sepia-0 group-hover:saturate-100 transition-all duration-700"
                    />
                    <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-40" />
                    <span
                      className="absolute top-2 right-2 rotate-[-12deg] border-2 px-1 py-0.5 font-pixel text-[6px] sm:text-[7px] uppercase tracking-widest bg-black/50"
                      style={{ color: line.stampColor, borderColor: line.stampColor }}
                    >
                      {line.stamp}
                    </span>
                  </div>

                  <div className="mt-2 sm:mt-3 px-0.5">
                    <h2 className="font-heading text-sm sm:text-lg md:text-xl text-white leading-tight group-hover:text-[#FFD400] transition-colors">
                      {line.name}
                    </h2>
                    <p className="hidden sm:block font-mono text-[9px] md:text-[10px] text-white/55 leading-relaxed mt-1 line-clamp-2">
                      {line.note}
                    </p>
                    <div className="flex items-center justify-between mt-2 border-t border-white/20 pt-2">
                      <span className="font-pixel text-[7px] uppercase tracking-widest text-[#FFD400]">
                        Open
                      </span>
                      <span className="font-mono text-[8px] uppercase tracking-widest text-[#ED5903]">
                        Enter ►
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
