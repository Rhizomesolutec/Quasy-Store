import { NextResponse } from "next/server";
import { getCatalogCategories } from "@/lib/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public categories for storefront filters and client components. */
export async function GET() {
  try {
    const { categories, source } = await getCatalogCategories();
    return NextResponse.json({ categories, source });
  } catch (error) {
    console.error("Public categories GET error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load categories",
      },
      { status: 500 }
    );
  }
}
