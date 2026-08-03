import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/admin";
import { CATEGORIES } from "@/lib/products";
import { categoryToSlug } from "@/lib/catalog";

export const runtime = "nodejs";

async function requireAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("qusay_admin_session")?.value === "true";
}

function revalidateCategoryPages(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/shop");
  revalidatePath("/categories");
  revalidatePath("/api/categories");
  if (slug) {
    revalidatePath(`/categories/${slug}`);
  }
}

type CategoryRow = {
  name: string;
  description: string | null;
};

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    let rows = (data || []) as CategoryRow[];

    // Bootstrap empty table from the static seed so admin isn't blank on first load.
    if (rows.length === 0) {
      const seed = CATEGORIES.map((name) => ({
        name,
        description: `Premium ${name} pieces`,
      }));
      const seeded = await supabase.from("categories").upsert(seed).select("*");
      if (!seeded.error && seeded.data) {
        rows = seeded.data as CategoryRow[];
      } else {
        rows = seed;
      }
    }

    return NextResponse.json({
      categories: rows.map((row) => ({
        name: row.name,
        description: row.description || `Premium ${row.name} pieces`,
        slug: categoryToSlug(row.name),
      })),
      storage: "supabase",
    });
  } catch (error) {
    console.error("Admin categories GET error:", error);
    return NextResponse.json({
      categories: CATEGORIES.map((name) => ({
        name,
        description: `Premium ${name} pieces`,
        slug: categoryToSlug(name),
      })),
      storage: "static",
      warning:
        error instanceof Error
          ? `Supabase unavailable (${error.message}). Showing static categories.`
          : "Supabase unavailable. Showing static categories.",
    });
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = String(body?.name || "").trim();
    const description = String(body?.description || "").trim();

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required." },
        { status: 400 }
      );
    }

    const payload = {
      name,
      description: description || `Premium ${name} pieces`,
    };

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("categories")
      .upsert([payload], { onConflict: "name" })
      .select("*")
      .single();

    if (error) {
      // Retry plain insert if upsert conflict target isn't configured.
      const inserted = await supabase
        .from("categories")
        .insert([payload])
        .select("*")
        .single();

      if (inserted.error) {
        return NextResponse.json(
          { error: inserted.error.message || error.message },
          { status: 502 }
        );
      }

      revalidateCategoryPages(categoryToSlug(name));
      return NextResponse.json({
        success: true,
        category: {
          name: inserted.data.name,
          description: inserted.data.description,
          slug: categoryToSlug(inserted.data.name),
        },
        storage: "supabase",
      });
    }

    revalidateCategoryPages(categoryToSlug(name));

    return NextResponse.json({
      success: true,
      category: {
        name: data.name,
        description: data.description,
        slug: categoryToSlug(data.name),
      },
      storage: "supabase",
    });
  } catch (error) {
    console.error("Admin categories POST error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while saving category",
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
    const name = searchParams.get("name")?.trim();

    if (!name) {
      return NextResponse.json(
        { error: "Missing category name." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("categories").delete().eq("name", name);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }

    revalidateCategoryPages(categoryToSlug(name));

    return NextResponse.json({
      success: true,
      storage: "supabase",
    });
  } catch (error) {
    console.error("Admin categories DELETE error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while deleting category",
      },
      { status: 500 }
    );
  }
}
