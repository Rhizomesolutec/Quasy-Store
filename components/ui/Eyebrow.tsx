export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 text-[#E50914] uppercase tracking-[0.3em] text-xs font-bold font-mono ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] shadow-[0_0_6px_#E50914] animate-pulse" />
      <span>{children}</span>
    </span>
  );
}

export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`w-28 h-[2px] bg-gradient-to-r from-[#E50914] via-[#FF2A45] to-[#E50914] shadow-[0_0_8px_rgba(229,9,20,0.4)] ${className}`} />
  );
}
