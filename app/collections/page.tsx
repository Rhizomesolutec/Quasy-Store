import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { COLLECTIONS } from "@/lib/products";
import { filterByCollection, getCatalogProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Collections",
  description: "Explore the Qusay Store collections — Arachnid Requiem, Midnight Coven, and Gilded Relics.",
};

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const { products } = await getCatalogProducts();

  return (
    <main className="relative w-full flex flex-col items-center">
      <div className="bg-noise" />
      <PageHero
        eyebrow="Editorial"
        title="Collections"
        description="Three distinct registers of the same gothic language — each with its own finish, mood, and story."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Collections" }]}
        bgImage={encodeURI("/images/Nacklace/Spider Collection/vol 7/vol 7.jpg")}
      />

      <section className="w-full flex flex-col">
        {COLLECTIONS.map((collection, idx) => {
          const count = filterByCollection(products, collection.slug).length;
          const reverse = idx % 2 === 1;
          return (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className={`group relative w-full min-h-[70vh] flex flex-col md:flex-row ${reverse ? "md:flex-row-reverse" : ""} border-b border-white/[0.06] overflow-hidden`}
            >
              <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto overflow-hidden">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
              <div className="w-full md:w-1/2 flex flex-col items-start justify-center px-6 md:px-16 py-16 md:py-0">
                <Eyebrow className="mb-4">
                  Collection {String(idx + 1).padStart(2, "0")} · {count} {count === 1 ? "piece" : "pieces"}
                </Eyebrow>
                <h2 className="font-heading text-4xl md:text-5xl text-[#F5F2EF] mb-6 leading-tight">{collection.name}</h2>
                <p className="font-sans text-sm md:text-base text-[#F5F2EF]/60 leading-relaxed max-w-md mb-8">
                  {collection.description}
                </p>
                <span className="font-sans text-xs uppercase tracking-widest text-[#F5F2EF] border-b border-[#E50914] pb-1.5 group-hover:text-[#E50914] transition-colors">
                  View Collection →
                </span>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
