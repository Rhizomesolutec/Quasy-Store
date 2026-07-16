export function Rating({ value, count, size = "sm" }: { value: number; count?: number; size?: "sm" | "md" }) {
  const starSize = size === "md" ? "w-4 h-4" : "w-3 h-3";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(value);
          return (
            <svg
              key={i}
              className={`${starSize} ${filled ? "text-[#8E1F1F]" : "text-[#D8CFC0]/20"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 1.5l2.6 5.6 6.2.6-4.7 4.2 1.4 6.1L10 14.9l-5.5 3.1 1.4-6.1L1.2 7.7l6.2-.6L10 1.5z" />
            </svg>
          );
        })}
      </div>
      {count !== undefined && (
        <span className="font-sans text-[10px] text-[#D8CFC0]/40 tracking-widest">({count})</span>
      )}
    </div>
  );
}
