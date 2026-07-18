import Image from "next/image";
import { Breadcrumb, BreadcrumbItem } from "./Breadcrumb";
import { Eyebrow } from "./Eyebrow";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  align?: "center" | "left";
  bgImage?: string;
}

export function PageHero({ eyebrow, title, description, breadcrumbs, align = "center", bgImage }: PageHeroProps) {
  const isCenter = align === "center";
  return (
    <section className="relative w-full pt-36 md:pt-44 pb-16 md:pb-20 px-4 md:px-12 lg:px-24 border-b border-white/[0.05] overflow-hidden">
      {/* Background Image or Radial Gradient */}
      {bgImage ? (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={bgImage}
              alt="Background"
              fill
              priority
              className="object-cover opacity-20 grayscale-[0.5] brightness-[0.4] scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-[#070707]/80 z-0 pointer-events-none" />
        </>
      ) : (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06] z-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #E50914 0%, transparent 45%), radial-gradient(circle at 80% 60%, #E50914 0%, transparent 40%)",
          }}
        />
      )}
      <div className={`relative max-w-6xl mx-auto flex flex-col z-10 ${isCenter ? "items-center text-center" : "items-start text-left"}`}>
        <Breadcrumb items={breadcrumbs} className="mb-6" />
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="font-heading text-4xl md:text-6xl text-[#F5F2EF] leading-none mt-4 mb-5">{title}</h1>
        {description && (
          <p className={`font-sans text-sm md:text-base text-[#F5F2EF]/60 leading-relaxed ${isCenter ? "max-w-xl" : "max-w-lg"}`}>
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
