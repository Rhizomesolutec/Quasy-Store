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
    "bg-[#ED5903] text-white border-white hover:bg-[#FFD400] hover:text-[#2A2F93] hover:border-[#FFD400] shadow-sm active:scale-95",
  outline:
    "bg-transparent text-white border-white hover:border-[#ED5903] hover:text-[#FFD400] shadow-sm active:scale-95",
  ghost:
    "bg-transparent text-white border border-white/40 hover:border-[#FFD400] hover:text-[#FFD400]",
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
