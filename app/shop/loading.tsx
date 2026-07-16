import { ProductGridSkeleton } from "@/components/ui/Skeleton";

export default function ShopLoading() {
  return (
    <main className="relative w-full flex flex-col items-center">
      <div className="w-full pt-36 md:pt-44 pb-16 px-4 md:px-12 lg:px-24 flex flex-col items-center animate-pulse">
        <div className="h-2 w-24 bg-white/[0.06] mb-6" />
        <div className="h-10 w-64 bg-white/[0.06] mb-4" />
        <div className="h-3 w-80 bg-white/[0.06]" />
      </div>
      <section className="w-full px-4 md:px-12 lg:px-24 py-8 max-w-7xl">
        <ProductGridSkeleton count={8} />
      </section>
    </main>
  );
}
