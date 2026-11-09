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
};

export function ProductImage({
  src,
  alt,
  className = "",
  fill = false,
  draggable,
  priority = false,
}: ProductImageProps) {
  const resolved = resolveProductImageSrc(src);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = !resolved || failedSrc === resolved;

  if (failed) {
    return (
      <span
        className={fill ? "absolute inset-0 bg-[#171717]" : "block h-full w-full bg-[#171717]"}
        aria-hidden
      />
    );
  }

  return (
    <img
      src={resolved}
      alt={alt}
      draggable={draggable}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailedSrc(resolved)}
      className={fill ? `absolute inset-0 h-full w-full object-cover ${className}` : className}
    />
  );
}
