"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

gsap.registerPlugin(ScrollTrigger);

const SHOWS_GRID = [
  {
    id: "1",
    channelNo: "01",
    name: "The Arachnid Requiem",
    price: 185,
    badgeColor: "#E50914",
    headerLabel: "THE FRESH REQUIEM",
    image: encodeURI("/images/Nacklace/Spider Collection/vol 1/vol 1.jpg"),
    slug: "arachnid-requiem-necklace",
  },
  {
    id: "2",
    channelNo: "02",
    name: "The Midnight Glow",
    price: 210,
    badgeColor: "#E50914",
    headerLabel: "SAVED BY THE GLOW",
    image: encodeURI("/images/Nacklace/Glow dark nacklace/vol 7/vol 7.jpg"),
    slug: "midnight-glow-necklace",
  },
  {
    id: "3",
    channelNo: "03",
    name: "Glow Dark Crystal V",
    price: 198,
    badgeColor: "#E50914",
    headerLabel: "TEENAGE MUTANT COVEN",
    image: encodeURI("/images/Nacklace/Glow dark nacklace/vol 5/vol 5.jpg"),
    slug: "glow-dark-crystal-vol5",
  },
  {
    id: "4",
    channelNo: "04",
    name: "Spider Bead Relic III",
    price: 175,
    badgeColor: "#E50914",
    headerLabel: "GOTHIC DOUG",
    image: encodeURI("/images/Nacklace/Spider Collection/vol 3/vol 3.jpg"),
    slug: "spider-collection-vol3",
  },
  {
    id: "5",
    channelNo: "05",
    name: "Cathedral Cuff",
    price: 152,
    badgeColor: "#E50914",
    headerLabel: "POWER RELICS",
    image: "/images/Nacklace/Bracelet/Bracelet 6/Bracelet 6.jpg",
    slug: "cathedral-cuff",
  },
  {
    id: "6",
    channelNo: "06",
    name: "Coven Chain Bracelet",
    price: 118,
    badgeColor: "#E50914",
    headerLabel: "F.R.I.E.N.D.S OF NIGHT",
    image: "/images/Nacklace/Bracelet/Bracelet 11/Bracelet 11.jpg",
    slug: "coven-chain-bracelet",
  },
  {
    id: "7",
    channelNo: "07",
    name: "Obsidian Pendant",
    price: 165,
    badgeColor: "#E50914",
    headerLabel: "MIDNIGHT SPECIAL",
    image: encodeURI("/images/Nacklace/Glow dark nacklace/vol 4/vol 4.jpg"),
    slug: "obsidian-pendant-necklace",
  },
  {
    id: "8",
    channelNo: "08",
    name: "Relic Locket",
    price: 195,
    badgeColor: "#E50914",
    headerLabel: "ARCHIVAL SELECTION",
    image: "/images/spider-1.jpg",
    slug: "relic-locket-necklace",
  },
  {
    id: "9",
    channelNo: "09",
    name: "Glow Dark Crystal VI",
    price: 205,
    badgeColor: "#E50914",
    headerLabel: "SAVED BY THE COVEN",
    image: encodeURI("/images/Nacklace/Glow dark nacklace/vol 6/vol 6.jpg"),
    slug: "glow-dark-crystal-vol6",
  },
  {
    id: "10",
    channelNo: "10",
    name: "Spider Bead Relic IV",
    price: 180,
    badgeColor: "#E50914",
    headerLabel: "GOTHIC DOUG II",
    image: encodeURI("/images/Nacklace/Spider Collection/vol 4/var 4.jpg"),
    slug: "spider-collection-vol4",
  },
  {
    id: "11",
    channelNo: "11",
    name: "Gothic Pant Hook",
    price: 165,
    badgeColor: "#E50914",
    headerLabel: "DENIM RAMPAGE",
    image: encodeURI("/images/Nacklace/Pant Hook Chain/Pant Hook Chain 1.jpg"),
    slug: "pant-hook-chain",
  },
  {
    id: "12",
    channelNo: "12",
    name: "Gothic Jacket Pin",
    price: 145,
    badgeColor: "#E50914",
    headerLabel: "PINHEAD SHADOWS",
    image: encodeURI("/images/Nacklace/Jacket pin/Jacket pin 1.jpg"),
    slug: "gothic-jacket-pin",
  },
];

export default function DetailsPricing() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const { addItem } = useCart();
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !itemsRef.current.includes(el)) {
      itemsRef.current.push(el);
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      itemsRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        stagger: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleAddToCart = (product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
  }) => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      variant: "Aged Sterling Silver",
    });
    setAddedToast(`Added ${product.name} to vault!`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <section ref={sectionRef} className="w-full min-h-screen py-16 md:py-24 px-4 md:px-12 lg:px-24 flex flex-col items-center border-t border-white/[0.05]">
      <div className="max-w-6xl w-full flex flex-col gap-16 md:gap-24">
        
        {/* -------------------------------------------------------------
            1. FEATURED SHOWS RETRO CARDS (8-BIT PIXEL RETRO FONT STYLING)
        ------------------------------------------------------------- */}
        <div ref={addToRefs} className="w-full flex flex-col gap-4">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <h3 className="text-sm sm:text-base font-black text-[#00F0FF] tracking-widest uppercase font-pixel">
                FEATURED SHOWS
              </h3>
              <span className="text-[#FFE600] font-black text-lg select-none">〰〰</span>
            </div>

            {/* Top-Right Retro Boxed VIEW ALL Button */}
            <Link
              href="/shop"
              className="px-2.5 py-1 bg-black border-2 border-white/60 hover:border-[#FF0055] text-[9px] sm:text-[10px] font-pixel font-bold text-white uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>VIEW ALL</span>
              <span className="text-[#FF0055] text-[8px]">▶</span>
            </Link>
          </div>

          {/* 6 Grid Cards on Mobile, 12 on Desktop (All 8-bit Pixel Font) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {SHOWS_GRID.map((ch, idx) => (
              <Link
                key={ch.id}
                href={`/shop/${ch.slug}`}
                className={`group cursor-pointer bg-[#0a0a0c] border-2 border-[#333] hover:border-[#00FF66] overflow-hidden retro-box-shadow flex flex-col justify-between transition-all duration-300 ${
                  idx >= 6 ? "hidden lg:flex" : ""
                }`}
              >
                {/* Card Image */}
                <div className="relative aspect-square w-full bg-black overflow-hidden">
                  <Image
                    src={ch.image}
                    alt={ch.name}
                    fill
                    sizes="(min-width: 1024px) 16vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Footer Info */}
                <div className="p-2 bg-[#121216] border-t border-[#222] flex flex-col gap-1">
                  <span className="text-[9px] sm:text-[10px] font-bold text-white truncate font-pixel">
                    {ch.name}
                  </span>
                  <div className="flex items-center justify-between text-[8px] sm:text-[9px]">
                    <span className="text-[#FFE600] font-bold font-pixel">₹{ch.price}</span>
                    <span className="text-[#00FF66] font-pixel">CH {ch.channelNo}</span>
                  </div>
                </div>

              </Link>
            ))}
          </div>

        </div>


        {/* -------------------------------------------------------------
            3. THE ARACHNID REQUIEM SHOWCASE (UNDER FEATURED SHOWS & BROWSE BY CATEGORY)
        ------------------------------------------------------------- */}
        <div className="w-full flex flex-col gap-16 md:gap-24 border-t-2 border-[#222] pt-16">
          
          {/* Section Header */}
          <div ref={addToRefs} className="text-center">
            <span className="font-mono text-xs text-[#E50914] font-bold uppercase tracking-[0.3em] block mb-3">
              ● ARCHIVAL SHOWCASE
            </span>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[#F5F2EF] mb-6">
              The Arachnid Requiem
            </h2>
            <div className="w-24 h-[2px] bg-gradient-to-r from-[#E50914] via-[#FF2A45] to-[#E50914] mx-auto mb-8 shadow-[0_0_8px_rgba(229,9,20,0.4)]" />
            <p className="font-mono text-sm md:text-base text-[#F5F2EF]/70 max-w-2xl mx-auto leading-relaxed">
              A symbol of patience, creativity, and the darker side of beauty. 
              Meticulously cast in tarnished silver, this piece rests heavy with intention.
            </p>
          </div>

          {/* First Product Showcase: Wear the Shadows */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            <div ref={addToRefs} className="relative w-full lg:w-1/2 aspect-[4/5] bg-black rounded-sm overflow-hidden border-2 border-[#222] retro-box-shadow">
              <Image 
                src={encodeURI("/images/Nacklace/Spider Collection/vol 1/vol 1.jpg")} 
                alt="The Arachnid Requiem Spider Necklace" 
                fill 
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover" 
              />
            </div>
            <div ref={addToRefs} className="w-full lg:w-1/2 flex flex-col justify-center">
              <span className="font-pixel text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-[#E50914] mb-2">
                VOL 01 · SIGNATURE CASTING
              </span>
              <h3 className="font-heading text-3xl md:text-4xl text-[#F5F2EF] mb-4">
                Wear the Shadows
              </h3>
              <p className="font-mono text-xs md:text-sm text-[#F5F2EF]/70 leading-relaxed mb-8">
                Designed to drape perfectly across the collarbone, the intricate chain links balance the striking weight of the spider pendant. A statement that doesn&apos;t scream, but whispers.
              </p>
              <div className="flex items-center justify-between border-b border-[#222] pb-6 mb-8">
                <span className="font-pixel text-xl sm:text-2xl font-bold text-[#FFE600]">
                  ₹185.00
                </span>
                <span className="font-pixel text-[9px] sm:text-[10px] text-[#E50914] font-bold uppercase tracking-widest">
                  ● Limited Edition Restock
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() =>
                    handleAddToCart({
                      id: "1",
                      slug: "arachnid-requiem-necklace",
                      name: "The Arachnid Requiem",
                      price: 185,
                      image: encodeURI("/images/Nacklace/Spider Collection/vol 1/vol 1.jpg"),
                    })
                  }
                  className="bg-black hover:bg-[#00FF66] text-[#00FF66] hover:text-black font-pixel font-bold text-[9px] sm:text-[10px] px-5 py-3 uppercase tracking-wider border-2 border-white/60 hover:border-[#00FF66] retro-box-shadow transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>ACQUIRE RELIC ►</span>
                </button>
              </div>
            </div>
          </div>

          {/* Second Product Showcase: The Midnight Glow */}
          <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-20 items-center">
            <div ref={addToRefs} className="relative w-full lg:w-1/2 aspect-[4/5] bg-black rounded-sm overflow-hidden border-2 border-[#222] retro-box-shadow">
              <Image 
                src={encodeURI("/images/Nacklace/Glow dark nacklace/vol 7/vol 7.jpg")} 
                alt="Midnight Glow night light necklace" 
                fill 
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover" 
              />
            </div>
            <div ref={addToRefs} className="w-full lg:w-1/2 flex flex-col justify-center">
              <span className="font-pixel text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-[#E50914] mb-2">
                VOL 07 · LUMINESCENT INLAY
              </span>
              <h3 className="font-heading text-3xl md:text-4xl text-[#F5F2EF] mb-4">
                The Midnight Glow
              </h3>
              <p className="font-mono text-xs md:text-sm text-[#F5F2EF]/70 leading-relaxed mb-8">
                In the right light, the heart of the spider reveals its true nature. Crafted with a unique luminescent inlay that catches and holds the ambient light of the room.
              </p>
              <div className="flex items-center justify-between border-b border-[#222] pb-6 mb-8">
                <span className="font-pixel text-xl sm:text-2xl font-bold text-[#FFE600]">
                  ₹210.00
                </span>
                <span className="font-pixel text-[9px] sm:text-[10px] text-[#E50914] font-bold uppercase tracking-widest">
                  ● Crimson Glow Variant
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() =>
                    handleAddToCart({
                      id: "2",
                      slug: "midnight-glow-necklace",
                      name: "The Midnight Glow",
                      price: 210,
                      image: encodeURI("/images/Nacklace/Glow dark nacklace/vol 7/vol 7.jpg"),
                    })
                  }
                  className="bg-black hover:bg-[#00FF66] text-[#00FF66] hover:text-black font-pixel font-bold text-[9px] sm:text-[10px] px-5 py-3 uppercase tracking-wider border-2 border-white/60 hover:border-[#00FF66] retro-box-shadow transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>ACQUIRE RELIC ►</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00FF66] text-black font-mono font-black text-xs px-4 py-3 border-2 border-black retro-box-shadow animate-bounce">
          {addedToast}
        </div>
      )}

    </section>
  );
}
