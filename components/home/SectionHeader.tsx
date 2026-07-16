"use client";

import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Eyebrow, Divider } from "@/components/ui/Eyebrow";
import { LinkButton } from "@/components/ui/Button";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  ctaHref?: string;
  ctaLabel?: string;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  ctaHref,
  ctaLabel,
  className = "",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <RevealOnScroll
      className={`mb-12 md:mb-16 flex flex-col ${isCenter ? "items-center text-center" : "items-start text-left"} ${className}`}
    >
      <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
      <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-[#D8CFC0] leading-[1.1] tracking-tight max-w-3xl">
        {title}
      </h2>
      <Divider className={`mt-6 mb-6 ${isCenter ? "mx-auto" : ""}`} />
      {description && (
        <p className={`font-sans text-sm md:text-base text-[#D8CFC0]/60 leading-relaxed ${isCenter ? "max-w-xl" : "max-w-lg"}`}>
          {description}
        </p>
      )}
      {ctaHref && ctaLabel && (
        <div className="mt-8">
          <LinkButton href={ctaHref} variant="outline" size="md">
            {ctaLabel}
          </LinkButton>
        </div>
      )}
    </RevealOnScroll>
  );
}
