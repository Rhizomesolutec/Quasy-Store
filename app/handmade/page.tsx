import type { Metadata } from "next";
import { RetroCatalogPage } from "@/components/catalog/RetroCatalogPage";
import { chainImageForIndex } from "@/lib/chainImages";
import { filterHandmade, getCatalogProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Handmade",
  description: "Workshop originals — cast, filed, and finished by hand at Qusay Store.",
};

export const dynamic = "force-dynamic";

export default async function HandmadePage() {
  const { products } = await getCatalogProducts();
  const handmade = filterHandmade(products).map((product, index) => ({
    ...product,
    images: [chainImageForIndex(index)],
  }));

  return (
    <RetroCatalogPage
      eyebrow="From the Bench"
      title="Handmade"
      note="Cast, filed, and finished by hand — every plate in this drawer is a workshop original."
      stamp="Handmade"
      stampColor="#00FF66"
      products={handmade}
    />
  );
}
