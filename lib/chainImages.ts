/** Local necklace / chain photos that load without the Next image optimizer. */
export const CHAIN_IMAGES = [
  "/images/Nacklace/Spider Collection/vol 1/vol 1.webp",
  "/images/Nacklace/Spider Collection/vol 2/vol 2.webp",
  "/images/Nacklace/Spider Collection/vol 3/vol 3.webp",
  "/images/Nacklace/Spider Collection/vol 5/vol 5.webp",
  "/images/Nacklace/Spider Collection/vol 7/vol 7.webp",
  "/images/Nacklace/Spider Collection/vol 8/vol 8.webp",
  "/images/Nacklace/Spider Collection/vol 9/vol 9.webp",
  "/images/Nacklace/Spider Collection/vol 10/vol 10.webp",
  "/images/Nacklace/Glow dark nacklace/vol 5/vol 5.webp",
  "/images/Nacklace/Glow dark nacklace/vol 7/vol 7.webp",
  "/images/Nacklace/Glow dark nacklace/vol 11/vol 11.webp",
  "/images/Nacklace/Pant Hook Chain/Pant Hook Chain 1.webp",
] as const;

export function safePublicSrc(src: string) {
  if (!src) return encodeURI(CHAIN_IMAGES[0]);
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  try {
    return encodeURI(decodeURI(src));
  } catch {
    return encodeURI(src);
  }
}

export function chainImageForIndex(index: number) {
  return CHAIN_IMAGES[index % CHAIN_IMAGES.length];
}
