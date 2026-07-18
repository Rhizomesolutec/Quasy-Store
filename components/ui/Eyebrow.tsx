export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`text-[#E50914] uppercase tracking-[0.3em] text-xs font-semibold block ${className}`}>
      {children}
    </span>
  );
}

export function Divider({ className = "" }: { className?: string }) {
  return <div className={`w-24 h-[1px] bg-[#E50914] ${className}`} />;
}
