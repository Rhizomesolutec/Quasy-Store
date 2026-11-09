/** Client-safe rules for product image URLs. No Node/Supabase admin imports. */

export const PRODUCT_IMAGE_BUCKET = "product-images";
export const PRODUCT_IMAGE_PREFIX = "products/";
export const PRODUCT_IMAGE_MAX_BYTES = 4 * 1024 * 1024;

export function supabasePublicBase() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  return raw.replace(/\/$/, "");
}

export function isLocalUploadPath(src: string) {
  return src.startsWith("/uploads/");
}

export function isStaticCatalogPath(src: string) {
  return src.startsWith("/images/");
}

export function isSupabaseProductImageUrl(src: string) {
  try {
    const url = new URL(src);
    if (url.protocol !== "https:") return false;
    if (!url.hostname.endsWith(".supabase.co")) return false;
    const base = supabasePublicBase();
    if (base) {
      const expectedHost = new URL(base).hostname;
      if (url.hostname !== expectedHost && !url.hostname.endsWith(".supabase.co")) {
        return false;
      }
    }
    return url.pathname.includes(`/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/`);
  } catch {
    return false;
  }
}

export function isUnsafeImageSrc(src: string) {
  return /^(javascript|vbscript|file|data|blob):/i.test(src.trim());
}

/**
 * Display-only rewrite for leftover local upload paths.
 * Does not mutate stored catalog URLs.
 */
export function rewriteLocalUploadForDisplay(src: string) {
  if (!isLocalUploadPath(src)) return src;
  const base = supabasePublicBase();
  if (!base) return src;
  const rest = src.replace(/^\/uploads\//, "");
  const objectPath = rest.startsWith(PRODUCT_IMAGE_PREFIX)
    ? rest
    : `${PRODUCT_IMAGE_PREFIX}${rest.split("/").pop() || rest}`;
  return `${base}/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/${objectPath}`;
}

export type PersistImagesResult =
  | { ok: true; images: string[] }
  | { ok: false; error: string };

/**
 * URLs allowed to be written into products.images.
 * Preserves existing /images/ and Supabase public URLs as-is.
 * Never persists /uploads/ filesystem paths.
 */
export function persistProductImages(raw: unknown): PersistImagesResult {
  if (raw == null) return { ok: true, images: [] };
  if (!Array.isArray(raw)) {
    return { ok: false, error: "Product images must be an array of URLs." };
  }

  const images: string[] = [];
  const seen = new Set<string>();

  for (const item of raw) {
    const src = typeof item === "string" ? item.trim() : "";
    if (!src) continue;

    if (isUnsafeImageSrc(src)) {
      return { ok: false, error: "Invalid image URL." };
    }

    if (isLocalUploadPath(src)) {
      return {
        ok: false,
        error:
          "Local upload paths cannot be saved on a product. Upload the photo again so it is stored in cloud storage.",
      };
    }

    if (!isStaticCatalogPath(src) && !isSupabaseProductImageUrl(src)) {
      return {
        ok: false,
        error:
          "Only catalog photos or verified cloud storage URLs can be saved on a product.",
      };
    }

    if (seen.has(src)) continue;
    seen.add(src);
    images.push(src);
  }

  return { ok: true, images };
}
