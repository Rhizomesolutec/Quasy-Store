/** Always return the original URL so Next never proxies through /_next/image. */
export default function directImageLoader({ src }: { src: string }) {
  return src;
}
