import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { ShopExplorer } from "@/components/shop/ShopExplorer";
import {
  filterByCategory,
  getCatalogCategories,
  getCatalogProducts,
  resolveCatalogCategoryFromSlug,
} from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const { categories } = await getCatalogCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await resolveCatalogCategoryFromSlug(slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.name,
    description: category.description || `Shop ${category.name} at Qusay Store.`,
  };
}

function getCategoryBgImage(category: string): string {
  switch (category) {
    case "Necklaces":
      return "/images/Nacklace/Spider Collection/vol 2/vol 2.jpg";
    case "Glow Dark Necklace":
      return "/images/Nacklace/Glow dark nacklace/vol 11/vol 11.jpg";
    case "Bracelets":
      return "/images/Nacklace/Bracelet/Bracelet 1.jpg";
    case "Denim Sling Bag":
      return "/images/Nacklace/Denim Sling Bag/Bag 1/Denim sling bag 1.jpg";
    case "Pant Hook Chain":
      return "/images/Nacklace/Pant Hook Chain/Pant Hook Chain 1.jpg";
    default:
      return "/images/spider-1.jpg";
  }
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await resolveCatalogCategoryFromSlug(slug);
  if (!category) notFound();

  const [{ products: all }, { categories }] = await Promise.all([
    getCatalogProducts(),
    getCatalogCategories(),
  ]);
  const products = filterByCategory(all, category.name);
  const categoryNames = categories.map((c) => c.name);

  return (
    <main className="relative w-full flex flex-col items-center">
      <div className="bg-noise" />
      <PageHero
        eyebrow="Category"
        title={category.name}
        description={
          category.description ||
          `Every ${category.name.toLowerCase()} piece currently available in the vault.`
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: category.name },
        ]}
        bgImage={encodeURI(getCategoryBgImage(category.name))}
      />
      <ShopExplorer products={products} categories={categoryNames} />
    </main>
  );
}
