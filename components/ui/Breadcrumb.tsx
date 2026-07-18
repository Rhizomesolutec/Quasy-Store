import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items, className = "" }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#F5F2EF]/40 font-sans">
        {items.map((item, idx) => (
          <li key={`${item.label}-${idx}`} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className="hover:text-[#E50914] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#F5F2EF]/70">{item.label}</span>
            )}
            {idx < items.length - 1 && <span className="text-[#F5F2EF]/20">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
