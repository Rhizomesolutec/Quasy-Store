"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

const FALLBACKS: ProductPreview[] = [
  {
    id: "1",
    slug: "arachnid-requiem-necklace",
    name: "The Arachnid Requiem",
    price: 185,
    image: encodeURI("/images/Nacklace/Spider Collection/vol 1/vol 1.webp"),
  },
  {
    id: "2",
    slug: "midnight-glow-necklace",
    name: "The Midnight Glow",
    price: 210,
    image: encodeURI("/images/Nacklace/Glow dark nacklace/vol 7/vol 7.webp"),
  },
  {
    id: "3",
    slug: "glow-dark-crystal-vol5",
    name: "Glow Dark Crystal V",
    price: 198,
    image: encodeURI("/images/Nacklace/Glow dark nacklace/vol 5/vol 5.webp"),
  },
  {
    id: "4",
    slug: "spider-collection-vol3",
    name: "Spider Bead Relic III",
    price: 175,
    image: encodeURI("/images/Nacklace/Spider Collection/vol 3/vol 3.webp"),
  },
  {
    id: "5",
    slug: "gothic-bead-bracelet",
    name: "Gothic Bead Bracelet",
    price: 85,
    image: encodeURI("/images/Nacklace/Bracelet/Bracelet 1.webp"),
  },
  {
    id: "6",
    slug: "cathedral-cuff",
    name: "Cathedral Cuff",
    price: 152,
    image: "/images/Nacklace/Bracelet/Bracelet 6/Bracelet 6.webp",
  },
  {
    id: "7",
    slug: "coven-chain-bracelet",
    name: "Coven Chain Bracelet",
    price: 118,
    image: "/images/Nacklace/Bracelet/Bracelet 11/Bracelet 11.webp",
  },
];

type ProductPreview = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
};

function toPreview(product: Product): ProductPreview {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.images[0] || FALLBACKS[0].image,
  };
}

function pickGroup(
  products: Product[],
  count: number,
  kinds?: string[],
  fallbackStart = 0
): ProductPreview[] {
  const filtered = kinds
    ? products.filter((p) =>
        kinds.some((kind) => p.category.toLowerCase().includes(kind))
      )
    : products;
  const mapped = (filtered.length > 0 ? filtered : products).map(toPreview);
  const source = mapped.length > 0 ? mapped : FALLBACKS;
  const picked: ProductPreview[] = [];
  for (let i = 0; i < count; i += 1) {
    picked.push(source[(fallbackStart + i) % source.length]);
  }
  return picked;
}

const HAND_PICKED_SLUGS = [
  "gothic-bead-bracelet",
  "cathedral-cuff",
  "coven-chain-bracelet",
];
const HAND_PICKED_SKIP = new Set([
  "cobweb-wrap-bracelet",
  "aged-charm-bracelet",
  "spider-chain",
]);

function pickHandpicked(products: Product[]): ProductPreview[] {
  const bracelets = products
    .filter((p) =>
      ["bracelet", "watch", "cuff"].some((kind) =>
        p.category.toLowerCase().includes(kind)
      )
    )
    .map(toPreview)
    .filter(
      (item) =>
        !HAND_PICKED_SKIP.has(item.slug) && !/spider/i.test(item.name)
    );

  const bySlug = new Map(bracelets.map((item) => [item.slug, item]));
  const lead =
    bySlug.get("gothic-bead-bracelet") ||
    FALLBACKS.find((item) => item.slug === "gothic-bead-bracelet")!;
  const cathedral =
    bySlug.get("cathedral-cuff") ||
    FALLBACKS.find((item) => item.slug === "cathedral-cuff")!;
  const coven =
    bySlug.get("coven-chain-bracelet") ||
    FALLBACKS.find((item) => item.slug === "coven-chain-bracelet")!;

  return [lead, cathedral, coven];
}

function CatalogPlate({
  product,
  index,
  stamp,
  stampColor,
}: {
  product: ProductPreview;
  index: number;
  stamp: string;
  stampColor: string;
}) {
  const plate = String(index + 1).padStart(2, "0");

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <article className="relative bg-[#14110c] border-2 border-[#3a3428] p-2 sm:p-3 retro-box-shadow transition-colors duration-300 group-hover:border-[#E50914]">
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

        <div className="relative aspect-square overflow-hidden bg-black border border-[#2a261c]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 30vw, 45vw"
            className="object-cover sepia-[0.35] contrast-110 saturate-75 group-hover:sepia-0 group-hover:saturate-100 transition-all duration-700"
          />
          <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-40" />
          <span
            className="absolute top-2 right-2 sm:top-3 sm:right-3 rotate-[-12deg] border-2 px-1.5 py-0.5 font-pixel text-[7px] sm:text-[8px] uppercase tracking-widest bg-black/50"
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

function CatalogBand({
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
  products: ProductPreview[];
}) {
  return (
    <div className="space-y-5 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b-2 border-[#3a3428] pb-3">
        <div>
          <span className="font-pixel text-[8px] uppercase tracking-widest block mb-1" style={{ color: stampColor }}>
            ● {eyebrow}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-[#E8DCC4]">{title}</h2>
        </div>
        <p className="font-mono text-[10px] sm:text-xs text-[#F5F2EF]/45 max-w-sm leading-relaxed">{note}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-5">
        {products.map((product, idx) => (
          <motion.div
            key={`${stamp}-${product.id}-${idx}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <CatalogPlate product={product} index={idx} stamp={stamp} stampColor={stampColor} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function HandmadeShowcase({ products }: { products: Product[] }) {
  const handmade = pickGroup(products, 3, ["necklace"]);
  const handpicked = pickHandpicked(products);

  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-12 md:py-16 border-t border-white/[0.05] bg-[#0c0b09]">
      <div className="max-w-7xl mx-auto space-y-10 md:space-y-14">
        <div className="overflow-hidden border-y-2 border-[#3a3428] bg-[#14110c] py-2">
          <p className="font-pixel text-[8px] sm:text-[10px] uppercase tracking-[0.35em] text-[#c4a574] animate-retro-marquee">
            Handmade on the bench · Hand picked watches & bracelets · Old catalog plates · Qusay Store ·
          </p>
        </div>

        <CatalogBand
          eyebrow="From the Bench"
          title="Handmade"
          note="Cast, filed, and finished by hand — these are the workshop originals."
          stamp="Handmade"
          stampColor="#00FF66"
          products={handmade}
        />

        <CatalogBand
          eyebrow="For the Wrist"
          title="Hand Picked"
          note="Watches, bracelets, and cuffs we pick by hand — selected one by one for the wrist."
          stamp="Hand Picked"
          stampColor="#FFE600"
          products={handpicked}
        />
      </div>
    </section>
  );
}
