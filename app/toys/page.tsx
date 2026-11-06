import type { Metadata } from "next";
import { RetroSectionLanding } from "@/components/catalog/RetroSectionLanding";
import { getCatalogProducts } from "@/lib/catalog";
import { filterShowcaseSub, getShowcaseLine } from "@/lib/showcase";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Toys",
  description: "Action figures, metal cars, and games from Qusay Store.",
};

export const dynamic = "force-dynamic";

export default async function ToysPage() {
  const line = getShowcaseLine("toys");
  if (!line) notFound();
  const { products } = await getCatalogProducts();
  const counts: Record<string, number> = {};
  for (const sub of line.subs) {
    counts[sub] = filterShowcaseSub(products, line, sub).length;
  }
  return <RetroSectionLanding line={line} counts={counts} products={products} />;
}
