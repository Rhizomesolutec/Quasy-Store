import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { filterNewArrivals, getCatalogProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "The latest additions to the Qusay Store catalog.",
};

export const dynamic = "force-dynamic";

export default async function NewArrivalsPage() {
  const { products } = await getCatalogProducts();
  const arrivals = filterNewArrivals(products);
  const [feature, ...rest] = arrivals;

  return (
    <main className="relative w-full flex flex-col items-center">
      <div className="bg-noise" />
      <PageHero
        eyebrow="Just Restored"
        title="New Arrivals"
        description="Freshly cast, freshly catalogued. The newest relics to enter the vault."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "New Arrivals" }]}
        bgImage={encodeURI("/images/Nacklace/Spider Collection/vol 8/vol 8.webp")}
      />

      {feature && (
        <section className="w-full px-4 md:px-12 lg:px-24 py-20 max-w-6xl">
          <RevealOnScroll>
            <Link href={`/shop/${feature.slug}`} className="group grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="relative aspect-[4/5] bg-black rounded-sm overflow-hidden shadow-2xl">
                <Image
                  src={feature.images[0]}
                  alt={feature.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 bg-[#F5F2EF]/10 border border-[#F5F2EF]/30 text-[#F5F2EF] text-[9px] uppercase tracking-widest font-semibold px-2 py-1 backdrop-blur-sm">
                  New
                </span>
              </div>
              <div>
                <Eyebrow className="mb-4">Featured Arrival</Eyebrow>
                <h2 className="font-heading text-4xl md:text-5xl text-[#F5F2EF] mb-5 leading-tight">{feature.name}</h2>
                <p className="font-sans text-sm md:text-base text-[#F5F2EF]/60 leading-relaxed mb-8 max-w-md">
                  {feature.tagline}
                </p>
                <div className="flex items-center gap-4">
                  <span className="font-heading text-2xl text-[#FF2A45] drop-shadow-[0_0_6px_rgba(255,42,69,0.4)]">{formatPrice(feature.price)}</span>
                  <span className="font-sans text-xs uppercase tracking-widest text-[#F5F2EF] border-b border-[#E50914] pb-1 group-hover:text-[#E50914] transition-colors">
                    Shop Now →
                  </span>
                </div>
              </div>
            </Link>
          </RevealOnScroll>
        </section>
      )}

      <section className="w-full px-4 md:px-12 lg:px-24 py-8 pb-24 max-w-7xl">
        <RevealOnScroll>
          <h2 className="font-heading text-2xl text-[#F5F2EF] mb-10 text-center">More Recently Added</h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <ProductGrid products={rest.length > 0 ? rest : arrivals} />
        </RevealOnScroll>
      </section>
    </main>
  );
}
