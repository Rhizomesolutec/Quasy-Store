import { STORE } from "./store";
import { formatPrice } from "./utils";

export interface WhatsAppOrderItem {
  name: string;
  variant?: string;
  size?: string;
  quantity: number;
  price: number;
}

export interface WhatsAppOrderDetails {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  shippingZone?: "domestic" | "international";
  items: WhatsAppOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

/** Store number that receives orders, digits only (country code + number). */
export function getStoreWhatsAppNumber(): string {
  return (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || STORE.whatsappDigits).replace(/\D/g, "");
}

export function isWhatsAppConfigured(): boolean {
  return getStoreWhatsAppNumber().length >= 10;
}

export function buildOrderMessage(order: WhatsAppOrderDetails): string {
  const lines: string[] = [];

  lines.push("*NEW ORDER — QUSAY STORE*");
  lines.push(`Order ID: ${order.orderId}`);
  lines.push("");

  lines.push("*Items*");
  order.items.forEach((item, idx) => {
    const variant = [item.variant, item.size].filter(Boolean).join(" / ");
    lines.push(
      `${idx + 1}. ${item.name}${variant ? ` (${variant})` : ""}`
    );
    lines.push(
      `   Qty ${item.quantity} x ${formatPrice(item.price)} = ${formatPrice(
        item.price * item.quantity
      )}`
    );
  });
  lines.push("");

  lines.push("*Payment Summary*");
  lines.push(`Subtotal: ${formatPrice(order.subtotal)}`);
  lines.push(`Shipping: ${formatPrice(order.shipping)}`);
  lines.push(`*Total: ${formatPrice(order.total)}*`);
  lines.push("");

  lines.push("*Customer*");
  lines.push(`Name: ${order.customerName}`);
  lines.push(`Phone: ${order.customerPhone}`);
  if (order.customerEmail) lines.push(`Email: ${order.customerEmail}`);

  const addressParts = [order.address, order.city, order.postalCode].filter(Boolean);
  if (addressParts.length > 0) {
    lines.push(`Address: ${addressParts.join(", ")}`);
  }
  if (order.shippingZone) {
    lines.push(
      `Shipping: ${order.shippingZone === "domestic" ? "Domestic" : "International"}`
    );
  }
  lines.push("");
  lines.push("Please share the payment details to complete this order.");

  return lines.join("\n");
}

export function buildWhatsAppUrl(message: string, phoneNumber?: string): string {
  const number = (phoneNumber || getStoreWhatsAppNumber()).replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildOrderWhatsAppUrl(order: WhatsAppOrderDetails): string {
  return buildWhatsAppUrl(buildOrderMessage(order));
}
