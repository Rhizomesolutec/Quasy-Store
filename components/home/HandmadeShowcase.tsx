"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const GATES = [
  {
    href: "/handmade",
    eyebrow: "From the Bench",
    title: "Handmade",
    note: "Cast, filed, and finished by hand — these are the workshop originals.",
    stamp: "Handmade",
    stampColor: "#00FF66",
    channel: "01",
    image: encodeURI("/images/Nacklace/Spider Collection/vol 1/vol 1.webp"),
    imageAlt: "Handmade jewelry from the bench",
  },
  {
    href: "/hand-picked",
    eyebrow: "For the Wrist",
    title: "Hand Picked",
    note: "Watches, bracelets, and cuffs we pick by hand — selected one by one for the wrist.",
    stamp: "Hand Picked",
    stampColor: "#FFE600",
    channel: "02",
    image: "/images/Nacklace/Bracelet/Bracelet 6/Bracelet 6.webp",
    imageAlt: "Hand picked bracelets and cuffs",
  },
] as const;

export function HandmadeShowcase() {
  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-12 md:py-16 border-t border-white/[0.05] bg-[#0c0b09]">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        <div className="overflow-hidden border-y-2 border-[#3a3428] bg-[#14110c] py-2">
          <p className="font-pixel text-[8px] sm:text-[10px] uppercase tracking-[0.35em] text-[#c4a574] animate-retro-marquee">
            Handmade on the bench · Hand picked watches & bracelets · Old catalog plates · Qusay Store ·
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {GATES.map((gate, idx) => (
            <motion.div
              key={gate.href}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={gate.href} className="group block h-full">
                <article className="relative h-full bg-[#14110c] border-2 border-[#3a3428] p-3 sm:p-5 retro-box-shadow transition-colors duration-300 group-hover:border-[#E50914]">
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#c4a574] pointer-events-none" />
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#c4a574] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#c4a574] pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#c4a574] pointer-events-none" />

                  <div className="flex items-center justify-between mb-3 px-0.5">
                    <span
                      className="font-pixel text-[8px] uppercase tracking-widest"
                      style={{ color: gate.stampColor }}
                    >
                      ● {gate.eyebrow}
                    </span>
                    <span className="font-mono text-[8px] sm:text-[9px] text-[#F5F2EF]/35">
                      CH {gate.channel}
                    </span>
                  </div>

                  <div className="relative aspect-[16/10] sm:aspect-[5/3] overflow-hidden bg-black border border-[#2a261c]">
                    <Image
                      src={gate.image}
                      alt={gate.imageAlt}
                      fill
                      sizes="(min-width: 768px) 45vw, 90vw"
                      className="object-cover sepia-[0.35] contrast-110 saturate-75 group-hover:sepia-0 group-hover:saturate-100 transition-all duration-700"
                    />
                    <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-40" />
                    <span
                      className="absolute top-3 right-3 rotate-[-12deg] border-2 px-1.5 py-0.5 font-pixel text-[8px] uppercase tracking-widest bg-black/50"
                      style={{ color: gate.stampColor, borderColor: gate.stampColor }}
                    >
                      {gate.stamp}
                    </span>
                  </div>

                  <div className="mt-4 px-0.5">
                    <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-[#E8DCC4] leading-tight group-hover:text-[#F5F2EF] transition-colors">
                      {gate.title}
                    </h2>
                    <p className="font-mono text-[10px] sm:text-xs text-[#F5F2EF]/45 leading-relaxed mt-2 max-w-md">
                      {gate.note}
                    </p>
                    <div className="flex items-center justify-between mt-4 border-t border-[#3a3428] pt-3">
                      <span className="font-pixel text-[8px] uppercase tracking-widest text-[#c4a574]">
                        Open catalog
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#E50914]">
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
