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

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    let query = await supabase
      .from("orders")
      .select("*")
      .order("date", { ascending: false });

    if (query.error) {
      query = await supabase.from("orders").select("*");
    }

    if (query.error) {
      throw query.error;
    }

    const orders = (query.data || []).map((row) => ({
      id: String(row.id),
      customerName: String(row.customerName || ""),
      customerEmail: String(row.customerEmail || ""),
      items: Array.isArray(row.items) ? row.items : [],
      total: Number(row.total) || 0,
      status: String(row.status || "Pending"),
      date: String(row.date || ""),
      shippingZone: row.shippingZone ? String(row.shippingZone) : undefined,
      paymentMethod: row.paymentMethod ? String(row.paymentMethod) : undefined,
      address: row.address ? String(row.address) : undefined,
      city: row.city ? String(row.city) : undefined,
      postalCode: row.postalCode ? String(row.postalCode) : undefined,
    }));

    // Newest first even if date ordering failed.
    orders.sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.id).localeCompare(String(a.id)));

    return NextResponse.json({ orders, storage: "supabase" });
  } catch (error) {
    console.error("Admin orders GET error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load orders",
        orders: [],
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = String(body?.id || "").trim();
    const status = String(body?.status || "").trim();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Order id and status are required." },
        { status: 400 }
      );
    }

    const allowed = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!allowed.includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${allowed.join(", ")}` },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }

    revalidatePath("/admin");
    revalidatePath("/account");

    return NextResponse.json({
      success: true,
      order: data,
      storage: "supabase",
    });
  } catch (error) {
    console.error("Admin orders PATCH error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while updating order",
      },
      { status: 500 }
    );
  }
}
