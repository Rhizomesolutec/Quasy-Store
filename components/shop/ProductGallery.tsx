"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export function ProductGallery({ images, alt, video }: { images: string[]; alt: string; video?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<{ backgroundPosition: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isVideoActive = video && activeIndex === images.length;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isVideoActive) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ backgroundPosition: `${x}% ${y}%` });
  };

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => {
          if (!isVideoActive) setZoomStyle({ backgroundPosition: "50% 50%" });
        }}
        onMouseLeave={() => setZoomStyle(null)}
        className={`relative aspect-[4/5] bg-black rounded-sm overflow-hidden shadow-2xl group ${
          isVideoActive ? "cursor-default" : "cursor-zoom-in"
        }`}
      >
        {isVideoActive ? (
          <video
            src={video}
            controls
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <Image
              src={images[activeIndex] || "/images/placeholder.jpg"}
              alt={alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={`object-cover transition-opacity duration-300 ${zoomStyle ? "opacity-0" : "opacity-100"}`}
            />
            {zoomStyle && images[activeIndex] && (
              <div
                className="absolute inset-0 transition-opacity duration-150"
                style={{
                  backgroundImage: `url("${encodeURI(images[activeIndex])}")`,
                  backgroundSize: "200%",
                  backgroundPosition: zoomStyle.backgroundPosition,
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}
            <span className="absolute bottom-3 right-3 font-sans text-[9px] uppercase tracking-widest text-[#F5F2EF]/50 bg-black/50 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Hover to zoom
            </span>
          </>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        {images.map((img, idx) => (
          <button
            key={img + idx}
            onClick={() => setActiveIndex(idx)}
            className={`relative w-16 md:w-20 aspect-[4/5] rounded-sm overflow-hidden border transition-colors ${
              idx === activeIndex ? "border-[#E50914]" : "border-white/[0.08] hover:border-white/20"
            }`}
          >
            <Image src={img} alt="" fill className="object-cover" />
          </button>
        ))}

        {video && (
          <button
            onClick={() => setActiveIndex(images.length)}
            className={`relative w-16 md:w-20 aspect-[4/5] rounded-sm overflow-hidden border transition-colors flex flex-col items-center justify-center bg-[#170909] ${
              activeIndex === images.length ? "border-[#E50914]" : "border-white/[0.08] hover:border-white/20"
            }`}
          >
            <svg className="w-6 h-6 text-[#F5F2EF]/70 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-sans text-[8px] uppercase tracking-widest text-[#F5F2EF]/70">Video</span>
          </button>
        )}
      </div>
    </div>
  );
}
