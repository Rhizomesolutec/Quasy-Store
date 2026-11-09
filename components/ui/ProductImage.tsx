"use client";

import { useState } from "react";
import { resolveProductImageSrc } from "@/lib/productImage";

type ProductImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  draggable?: boolean;
  priority?: boolean;
  fallbackSrc?: string;
};

export function ProductImage({
  src,
  alt,
  className = "",
  fill = false,
  draggable,
  priority = false,
  fallbackSrc,
}: ProductImageProps) {
  const resolved = resolveProductImageSrc(src);
  const fallback = resolveProductImageSrc(fallbackSrc);
  const [broken, setBroken] = useState<string[]>([]);

  const current =
    resolved && !broken.includes(resolved)
      ? resolved
      : fallback && fallback !== resolved && !broken.includes(fallback)
        ? fallback
        : "";

  if (!current) {
    return (
      <span
        className={fill ? "absolute inset-0 bg-[#171717]" : "block h-full w-full bg-[#171717]"}
        role="img"
        aria-label={alt || "Image unavailable"}
      />
    );
  }

  return (
    <img
      src={current}
      alt={alt}
      draggable={draggable}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => {
        setBroken((prev) => (prev.includes(current) ? prev : [...prev, current]));
      }}
      className={fill ? `absolute inset-0 h-full w-full object-cover ${className}` : className}
    />
  );
}
