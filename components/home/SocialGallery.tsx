"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";

const GALLERY = [
  { src: encodeURI("/images/Nacklace/Spider Collection/vol 1/vol 1.jpg"), tall: true },
  { src: encodeURI("/images/Nacklace/Glow dark nacklace/vol 2/vol 2.jpg"), tall: false },
  { src: encodeURI("/images/Nacklace/Spider Collection/vol 5/vol 5.jpg"), tall: false },
  { src: encodeURI("/images/Nacklace/Glow dark nacklace/vol 5/vol 5.jpg"), tall: true },
  { src: encodeURI("/images/Nacklace/Spider Collection/vol 8/vol 8.jpg"), tall: false },
  { src: encodeURI("/images/Nacklace/Glow dark nacklace/vol 7/vol 7.jpg"), tall: true },
];

export function SocialGallery() {
  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-24 md:py-32 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="@qusaystore"
          title="Worn in the Wild"
          description="A glimpse of how collectors style the relics — tag us to be featured."
        />

        <div className="columns-2 md:columns-3 gap-3 md:gap-4 space-y-3 md:space-y-4">
          {GALLERY.map((item, idx) => (
            <motion.div
              key={`${item.src}-${idx}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.55, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group relative break-inside-avoid overflow-hidden rounded-sm border border-white/[0.06] bg-black"
            >
              <div className={`relative w-full ${item.tall ? "aspect-[3/4]" : "aspect-square"}`}>
                <Image
                  src={item.src}
                  alt={`Qusay Store social ${idx + 1}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#070707]/0 group-hover:bg-[#070707]/45 transition-colors duration-500 flex items-center justify-center">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    View Post
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
