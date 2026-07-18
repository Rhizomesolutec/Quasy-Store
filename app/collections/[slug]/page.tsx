import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow, Divider } from "@/components/ui/Eyebrow";
import { ShopExplorer } from "@/components/shop/ShopExplorer";
import { COLLECTIONS, getCollectionBySlug, getProductsByCollection } from "@/lib/products";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return { title: "Collection Not Found" };
  return { title: collection.name, description: collection.description };
}

export default async function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = getProductsByCollection(collection.slug);

  return (
    <main className="relative w-full flex flex-col items-center">
      <div className="bg-noise" />

      <section className="relative w-full h-[60vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        <Image src={collection.image} alt={collection.name} fill priority className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/40 via-[#070707]/60 to-[#070707]" />
        <div className="relative z-10 max-w-3xl px-6 text-center flex flex-col items-center">
          <div className="mb-6">
            <Breadcrumb
              items={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: collection.name }]}
            />
          </div>
          <Eyebrow className="mb-4">The Collection</Eyebrow>
          <h1 className="font-heading text-5xl md:text-6xl text-[#F5F2EF] mb-6">{collection.name}</h1>
          <Divider className="mb-6" />
          <p className="font-sans text-sm md:text-base text-[#F5F2EF]/70 leading-relaxed max-w-xl">
            {collection.description}
          </p>
        </div>
      </section>

      <ShopExplorer products={products} title={`${products.length} Pieces in this Collection`} />
    </main>
  );
}
