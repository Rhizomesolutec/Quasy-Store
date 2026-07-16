export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="aspect-[4/5] bg-white/[0.04] rounded-sm" />
      <div className="space-y-2">
        <div className="h-2 w-1/3 bg-white/[0.06]" />
        <div className="h-4 w-2/3 bg-white/[0.06]" />
        <div className="h-2 w-1/4 bg-white/[0.06]" />
        <div className="h-3 w-1/5 bg-white/[0.06]" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
