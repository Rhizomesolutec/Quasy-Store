/** Resolve catalog / upload / storage URLs so product photos load without the Next optimizer. */

const STORAGE_BUCKET = "product-images";

function supabasePublicBase() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  return raw.replace(/\/$/, "");
}

function encodeSrc(src: string) {
  try {
    return encodeURI(decodeURI(src));
  } catch {
    return encodeURI(src);
  }
}

/** Rewrite local-only upload paths to the public storage URL used on live. */
export function rewriteStoredImageSrc(src?: string | null): string {
  if (!src) return "";
  const value = src.trim();
  if (!value) return "";

  if (value.startsWith("/uploads/")) {
    const base = supabasePublicBase();
    if (base) {
      const rest = value.replace(/^\/uploads\//, "");
      const objectPath = rest.startsWith("products/")
        ? rest
        : `products/${rest.split("/").pop() || rest}`;
      return `${base}/storage/v1/object/public/${STORAGE_BUCKET}/${objectPath}`;
    }
  }

  return value;
}

/**
 * Turn a stored product image path into a browser-loadable URL.
 * Local `/uploads/` paths are rewritten to the public storage bucket used on live.
 */
export function resolveProductImageSrc(src?: string | null): string {
  const rewritten = rewriteStoredImageSrc(src);
  if (!rewritten) return "";
  if (/^(data:|blob:)/i.test(rewritten)) return rewritten;
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
