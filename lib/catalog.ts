import { createAdminClient } from "@/utils/supabase/admin";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import type { Product, Review } from "@/lib/types";

type RawProduct = Record<string, unknown>;

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : value == null ? fallback : String(value);
}

function asNumber(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  return fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asString(item)).filter(Boolean);
}

function asColors(value: unknown): Product["colors"] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const name = asString(row.name);
      const hex = asString(row.hex, "#000000");
      if (!name) return null;
      return { name, hex };
    })
    .filter((c): c is Product["colors"][number] => Boolean(c));
}

function asReviews(value: unknown): Review[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      return {
        id: asString(row.id),
        author: asString(row.author, "Collector"),
        rating: asNumber(row.rating, 5),
        date: asString(row.date),
        title: asString(row.title),
        body: asString(row.body),
        verified: asBoolean(row.verified, false),
      };
    })
    .filter((r): r is Review => Boolean(r?.id));
}

/** Normalize a Supabase (or local) product row into the storefront Product shape. */
export function normalizeProduct(row: RawProduct): Product {
  const compareAt = row.compareAtPrice;
  const video = row.video;

  const toWebp = (src: string) =>
    src.startsWith("/images/")
      ? src.replace(/\.(jpe?g|png|gif|bmp)(\?.*)?$/i, ".webp$2")
      : src;

  return {
    id: asString(row.id),
    slug: asString(row.slug),
    name: asString(row.name),
    category: asString(row.category),
    collection: asString(row.collection),
    price: asNumber(row.price),
    compareAtPrice:
      compareAt === undefined || compareAt === null || compareAt === ""
        ? undefined
        : asNumber(compareAt),
    images: asStringArray(row.images).map(toWebp),
    colors: asColors(row.colors),
    sizes: [],
    rating: asNumber(row.rating),
    reviewCount: asNumber(row.reviewCount),
    isNew: asBoolean(row.isNew),
    isBestSeller: asBoolean(row.isBestSeller),
    inStock: asBoolean(row.inStock, true),
    stockCount: asNumber(row.stockCount),
    variantLabel: asString(row.variantLabel),
    tagline: asString(row.tagline),
    description: asString(row.description),
    details: asStringArray(row.details),
    shippingInfo: asString(
      row.shippingInfo,
      "Ships in 2–4 business days. Free returns within 30 days."
    ),
    reviews: asReviews(row.reviews),
    video: video ? asString(video) : undefined,
  };
}

export type CatalogResult = {
  products: Product[];
  source: "supabase" | "static";
};

function formatSupabaseError(error: unknown): string {
  if (!error) return "Unknown error";
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "object") {
    const row = error as {
      message?: string;
      code?: string;
      details?: string;
      hint?: string;
    };
    const parts = [row.message, row.code, row.details, row.hint].filter(Boolean);
    if (parts.length > 0) return parts.join(" — ");
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function staticCatalog(): CatalogResult {
  return { products: PRODUCTS.map((p) => ({ ...p, sizes: [] })), source: "static" };
}

/**
 * Load the full catalog from Supabase.
 * Falls back to the static PRODUCTS seed if cloud is empty/unreachable.
 * Always fetches fresh data (no Next fetch cache) so admin additions appear immediately.
 */
export async function getCatalogProducts(): Promise<CatalogResult> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      console.warn("Catalog fetch from Supabase failed:", formatSupabaseError(error));
      return staticCatalog();
    }

    const rows = (data || []) as RawProduct[];
    if (rows.length === 0) {
      return staticCatalog();
    }

    const products = rows
      .map(normalizeProduct)
      .sort((a, b) => b.id.localeCompare(a.id));

    return { products, source: "supabase" };
  } catch (err) {
    console.warn("Catalog fetch from Supabase failed:", formatSupabaseError(err));
    return staticCatalog();
  }
}

export async function getCatalogProductBySlug(
  slug: string
): Promise<Product | undefined> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      return normalizeProduct(data as RawProduct);
    }
  } catch (err) {
    console.warn("Catalog product-by-slug failed:", formatSupabaseError(err));
  }

  const { products } = await getCatalogProducts();
  return products.find((p) => p.slug === slug);
}

export async function getCatalogProductById(
  id: string
): Promise<Product | undefined> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      return normalizeProduct(data as RawProduct);
    }
  } catch (err) {
    console.warn("Catalog product-by-id failed:", formatSupabaseError(err));
  }

  const { products } = await getCatalogProducts();
  return products.find((p) => p.id === id);
}

export function filterBestSellers(products: Product[], limit?: number): Product[] {
  const items = products.filter((p) => p.isBestSeller);
  return limit ? items.slice(0, limit) : items;
}

export function filterNewArrivals(products: Product[], limit?: number): Product[] {
  const items = products.filter((p) => p.isNew);
  return limit ? items.slice(0, limit) : items;
}

export function filterByCategory(products: Product[], category: string): Product[] {
  return products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export const HANDMADE_CATEGORY = "Handmade";
export const HAND_PICKED_CATEGORY = "Hand Picked";

function categoryMatches(category: string, names: string[]) {
  const value = category.toLowerCase();
  return names.some((name) => {
    const n = name.toLowerCase();
    return value === n || value.includes(n);
  });
}

export function isShowcaseCategory(name: string) {
  return categoryMatches(name, ["handmade", "hand picked", "handpicked"]);
}

/** Products tagged Handmade, or necklaces if that category is still empty. */
export function filterHandmade(products: Product[]): Product[] {
  const tagged = products.filter((p) =>
    categoryMatches(p.category, ["handmade"])
  );
  if (tagged.length > 0) return tagged;
  return products.filter((p) => p.category.toLowerCase().includes("necklace"));
}

/** Products tagged Hand Picked, or wrist pieces if that category is still empty. */
export function filterHandPicked(products: Product[]): Product[] {
  const tagged = products.filter((p) =>
    categoryMatches(p.category, ["hand picked", "handpicked", "hand-picked"])
  );
  if (tagged.length > 0) return tagged;
  return products.filter((p) =>
    ["bracelet", "watch", "cuff"].some((kind) =>
      p.category.toLowerCase().includes(kind)
    )
  );
}

export function filterByCollection(
  products: Product[],
  collectionSlug: string
): Product[] {
  return products.filter((p) => p.collection === collectionSlug);
}

export function filterRelated(
  products: Product[],
  product: Product,
  limit = 4
): Product[] {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category || p.collection === product.collection)
    )
    .slice(0, limit);
}

export type CatalogCategory = {
  name: string;
  description: string;
  slug: string;
};

export function categoryToSlug(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Load store categories from Supabase.
 * Merges table rows with any category names used on products, then falls back to static seed.
 */
export async function getCatalogCategories(): Promise<{
  categories: CatalogCategory[];
  source: "supabase" | "static";
}> {
  const byName = new Map<string, CatalogCategory>();

  const add = (name: string, description?: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase();
    if (byName.has(key)) return;
    byName.set(key, {
      name: trimmed,
      description: description?.trim() || `Premium ${trimmed} pieces`,
      slug: categoryToSlug(trimmed),
    });
  };

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (!error && data) {
      for (const row of data as RawProduct[]) {
        add(asString(row.name), asString(row.description));
      }
    }

    // Include categories that exist on products even if missing from the categories table.
    const { products } = await getCatalogProducts();
    for (const product of products) {
      add(product.category);
    }

    if (byName.size > 0) {
      return {
        categories: Array.from(byName.values()).sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
        source: "supabase",
      };
    }
  } catch (err) {
    console.warn("Catalog categories fetch failed:", formatSupabaseError(err));
  }

  for (const name of CATEGORIES) {
    add(name, `Premium ${name} pieces`);
  }

  return {
    categories: Array.from(byName.values()),
    source: "static",
  };
}

export async function resolveCatalogCategoryFromSlug(
  slug: string
): Promise<CatalogCategory | undefined> {
  const normalized = decodeURIComponent(slug).toLowerCase();
  const { categories } = await getCatalogCategories();
  return categories.find(
    (c) => c.slug === normalized || c.name.toLowerCase() === normalized
  );
}
