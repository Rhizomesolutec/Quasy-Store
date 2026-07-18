import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Accordion } from "@/components/ui/Accordion";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductPurchasePanel } from "@/components/shop/ProductPurchasePanel";
import { ProductReviews } from "@/components/shop/ProductReviews";
import { FrequentlyBoughtTogether } from "@/components/shop/FrequentlyBoughtTogether";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { PRODUCTS, getProductBySlug, getRelatedProducts, categoryToSlug } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.tagline,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);

  return (
    <main className="relative w-full flex flex-col items-center pb-24">
      <div className="bg-noise" />

      <div className="w-full px-4 md:px-12 lg:px-24 pt-32 pb-4 max-w-7xl">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: product.category, href: `/categories/${categoryToSlug(product.category)}` },
            { label: product.name },
          ]}
        />
      </div>

      {/* Main product section */}
      <section className="w-full px-4 md:px-12 lg:px-24 max-w-7xl grid md:grid-cols-2 gap-12 md:gap-16 pb-20">
        <ProductGallery images={product.images} alt={product.name} video={product.video} />
        <ProductPurchasePanel product={product} />
      </section>

      {/* Accordion: description / specs / shipping */}
      <section className="w-full px-4 md:px-12 lg:px-24 max-w-4xl pb-20">
        <Accordion
          defaultOpen={0}
          items={[
            {
              title: "Description",
              content: <p>{product.description}</p>,
            },
            {
              title: "Specifications",
              content: (
                <ul className="space-y-1.5 list-disc list-inside">
                  {product.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              ),
            },
            {
              title: "Shipping & Returns",
              content: <p>{product.shippingInfo}</p>,
            },
          ]}
        />
      </section>

      {/* Frequently bought together */}
      <section className="w-full px-4 md:px-12 lg:px-24 max-w-4xl pb-20">
        <FrequentlyBoughtTogether main={product} companions={related.slice(0, 2)} />
      </section>

      {/* Reviews */}
      <section className="w-full px-4 md:px-12 lg:px-24 max-w-4xl pb-24 border-t border-white/[0.06] pt-16">
        <Eyebrow className="text-center mb-3">Customer Reviews</Eyebrow>
        <ProductReviews reviews={product.reviews} rating={product.rating} count={product.reviewCount} productSlug={product.slug} productName={product.name} />
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="w-full px-4 md:px-12 lg:px-24 max-w-7xl pb-24 border-t border-white/[0.06] pt-16">
          <h2 className="font-heading text-3xl text-[#F5F2EF] text-center mb-12">You May Also Like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </main>
  );
}
