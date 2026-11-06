import type { Metadata } from "next";
import { RetroCatalogPage } from "@/components/catalog/RetroCatalogPage";
import { getCatalogProducts } from "@/lib/catalog";
import { filterShowcaseLine, getShowcaseLine } from "@/lib/showcase";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Crystals",
  description: "Crystals from the Qusay vault.",
};

export const dynamic = "force-dynamic";

export default async function CrystalsPage() {
  const line = getShowcaseLine("crystals");
  if (!line) notFound();
  const { products } = await getCatalogProducts();

  return (
    <RetroCatalogPage
      eyebrow={line.eyebrow}
      title={line.name}
      note={line.note}
      stamp={line.stamp}
      stampColor={line.stampColor}
      products={filterShowcaseLine(products, line)}
    />
  );
}
