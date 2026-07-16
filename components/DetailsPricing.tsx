"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function DetailsPricing() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  itemsRef.current = [];

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
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.4,
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

  return (
    <section ref={sectionRef} className="w-full min-h-screen py-32 px-4 md:px-12 lg:px-24 flex flex-col items-center">
      <div className="max-w-6xl w-full">
        
        {/* Section Header */}
        <div ref={addToRefs} className="text-center mb-32">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[#D8CFC0] mb-6">
            The Arachnid Requiem
          </h2>
          <div className="w-24 h-[1px] bg-[#8E1F1F] mx-auto mb-8" />
          <p className="font-sans text-lg text-[#D8CFC0]/70 max-w-2xl mx-auto leading-relaxed">
            A symbol of patience, creativity, and the darker side of beauty. 
            Meticulously cast in tarnished silver, this piece rests heavy with intention.
          </p>
        </div>

        {/* Product Showcase */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center mb-32">
          <div ref={addToRefs} className="relative w-full lg:w-1/2 aspect-[4/5] bg-black rounded-sm overflow-hidden shadow-2xl">
            <Image 
              src={encodeURI("/images/Nacklace/Spider Collection/vol 1/vol 1.jpg")} 
              alt="Spider Necklace Worn" 
              fill 
              className="object-contain" 
            />
          </div>
          <div ref={addToRefs} className="w-full lg:w-1/2 flex flex-col justify-center">
            <h3 className="font-heading text-3xl md:text-4xl text-[#D8CFC0] mb-4">
              Wear the Shadows
            </h3>
            <p className="font-sans text-[#D8CFC0]/60 text-lg mb-8 leading-relaxed">
              Designed to drape perfectly across the collarbone, the intricate chain links balance the striking weight of the spider pendant. A statement that doesn't scream, but whispers.
            </p>
            <div className="flex items-end gap-6 border-b border-[#D8CFC0]/20 pb-6">
              <span className="font-sans text-3xl tracking-wider text-[#8E1F1F]">
                $185.00
              </span>
              <span className="font-sans text-sm text-[#D8CFC0]/40 uppercase tracking-widest pb-1">
                Limited Edition
              </span>
            </div>
          </div>
        </div>

        {/* Second Product Showcase (Alternative Lighting) */}
        <div className="flex flex-col lg:flex-row-reverse gap-16 lg:gap-24 items-center">
          <div ref={addToRefs} className="relative w-full lg:w-1/2 aspect-[4/5] bg-black rounded-sm overflow-hidden shadow-2xl shadow-[#8E1F1F]/10">
            <Image 
              src={encodeURI("/images/Nacklace/Glow dark nacklace/vol 7/vol 7.jpg")} 
              alt="Midnight Glow night light necklace" 
              fill 
              className="object-contain" 
            />
          </div>
          <div ref={addToRefs} className="w-full lg:w-1/2 flex flex-col justify-center">
            <h3 className="font-heading text-3xl md:text-4xl text-[#D8CFC0] mb-4">
              The Midnight Glow
            </h3>
            <p className="font-sans text-[#D8CFC0]/60 text-lg mb-8 leading-relaxed">
              In the right light, the heart of the spider reveals its true nature. Crafted with a unique luminescent inlay that catches and holds the ambient light of the room.
            </p>
            <div className="flex items-end gap-6 border-b border-[#D8CFC0]/20 pb-6">
              <span className="font-sans text-3xl tracking-wider text-[#8E1F1F]">
                $210.00
              </span>
              <span className="font-sans text-sm text-[#D8CFC0]/40 uppercase tracking-widest pb-1">
                Crimson Variant
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
