import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { CATEGORIES, categoryToSlug, getProductsByCategory } from "@/lib/products";
import { SHARED_SPIDER_IMAGES } from "@/lib/sharedImages";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse Qusay Store jewelry by category — necklaces, glow dark, and bracelets.",
};

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

const CATEGORY_TAGLINES: Record<string, string> = {
  Necklaces: "Chain-drawn pendants built around the house spider motif.",
  "Glow Dark Necklace": "Photoluminescent crystal pieces that charge by day and glow after dark.",
  Bracelets: "Cuffs and chains that translate the cathedral scrollwork to the wrist.",
  "Pant Hook Chain": "Gothic belt-loop and pocket chains crafted with heavy hardware.",
  "Denim Sling Bag": "Tough, custom-washed denim utility bags.",
  "Key Chain": "Miniature talismans and gothic clasps to secure your daily gear.",
  "Jacket Pin": "Gothic pins and brooches to accessorize heavy denim, leather, or blazers.",
  "Metal Hook Bookmark": "Intricately detailed metal hook bookmarks for your grimoires and journals.",
};

export default function CategoriesPage() {
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
          {CATEGORIES.map((category) => {
            const count = getProductsByCategory(category).length;
            const image = CATEGORY_IMAGES[category] || "/images/spider-1.jpg";
            const tagline = CATEGORY_TAGLINES[category] || "Original handcrafted gothic relic.";
            return (
              <Link
                key={category}
                href={`/categories/${categoryToSlug(category)}`}
                className="group relative aspect-[5/4] overflow-hidden rounded-sm bg-black border border-white/[0.06]"
              >
                <Image
                  src={image}
                  alt={category}
                  fill
                  className="object-cover opacity-60 grayscale-[0.2] transition-all duration-700 group-hover:opacity-80 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-8">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#8E1F1F] mb-2">
                    {count} {count === 1 ? "piece" : "pieces"}
                  </span>
                  <h2 className="font-heading text-3xl md:text-4xl text-[#D8CFC0] mb-2 group-hover:text-[#D8CFC0] transition-colors">
                    {category}
                  </h2>
                  <p className="font-sans text-xs text-[#D8CFC0]/60 max-w-xs leading-relaxed mb-4">
                    {tagline}
                  </p>
                  <span className="font-sans text-[10px] uppercase tracking-widest text-[#D8CFC0] border-b border-[#8E1F1F] pb-1 group-hover:text-[#8E1F1F] transition-colors">
                    Explore {category} →
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
