import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("qusay_admin_session")?.value === "true";
}

function normalizeReview(row: Record<string, unknown>) {
  return {
    id: String(row.id || ""),
    productId: String(row.productId || ""),
    productSlug: String(row.productSlug || ""),
    productName: String(row.productName || ""),
    author: String(row.author || "Collector"),
    rating: Number(row.rating) || 5,
    title: String(row.title || ""),
    body: String(row.body || ""),
    verified: row.verified !== false,
    date: String(row.date || ""),
  };
}

async function refreshProductRating(
  supabase: ReturnType<typeof createAdminClient>,
  productId: string
) {
  const { data } = await supabase
    .from("reviews")
    .select("rating")
    .eq("productId", productId);

  const ratings = (data || [])
    .map((r) => Number(r.rating) || 0)
    .filter((n) => n > 0);
  const reviewCount = ratings.length;
  const rating =
    reviewCount > 0
      ? Math.round((ratings.reduce((s, n) => s + n, 0) / reviewCount) * 10) / 10
      : 0;

  await supabase
    .from("products")
    .update({ rating, reviewCount })
    .eq("id", productId);
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("reviews").select("*");

    if (error) throw error;

    const reviews = (data || [])
      .map((r) => normalizeReview(r as Record<string, unknown>))
      .sort((a, b) => b.id.localeCompare(a.id));

    // Fill missing product names/slugs from products table when needed.
    const missing = reviews.filter((r) => !r.productName || !r.productSlug);
    if (missing.length > 0) {
      const ids = Array.from(new Set(missing.map((r) => r.productId).filter(Boolean)));
      if (ids.length > 0) {
        const { data: products } = await supabase
          .from("products")
          .select("id,slug,name")
          .in("id", ids);
        const map = new Map(
          (products || []).map((p) => [String(p.id), p] as const)
        );
        for (const review of reviews) {
          const product = map.get(review.productId);
          if (!product) continue;
          if (!review.productSlug) review.productSlug = String(product.slug || "");
          if (!review.productName) review.productName = String(product.name || "");
        }
      }
    }

    return NextResponse.json({ reviews, storage: "supabase" });
  } catch (error) {
    console.error("Admin reviews GET error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to load reviews",
        reviews: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const author = String(body?.author || "").trim();
    const title = String(body?.title || "").trim();
    const reviewBody = String(body?.body || "").trim();
    const rating = Math.min(5, Math.max(1, Number(body?.rating) || 5));
    const productId = String(body?.productId || "").trim();
    const productSlug = String(body?.productSlug || "").trim();

    if (!author || !title || !reviewBody) {
      return NextResponse.json(
        { error: "Author, title, and review body are required." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    type ProductRef = { id: string; slug: string; name: string };
    let product: ProductRef | null = null;

    if (productId) {
      const byId = await supabase
        .from("products")
        .select("id,slug,name")
        .eq("id", productId)
        .maybeSingle();
      if (!byId.error && byId.data) {
        product = {
          id: String(byId.data.id),
          slug: String(byId.data.slug),
          name: String(byId.data.name),
        };
      }
    }
    if (!product && productSlug) {
      const bySlug = await supabase
        .from("products")
        .select("id,slug,name")
        .eq("slug", productSlug)
        .maybeSingle();
      if (!bySlug.error && bySlug.data) {
        product = {
          id: String(bySlug.data.id),
          slug: String(bySlug.data.slug),
          name: String(bySlug.data.name),
        };
      }
    }

    if (!product) {
      return NextResponse.json(
        { error: "Select a valid product for this review." },
        { status: 400 }
      );
    }

    const payload = {
      id: String(body?.id || `rev-${Date.now()}`),
      productId: String(product.id),
      productSlug: String(product.slug),
      productName: String(product.name),
      author,
      rating,
      title,
      body: reviewBody,
      verified: body?.verified !== false,
      date:
        String(body?.date || "").trim() ||
        new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
    };

    let saved = await supabase
      .from("reviews")
      .upsert([payload])
      .select("*")
      .single();

    if (saved.error) {
      const core = {
        id: payload.id,
        productId: payload.productId,
        author: payload.author,
        rating: payload.rating,
        title: payload.title,
        body: payload.body,
        verified: payload.verified,
        date: payload.date,
      };
      saved = await supabase.from("reviews").upsert([core]).select("*").single();
    }

    if (saved.error) {
      return NextResponse.json({ error: saved.error.message }, { status: 502 });
    }

    await refreshProductRating(supabase, String(product.id));
    revalidatePath(`/shop/${product.slug}`);
    revalidatePath("/shop");

    return NextResponse.json({
      success: true,
      review: normalizeReview({
        ...(saved.data as Record<string, unknown>),
        productSlug: payload.productSlug,
        productName: payload.productName,
      }),
      storage: "supabase",
    });
  } catch (error) {
    console.error("Admin reviews POST error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while saving review",
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
      return NextResponse.json({ error: "Missing review id." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const existing = await supabase
      .from("reviews")
      .select("id,productId,productSlug")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }

    if (existing.data?.productId) {
      await refreshProductRating(supabase, String(existing.data.productId));
    }
    if (existing.data?.productSlug) {
      revalidatePath(`/shop/${existing.data.productSlug}`);
    }

    return NextResponse.json({ success: true, storage: "supabase" });
  } catch (error) {
    console.error("Admin reviews DELETE error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while deleting review",
      },
      { status: 500 }
    );
  }
}
