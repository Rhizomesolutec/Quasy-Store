import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type CommonProps = {
  variant?: "filled" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 uppercase tracking-widest font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap rounded-none";

const sizes: Record<NonNullable<CommonProps["size"]>, string> = {
  sm: "text-[10px] px-4 py-2",
  md: "text-xs px-6 py-3",
  lg: "text-xs px-8 py-3.5",
};

const variants: Record<NonNullable<CommonProps["variant"]>, string> = {
  filled: "bg-[#171717] text-[#CFC6C1] border border-[#C70024] shadow-[inset_-2px_-2px_0px_#660000,inset_2px_2px_0px_rgba(255,255,255,0.08)] hover:bg-[#C70024] hover:text-[#F5F2EF] hover:shadow-[0_0_15px_rgba(229,9,20,0.4)]",
  outline: "border border-[#C70024] text-[#CFC6C1] bg-transparent hover:bg-[#C70024] hover:text-[#F5F2EF] hover:shadow-[0_0_15px_rgba(229,9,20,0.4)]",
  ghost: "text-[#CFC6C1] hover:text-[#F5F2EF] border border-[#C70024]/20 hover:border-[#C70024] hover:shadow-[0_0_12px_rgba(229,9,20,0.25)] bg-transparent",
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
