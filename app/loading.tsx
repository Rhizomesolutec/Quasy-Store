export default function Loading() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-2 border-[#D8CFC0]/20 border-t-[#8E1F1F] rounded-full animate-spin" />
      <p className="font-sans text-xs tracking-widest text-[#D8CFC0]/40 uppercase animate-pulse">Loading</p>
    </div>
  );
}
