import { promises as fs } from "fs";
import path from "path";

export type AdminStoredProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  collection: string | null;
  price: number;
  compareAtPrice?: number | null;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  inStock: boolean;
  stockCount: number;
  variantLabel: string;
  tagline: string;
  description: string;
  details: string[];
  shippingInfo: string;
  video?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

const STORE_PATH = path.join(process.cwd(), "data", "admin-products.json");

async function ensureStore() {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.writeFile(STORE_PATH, "[]", "utf8");
  }
}

export async function readLocalProducts(): Promise<AdminStoredProduct[]> {
  await ensureStore();
  const raw = await fs.readFile(STORE_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AdminStoredProduct[]) : [];
  } catch {
    return [];
  }
}

export async function upsertLocalProduct(
  product: AdminStoredProduct
): Promise<AdminStoredProduct> {
  const products = await readLocalProducts();
  const now = new Date().toISOString();
  const index = products.findIndex(
    (item) => item.id === product.id || item.slug === product.slug
  );

  const next: AdminStoredProduct = {
    ...product,
    rating: product.rating ?? 0,
    reviewCount: product.reviewCount ?? 0,
    updatedAt: now,
    createdAt: index >= 0 ? products[index].createdAt || now : now,
  };

  if (index >= 0) {
    products[index] = { ...products[index], ...next };
  } else {
    products.unshift(next);
  }

  await fs.writeFile(STORE_PATH, JSON.stringify(products, null, 2), "utf8");
  return next;
}

export async function deleteLocalProduct(
  id: string
): Promise<AdminStoredProduct | null> {
  const products = await readLocalProducts();
  const index = products.findIndex((item) => item.id === id);
  if (index < 0) return null;

  const [removed] = products.splice(index, 1);
  await fs.writeFile(STORE_PATH, JSON.stringify(products, null, 2), "utf8");
  return removed;
}
