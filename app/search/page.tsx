import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SearchClient } from "@/components/search/SearchClient";
import { getCatalogProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Qusay Store catalog.",
};

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const { products } = await getCatalogProducts();

  return (
    <main className="relative w-full flex flex-col items-center">
      <div className="bg-noise" />
      <PageHero
        eyebrow="Find Your Relic"
        title="Search"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
        bgImage="/images/spider-3.webp"
      />
      <section className="w-full px-4 md:px-12 lg:px-24 py-16 pb-24">
        <SearchClient initialQuery={q ?? ""} products={products} />
      </section>
    </main>
  );
}
