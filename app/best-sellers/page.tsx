import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductCard } from "@/components/ui/ProductCard";
import { filterBestSellers, getCatalogProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Best Sellers",
  description: "Customer favourites and top rated pieces from Qusay Store.",
};

export const dynamic = "force-dynamic";

export default async function BestSellersPage() {
  const { products } = await getCatalogProducts();
  const bestSellers = filterBestSellers(products);
  const topRated = [...bestSellers].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <main className="relative w-full flex flex-col items-center">
      <div className="bg-noise" />
      <PageHero
        eyebrow="Customer Favourites"
        title="Best Sellers"
        description="The pieces our collectors return for — proven, trending, and rarely in stock for long."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Best Sellers" }]}
        bgImage={encodeURI("/images/Nacklace/Spider Collection/vol 10/vol 10.webp")}
      />

      <section className="w-full px-4 md:px-12 lg:px-24 py-16 max-w-7xl">
        <RevealOnScroll>
          <div className="flex items-center justify-between mb-10">
            <div>
              <Eyebrow className="mb-2">Top Rated</Eyebrow>
              <h2 className="font-heading text-3xl text-[#F5F2EF]">Highest Rated by Collectors</h2>
            </div>
          </div>
        </RevealOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topRated.map((product, idx) => (
            <RevealOnScroll key={product.id} delay={idx * 0.1}>
              <div className="relative border border-white/[0.08] p-1">
                <span className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-[#E50914] text-[#F5F2EF] font-heading text-sm flex items-center justify-center z-10 shadow-lg">
                  #{idx + 1}
                </span>
                <div className="p-4">
                  <ProductCard product={product} />
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="w-full px-4 md:px-12 lg:px-24 py-8 pb-24 max-w-7xl border-t border-white/[0.06]">
        <RevealOnScroll className="pt-16 mb-10">
          <h2 className="font-heading text-2xl text-[#F5F2EF] text-center">All Best Sellers</h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <ProductGrid products={bestSellers} />
        </RevealOnScroll>
      </section>
    </main>
  );
}
