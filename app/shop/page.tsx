import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ShopExplorer } from "@/components/shop/ShopExplorer";
import { getCatalogCategories, getCatalogProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse the full Qusay Store catalog of gothic fine jewelry.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [{ products }, { categories }] = await Promise.all([
    getCatalogProducts(),
    getCatalogCategories(),
  ]);

  return (
    <main className="relative w-full flex flex-col items-center">
      <div className="bg-noise" />
      <PageHero
        eyebrow="The Full Catalog"
        title="Shop All Relics"
        description="Every piece currently in the vault — filter by category, finish, size, and price to find the one that finds you."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
        bgImage={encodeURI("/images/Nacklace/Spider Collection/vol 2/vol 2.webp")}
      />
      <ShopExplorer
        products={products}
        categories={categories.map((c) => c.name)}
      />
    </main>
  );
}
