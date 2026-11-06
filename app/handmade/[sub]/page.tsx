import type { Metadata } from "next";
import { RetroCatalogPage } from "@/components/catalog/RetroCatalogPage";
import { getCatalogProducts } from "@/lib/catalog";
import { filterShowcaseSub, findSub, getShowcaseLine } from "@/lib/showcase";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sub: string }>;
}): Promise<Metadata> {
  const { sub } = await params;
  const line = getShowcaseLine("handmade");
  const name = line ? findSub(line, sub) : undefined;
  return { title: name ? `Handmade · ${name}` : "Handmade" };
}

export default async function HandmadeSubPage({
  params,
}: {
  params: Promise<{ sub: string }>;
}) {
  const { sub: slug } = await params;
  const line = getShowcaseLine("handmade");
  if (!line) notFound();
  const sub = findSub(line, slug);
  if (!sub) notFound();
  const { products } = await getCatalogProducts();

  return (
    <RetroCatalogPage
      eyebrow={line.eyebrow}
      title={`${line.name} · ${sub}`}
      note={line.note}
      stamp={sub}
      stampColor={line.stampColor}
      products={filterShowcaseSub(products, line, sub)}
      backHref="/handmade"
      backLabel="◄ Handmade"
    />
  );
}
