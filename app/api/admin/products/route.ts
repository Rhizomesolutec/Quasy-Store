import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/admin";
import {
  readLocalProducts,
  upsertLocalProduct,
  deleteLocalProduct,
  type AdminStoredProduct,
} from "@/lib/adminProductStore";
import { normalizeProduct } from "@/lib/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("qusay_admin_session")?.value === "true";
}

/** Bust storefront caches so new/updated products appear immediately. */
function revalidateStorefront(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/shop");
  revalidatePath("/best-sellers");
  revalidatePath("/new-arrivals");
  revalidatePath("/categories");
  revalidatePath("/collections");
  revalidatePath("/search");
  revalidatePath("/api/products");
  if (slug) {
    revalidatePath(`/shop/${slug}`);
  }
}

function toStoredProduct(body: AdminStoredProduct): AdminStoredProduct {
  return {
    id: String(body.id),
    name: String(body.name).trim(),
    slug: String(body.slug).trim(),
    category: String(body.category),
    collection: body.collection ?? null,
    price: Number(body.price) || 0,
    compareAtPrice:
      body.compareAtPrice === undefined || body.compareAtPrice === null
        ? null
        : Number(body.compareAtPrice),
    stockCount: Number(body.stockCount) || 0,
    isNew: !!body.isNew,
    isBestSeller: !!body.isBestSeller,
    inStock: body.inStock !== false,
    variantLabel: String(body.variantLabel || ""),
    tagline: String(body.tagline || ""),
    description: String(body.description || ""),
    shippingInfo: String(body.shippingInfo || ""),
    video: body.video ? String(body.video) : null,
    images: Array.isArray(body.images) ? body.images : [],
    sizes: Array.isArray(body.sizes) ? body.sizes : [],
    details: Array.isArray(body.details) ? body.details : [],
    colors: Array.isArray(body.colors) ? body.colors : [],
    rating: Number(body.rating) || 0,
    reviewCount: Number(body.reviewCount) || 0,
    createdAt: body.createdAt,
    updatedAt: body.updatedAt,
  };
}

function mapProducts(rows: AdminStoredProduct[]) {
  return rows.map((row) =>
    normalizeProduct(row as unknown as Record<string, unknown>)
  );
}

/** Best-effort local mirror — never throw (Vercel FS is read-only). */
async function mirrorLocal(rows: AdminStoredProduct[]) {
  for (const row of rows) {
    await upsertLocalProduct(toStoredProduct(row));
  }
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    let { data, error } = await supabase
      .from("products")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) {
      const fallback = await supabase.from("products").select("*");
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      throw error;
    }

    const cloud = ((data || []) as AdminStoredProduct[]).map(toStoredProduct);

    // Push any local-only products into Supabase (local/dev only).
    const local = await readLocalProducts();
    if (local.length > 0) {
      const cloudIds = new Set(cloud.map((p) => p.id));
      const missing = local.filter((p) => !cloudIds.has(p.id));
      for (const product of missing) {
        const payload = toStoredProduct(product);
        const upsert = await supabase
          .from("products")
          .upsert([payload])
          .select("*")
          .single();
        if (!upsert.error && upsert.data) {
          cloud.unshift(toStoredProduct(upsert.data as AdminStoredProduct));
        }
      }
    }

    if (cloud.length > 0) {
      // Mirror for local/dev only — must not break the response on Vercel.
      void mirrorLocal(cloud);
      return NextResponse.json({
        products: mapProducts(cloud),
        storage: "supabase",
      });
    }

    if (local.length > 0) {
      return NextResponse.json({
        products: mapProducts(local),
        storage: "local",
        warning: "No products in Supabase yet — showing local cache.",
      });
    }

    return NextResponse.json({
      products: [],
      storage: "supabase",
      warning: "No products found in Supabase.",
    });
  } catch (error) {
    console.error("Admin products GET error:", error);
    const local = await readLocalProducts();
    return NextResponse.json({
      products: mapProducts(local),
      storage: "local",
      warning:
        error instanceof Error
          ? `Supabase unavailable (${error.message}). Showing local cache.`
          : "Supabase unavailable. Showing local cache.",
    });
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as AdminStoredProduct;

    if (!body?.id || !body?.name || !body?.slug || !body?.category) {
      return NextResponse.json(
        { error: "Missing required product fields (id, name, slug, category)." },
        { status: 400 }
      );
    }

    const productPayload = toStoredProduct(body);
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .upsert([productPayload])
      .select("*")
      .single();

    if (error) {
      const local = await upsertLocalProduct(productPayload);
      return NextResponse.json(
        {
          success: false,
          product: local,
          storage: "local",
          error: error.message,
          warning: "Saved locally only — Supabase upsert failed.",
        },
        { status: 502 }
      );
    }

    const saved = toStoredProduct(data as AdminStoredProduct);
    await upsertLocalProduct(saved);
    revalidateStorefront(saved.slug);

    return NextResponse.json({
      success: true,
      product: saved,
      storage: "supabase",
    });
  } catch (error) {
    console.error("Admin products POST error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while saving product",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id")?.trim();

    if (!id) {
      return NextResponse.json(
        { error: "Missing product id." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("products").delete().eq("id", id);

    const removed = await deleteLocalProduct(id);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          warning: removed
            ? "Removed from local cache, but Supabase delete failed."
            : "Supabase delete failed.",
        },
        { status: 502 }
      );
    }

    revalidateStorefront(removed?.slug);

    return NextResponse.json({
      success: true,
      product: removed,
      storage: "supabase",
    });
  } catch (error) {
    console.error("Admin products DELETE error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while deleting product",
      },
      { status: 500 }
    );
  }
}
