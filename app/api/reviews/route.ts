import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ReviewInput = {
  id?: string;
  productId?: string;
  productSlug?: string;
  productName?: string;
  author?: string;
  rating?: number;
  title?: string;
  body?: string;
  verified?: boolean;
  date?: string;
};

function normalizeReview(row: Record<string, unknown>) {
  return {
    id: String(row.id || ""),
    productId: String(row.productId || row.product_id || ""),
    productSlug: String(row.productSlug || row.product_slug || ""),
    productName: String(row.productName || row.product_name || ""),
    author: String(row.author || "Collector"),
    rating: Number(row.rating) || 5,
    title: String(row.title || ""),
    body: String(row.body || ""),
    verified: row.verified !== false,
    date: String(row.date || ""),
  };
}

async function enrichReviewsWithProducts(
  supabase: ReturnType<typeof createAdminClient>,
  reviews: ReturnType<typeof normalizeReview>[]
) {
  const missingIds = [
    ...new Set(
      reviews
        .filter((r) => r.productId && (!r.productName || !r.productSlug))
        .map((r) => r.productId)
    ),
  ];
  if (missingIds.length === 0) return reviews;

  const { data: products } = await supabase
    .from("products")
    .select("id, slug, name")
    .in("id", missingIds);

  const byId = new Map(
    (products || []).map((p) => [
      String(p.id),
      { slug: String(p.slug || ""), name: String(p.name || "") },
    ])
  );

  return reviews.map((r) => {
    if (!r.productId || (r.productName && r.productSlug)) return r;
    const product = byId.get(r.productId);
    if (!product) return r;
    return {
      ...r,
      productSlug: r.productSlug || product.slug,
      productName: r.productName || product.name,
    };
  });
}

async function resolveProduct(
  supabase: ReturnType<typeof createAdminClient>,
  productId?: string,
  productSlug?: string
) {
  if (productId) {
    const byId = await supabase
      .from("products")
      .select("id,slug,name,rating,reviewCount")
      .eq("id", productId)
      .maybeSingle();
    if (!byId.error && byId.data) return byId.data;
  }
  if (productSlug) {
    const bySlug = await supabase
      .from("products")
      .select("id,slug,name,rating,reviewCount")
      .eq("slug", productSlug)
      .maybeSingle();
    if (!bySlug.error && bySlug.data) return bySlug.data;
  }
  return null;
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

/** Public: list reviews for a product, recent site reviews, or create a customer review. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId")?.trim();
    const productSlug = searchParams.get("slug")?.trim();
    const limit = Math.min(24, Math.max(1, Number(searchParams.get("limit") || 12)));

    const supabase = createAdminClient();

    // Home / feed: recent reviews across all products.
    if (!productId && !productSlug) {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("date", { ascending: false })
        .limit(limit);

      if (error) {
        // Retry without date ordering if column/sort fails.
        const fallback = await supabase.from("reviews").select("*").limit(limit);
        if (fallback.error) throw fallback.error;
        const reviews = await enrichReviewsWithProducts(
          supabase,
          (fallback.data || []).map((r) =>
            normalizeReview(r as Record<string, unknown>)
          )
        );
        return NextResponse.json({ reviews, storage: "supabase" });
      }

      const reviews = await enrichReviewsWithProducts(
        supabase,
        (data || []).map((r) => normalizeReview(r as Record<string, unknown>))
      );
      return NextResponse.json({ reviews, storage: "supabase" });
    }

    let query = supabase.from("reviews").select("*");

    if (productId) query = query.eq("productId", productId);
    else if (productSlug) query = query.eq("productSlug", productSlug);

    const { data, error } = await query.order("date", { ascending: false });

    if (error) {
      // Fallback if productSlug column missing — resolve product then filter by productId.
      if (productSlug && !productId) {
        const product = await resolveProduct(supabase, undefined, productSlug);
        if (product) {
          const retry = await supabase
            .from("reviews")
            .select("*")
            .eq("productId", product.id)
            .order("date", { ascending: false });
          if (!retry.error) {
            return NextResponse.json({
              reviews: (retry.data || []).map((r) =>
                normalizeReview(r as Record<string, unknown>)
              ),
              storage: "supabase",
            });
          }
        }
      }
      throw error;
    }

    return NextResponse.json({
      reviews: (data || []).map((r) => normalizeReview(r as Record<string, unknown>)),
      storage: "supabase",
    });
  } catch (error) {
    console.error("Public reviews GET error:", error);
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
  try {
    const body = (await request.json()) as ReviewInput;
    const author = String(body.author || "").trim();
    const title = String(body.title || "").trim();
    const reviewBody = String(body.body || "").trim();
    const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));

    if (!author || !title || !reviewBody) {
      return NextResponse.json(
        { error: "Author, title, and review body are required." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const product = await resolveProduct(
      supabase,
      body.productId ? String(body.productId) : undefined,
      body.productSlug ? String(body.productSlug) : undefined
    );

    if (!product) {
      return NextResponse.json(
        { error: "Product not found for this review." },
        { status: 404 }
      );
    }

    const payload = {
      id: String(body.id || `rev-${Date.now()}`),
      productId: String(product.id),
      productSlug: String(product.slug),
      productName: String(product.name),
      author,
      rating,
      title,
      body: reviewBody,
      verified: body.verified !== false,
      date:
        String(body.date || "").trim() ||
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
      // Fallback without productSlug/productName if those columns don't exist.
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
      return NextResponse.json(
        { error: saved.error.message },
        { status: 502 }
      );
    }

    await refreshProductRating(supabase, String(product.id));

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
    console.error("Public reviews POST error:", error);
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
