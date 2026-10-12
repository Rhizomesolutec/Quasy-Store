import type { Metadata } from "next";
import { RetroCatalogPage } from "@/components/catalog/RetroCatalogPage";
import { filterHandPicked, getCatalogProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Hand Picked",
  description: "Watches, bracelets, and cuffs picked by hand at Qusay Store.",
};

export const dynamic = "force-dynamic";

export default async function HandPickedPage() {
  const { products } = await getCatalogProducts();

  return (
    <RetroCatalogPage
      eyebrow="For the Wrist"
      title="Hand Picked"
      note="Watches, bracelets, and cuffs we pick by hand — selected one by one for the wrist."
      stamp="Hand Picked"
      stampColor="#FFE600"
      products={filterHandPicked(products)}
    />
  );
}
