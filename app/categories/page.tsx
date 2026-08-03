import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import {
  filterByCategory,
  getCatalogCategories,
  getCatalogProducts,
} from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse Qusay Store jewelry by category — necklaces, glow dark, and bracelets.",
};

export const dynamic = "force-dynamic";

const CATEGORY_IMAGES: Record<string, string> = {
  Necklaces: encodeURI("/images/Nacklace/Spider Collection/vol 2/vol 2.jpg"),
  "Glow Dark Necklace": encodeURI("/images/Nacklace/Glow dark nacklace/vol 2/vol 2.jpg"),
  Bracelets: encodeURI("/images/Nacklace/Bracelet/Bracelet 1.jpg"),
  "Pant Hook Chain": encodeURI("/images/Nacklace/Pant Hook Chain/Pant Hook Chain 1.jpg"),
  "Denim Sling Bag": encodeURI("/images/Nacklace/Denim Sling Bag/Bag 1/Denim sling bag 1.jpg"),
  "Key Chain": encodeURI("/images/Nacklace/Keychain/Keychain 1/Keychain 1.jpg"),
  "Jacket Pin": encodeURI("/images/Nacklace/Jacket pin/Jacket pin 1.jpg"),
  "Metal Hook Bookmark": encodeURI("/images/Nacklace/Metal hook bookmark/Metal hook bookmark 1/Metal hook bookmark 1.jpg"),
};

export default async function CategoriesPage() {
  const [{ products }, { categories }] = await Promise.all([
    getCatalogProducts(),
    getCatalogCategories(),
  ]);

  return (
    <main className="relative w-full flex flex-col items-center">
      <div className="bg-noise" />
      <PageHero
        eyebrow="Browse by Type"
        title="Categories"
        description="Core silhouettes and signature lines — each carrying the same gothic scrollwork and hand-finished detail."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Categories" }]}
        bgImage={encodeURI("/images/Nacklace/Pant Hook Chain/Pant Hook Chain 2.jpg")}
      />

      <section className="w-full px-4 md:px-12 lg:px-24 py-20 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {categories.map((category) => {
            const count = filterByCategory(products, category.name).length;
            const image = CATEGORY_IMAGES[category.name] || "/images/spider-1.jpg";
            const tagline =
              category.description || "Original handcrafted gothic relic.";
            return (
              <Link
                key={category.name}
                href={`/categories/${category.slug}`}
                className="group relative aspect-[5/4] overflow-hidden rounded-sm bg-black border border-white/[0.06]"
              >
                <Image
                  src={image}
                  alt={category.name}
                  fill
                  className="object-cover opacity-60 grayscale-[0.2] transition-all duration-700 group-hover:opacity-80 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-8">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#E50914] mb-2">
                    {count} {count === 1 ? "piece" : "pieces"}
                  </span>
                  <h2 className="font-heading text-3xl md:text-4xl text-[#F5F2EF] mb-2 group-hover:text-[#F5F2EF] transition-colors">
                    {category.name}
                  </h2>
                  <p className="font-sans text-xs text-[#F5F2EF]/60 max-w-xs leading-relaxed mb-4">
                    {tagline}
                  </p>
                  <span className="font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF] border-b border-[#E50914] pb-1 group-hover:text-[#E50914] transition-colors">
                    Explore {category.name} →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
