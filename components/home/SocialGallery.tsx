"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";

const GALLERY = [
  { src: encodeURI("/images/Nacklace/Spider Collection/vol 1/vol 1.webp"), color: "#FF0055" },
  { src: encodeURI("/images/Nacklace/Glow dark nacklace/vol 2/vol 2.webp"), color: "#00FF66" },
  { src: encodeURI("/images/Nacklace/Spider Collection/vol 5/vol 5.webp"), color: "#00F0FF" },
  { src: encodeURI("/images/Nacklace/Glow dark nacklace/vol 5/vol 5.webp"), color: "#FFE600" },
];

export function SocialGallery() {
  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-12 md:py-16 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="@qusaystore"
          title="Worn in the Wild"
          description="A glimpse of how collectors style the relics — tag us to be featured."
          className="mb-6 md:mb-8"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {GALLERY.map((item, idx) => (
            <motion.div
              key={`${item.src}-${idx}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.55, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-sm border-2 border-[#E50914]/50 bg-black transition-all duration-500 hover:border-[#E50914] retro-box-shadow"
            >
              <div className="relative w-full aspect-square">
                <Image
                  src={item.src}
                  alt={`Qusay Store social ${idx + 1}`}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#070707]/0 group-hover:bg-[#070707]/60 transition-colors duration-500 flex flex-col items-center justify-center gap-2">
                  <span className="font-mono text-[10px] uppercase font-black tracking-widest px-3 py-1 text-white border border-black bg-[#E50914] opacity-0 group-hover:opacity-100 transition-opacity">
                    VIEW POST ►
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
