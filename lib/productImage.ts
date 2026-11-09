import {
  isLocalUploadPath,
  rewriteLocalUploadForDisplay,
} from "@/lib/imageStorage";

function encodeSrc(src: string) {
  try {
    return encodeURI(decodeURI(src));
  } catch {
    return encodeURI(src);
  }
}

/**
 * Turn a stored product image path into a browser-loadable URL.
 * Does not change values stored in the database.
 */
export function resolveProductImageSrc(src?: string | null): string {
  if (!src) return "";
  const value = src.trim();
  if (!value) return "";
  if (/^(data:|blob:)/i.test(value)) return "";

  const rewritten = isLocalUploadPath(value)
    ? rewriteLocalUploadForDisplay(value)
    : value;

  if (!rewritten) return "";
  return encodeSrc(rewritten);
}

export function normalizeImageList(images: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of images) {
    const src = resolveProductImageSrc(raw);
    if (!src || seen.has(src)) continue;
    seen.add(src);
    out.push(src);
  }
  return out;
}

export { rewriteLocalUploadForDisplay as rewriteStoredImageSrc };
