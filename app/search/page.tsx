import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SearchClient } from "@/components/search/SearchClient";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Quasy Store catalog.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <main className="relative w-full flex flex-col items-center">
      <div className="bg-noise" />
      <PageHero
        eyebrow="Find Your Relic"
        title="Search"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
        bgImage="/images/spider-3.jpg"
      />
      <section className="w-full px-4 md:px-12 lg:px-24 py-16 pb-24">
        <SearchClient initialQuery={q ?? ""} />
      </section>
    </main>
  );
}
