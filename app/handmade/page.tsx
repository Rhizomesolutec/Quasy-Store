import type { Metadata } from "next";
import { RetroSectionLanding } from "@/components/catalog/RetroSectionLanding";
import { getCatalogProducts } from "@/lib/catalog";
import { filterShowcaseSub, getShowcaseLine } from "@/lib/showcase";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Handmade",
  description: "Workshop originals — cast, filed, and finished by hand at Qusay Store.",
};

export const dynamic = "force-dynamic";

export default async function HandmadePage() {
  const line = getShowcaseLine("handmade");
  if (!line) notFound();
  const { products } = await getCatalogProducts();
  const counts: Record<string, number> = {};
  for (const sub of line.subs) {
    counts[sub] = filterShowcaseSub(products, line, sub).length;
  }
  return <RetroSectionLanding line={line} counts={counts} products={products} />;
}
