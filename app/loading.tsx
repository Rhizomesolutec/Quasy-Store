export default function Loading() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-2 border-[#F5F2EF]/20 border-t-[#E50914] rounded-full animate-spin" />
      <p className="font-sans text-xs tracking-widest text-[#F5F2EF]/40 uppercase animate-pulse">Loading</p>
    </div>
  );
}
