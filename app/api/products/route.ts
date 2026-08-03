import { NextResponse } from "next/server";
import { getCatalogProducts } from "@/lib/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public catalog endpoint for client components (search, cart, recently viewed). */
export async function GET() {
  try {
    const { products, source } = await getCatalogProducts();
    return NextResponse.json({ products, source });
  } catch (error) {
    console.error("Public products GET error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load products",
      },
      { status: 500 }
    );
  }
}
