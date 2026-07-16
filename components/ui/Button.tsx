import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type CommonProps = {
  variant?: "filled" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 uppercase tracking-widest font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap";

const sizes: Record<NonNullable<CommonProps["size"]>, string> = {
  sm: "text-[10px] px-4 py-2",
  md: "text-xs px-6 py-3",
  lg: "text-xs px-8 py-3.5",
};

const variants: Record<NonNullable<CommonProps["variant"]>, string> = {
  filled: "bg-[#8E1F1F] text-[#D8CFC0] hover:bg-[#a32727] shadow-[0_0_20px_rgba(142,31,31,0.2)]",
  outline: "border border-[#8E1F1F] text-[#D8CFC0] hover:bg-[#8E1F1F]",
  ghost: "text-[#D8CFC0]/70 hover:text-[#D8CFC0] border border-white/[0.08] hover:border-white/[0.15]",
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
