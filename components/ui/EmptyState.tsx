import { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center py-24 px-4">
      {icon && (
        <div className="w-16 h-16 rounded-full border border-[#E50914]/30 bg-[#E50914]/[0.06] flex items-center justify-center text-[#E50914] mb-6">
          {icon}
        </div>
      )}
      <h3 className="font-heading text-2xl text-[#F5F2EF] mb-3">{title}</h3>
      {description && (
        <p className="font-sans text-sm text-[#F5F2EF]/50 max-w-sm mb-8 leading-relaxed">{description}</p>
      )}
      {action}
    </div>
  );
}
