import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type CommonProps = {
  variant?: "filled" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-1.5 uppercase tracking-wider font-pixel transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap rounded-none border-2 retro-box-shadow";

const sizes: Record<NonNullable<CommonProps["size"]>, string> = {
  sm: "text-[8px] px-3 py-1.5",
  md: "text-[9px] sm:text-[10px] px-4 py-2.5",
  lg: "text-[10px] sm:text-xs px-6 py-3",
};

const variants: Record<NonNullable<CommonProps["variant"]>, string> = {
  filled:
    "bg-black text-[#00FF66] border-white/60 hover:border-[#FF0055] hover:text-white shadow-sm active:scale-95",
  outline:
    "bg-black text-white border-white/60 hover:border-[#FF0055] hover:text-[#00FF66] shadow-sm active:scale-95",
  ghost:
    "bg-transparent text-white border border-white/40 hover:border-[#00FF66] hover:text-[#00FF66]",
};

export function Button({
  variant = "filled",
  size = "md",
  className = "",
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "filled",
  size = "md",
  className = "",
  children,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
