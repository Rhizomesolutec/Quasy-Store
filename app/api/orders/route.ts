import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OrderItemInput = {
  productId?: string;
  slug?: string;
  name?: string;
  price?: number;
  image?: string;
  variant?: string;
  size?: string;
  quantity?: number;
};

function normalizeItems(items: OrderItemInput[]) {
  return items
    .map((item) => ({
      productId: String(item.productId || ""),
      slug: String(item.slug || ""),
      name: String(item.name || "Untitled Piece"),
      price: Number(item.price) || 0,
      image: String(item.image || ""),
      variant: String(item.variant || ""),
      size: item.size ? String(item.size) : undefined,
      quantity: Math.max(1, Number(item.quantity) || 1),
    }))
    .filter((item) => item.name);
}

/** Public checkout: save order + profile into Supabase with service role. */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const customerName = String(body?.customerName || "").trim();
    const customerEmail = String(body?.customerEmail || "").trim().toLowerCase();
    const customerPhone = String(body?.customerPhone || "").trim();
    const address = String(body?.address || "").trim();
    const city = String(body?.city || "").trim();
    const postalCode = String(body?.postalCode || "").trim();
    const shippingZone = body?.shippingZone === "international" ? "international" : "domestic";
    const paymentMethod = String(body?.paymentMethod || "whatsapp");
    const items = normalizeItems(Array.isArray(body?.items) ? body.items : []);
    const total = Number(body?.total);

    if (!customerName || !customerEmail) {
      return NextResponse.json(
        { error: "Customer name and email are required." },
        { status: 400 }
      );
    }

    // WhatsApp is the payment channel, so the number is how the store reaches the buyer.
    if (!customerPhone || customerPhone.replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        { error: "A valid WhatsApp phone number is required." },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        { error: "Order must include at least one item." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json(
        { error: "Invalid order total." },
        { status: 400 }
      );
    }

    const orderId =
      String(body?.id || "").trim() ||
      `QS-${Math.floor(10000 + Math.random() * 90000)}`;
    const date = new Date().toISOString().split("T")[0];

    const orderPayload = {
      id: orderId,
      customerName,
      customerEmail,
      customerPhone,
      items,
      total,
      status: "Pending",
      date,
      shippingZone,
      paymentMethod,
      address,
      city,
      postalCode,
    };

    const supabase = createAdminClient();

    // Profile upsert is best-effort (table may use email as PK).
    const { error: profileError } = await supabase.from("profiles").upsert(
      [
        {
          email: customerEmail,
          fullName: customerName,
          address,
          city,
          postalCode,
        },
      ],
      { onConflict: "email" }
    );

    if (profileError) {
      // Retry without onConflict in case the constraint name differs.
      const retry = await supabase.from("profiles").upsert([
        {
          email: customerEmail,
          fullName: customerName,
          address,
          city,
          postalCode,
        },
      ]);
      if (retry.error) {
        console.error("Profile upsert warning:", retry.error.message);
      }
    }

    const corePayload = {
      id: orderId,
      customerName,
      customerEmail,
      items,
      total,
      status: "Pending",
      date,
    };

    // Widest payload first, narrowing each time a column is missing from the table.
    // The phone-only step keeps the WhatsApp contact even on the older v2 schema.
    const attempts = [
      orderPayload,
      { ...corePayload, customerPhone, paymentMethod },
      { ...corePayload, customerPhone },
      corePayload,
    ];

    let saved = await supabase
      .from("orders")
      .insert([attempts[0]])
      .select("*")
      .single();

    for (let i = 1; i < attempts.length && saved.error; i += 1) {
      saved = await supabase
        .from("orders")
        .insert([attempts[i]])
        .select("*")
        .single();
    }

    if (!saved.error && !saved.data?.customerPhone) {
      console.warn(
        `Order ${orderId} saved without customerPhone — run the orders migration to add the column.`
      );
    }

    if (saved.error) {
      console.error("Order insert failed:", saved.error);
      return NextResponse.json(
        { error: saved.error.message || "Failed to save order." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      order: saved.data,
      storage: "supabase",
    });
  } catch (error) {
    console.error("Public orders POST error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while placing order",
      },
      { status: 500 }
    );
  }
}
