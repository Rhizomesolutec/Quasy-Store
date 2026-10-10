"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { STORE, STORE_ADDRESS, storeMailHref, storeTelHref, storeWhatsAppHref } from "@/lib/store";

const LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Account", href: "/account" },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#0a0a0c] mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-24 py-12 md:py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <div>
          <p className="font-heading text-xl tracking-widest text-[#F5F2EF] mb-3">{STORE.name}</p>
          <p className="font-sans text-xs text-[#F5F2EF]/50 leading-relaxed max-w-xs">
            Gothic fine jewelry, hand-finished in tarnished silver. Cast slowly, packed with care.
          </p>
        </div>

        <div>
          <h3 className="font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/40 mb-4">Visit</h3>
          <address className="not-italic font-sans text-sm text-[#F5F2EF]/70 space-y-1 leading-relaxed">
            <p>{STORE.addressLine}</p>
            <p>
              {STORE.city}, {STORE.region}, {STORE.country}
            </p>
            <a
              href={STORE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block pt-2 text-[10px] uppercase tracking-widest text-[#E50914] hover:text-[#F5F2EF] transition-colors"
            >
              Open in Google Maps ►
            </a>
          </address>
        </div>

        <div>
          <h3 className="font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/40 mb-4">Contact</h3>
          <div className="flex flex-col gap-2 font-sans text-sm text-[#F5F2EF]/70">
            <a href={storeTelHref()} className="hover:text-[#E50914] transition-colors">
              {STORE.phoneDisplay}
            </a>
            <a href={storeWhatsAppHref()} target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors">
              WhatsApp orders
            </a>
            <a href={storeMailHref()} className="hover:text-[#E50914] transition-colors">
              {STORE.email}
            </a>
          </div>
          <nav className="flex flex-wrap gap-4 mt-6">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/50 hover:text-[#E50914] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-white/[0.06] px-4 md:px-12 lg:px-24 py-4">
        <p className="max-w-7xl mx-auto font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/30">
          © {new Date().getFullYear()} {STORE.displayName} · {STORE_ADDRESS}
        </p>
      </div>
    </footer>
  );
}
