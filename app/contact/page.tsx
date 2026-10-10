import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Accordion } from "@/components/ui/Accordion";
import { ContactForm } from "@/components/contact/ContactForm";
import { STORE, storeMailHref, storeTelHref, storeWhatsAppHref } from "@/lib/store";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Qusay Store in Anakkayam, Malappuram — WhatsApp +91 8075 814 037 or storequsay@gmail.com.",
};

const SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "Pinterest", href: "#" },
  { label: "TikTok", href: "#" },
];

const FAQ = [
  {
    title: "How long does shipping take?",
    content: "Most orders ship within 2–4 business days and arrive within 5–10 days domestically, longer internationally.",
  },
  {
    title: "Do you offer repairs or re-polishing?",
    content: "Yes — we offer lifetime re-polishing on all pieces, and repairs can be requested through our contact form.",
  },
  {
    title: "What is your return policy?",
    content: "Unworn pieces in original packaging can be returned within 30 days for a full refund.",
  },
  {
    title: "Is the silver hypoallergenic?",
    content: "Our sterling silver and gold vermeil pieces are nickel-free and suitable for most sensitive skin.",
  },
];

export default function ContactPage() {
  return (
    <main className="relative w-full flex flex-col items-center">
      <div className="bg-noise" />
      <PageHero
        eyebrow="Reach the Workshop"
        title="Contact"
        description="Questions about an order, a repair, or a collaboration? We read every message."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        bgImage={encodeURI("/images/Nacklace/Spider Collection/vol 5/vol 5.webp")}
      />

      <section className="w-full px-4 md:px-12 lg:px-24 py-20 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          <RevealOnScroll>
            <ContactForm />
          </RevealOnScroll>

          <RevealOnScroll delay={0.1} className="space-y-8">
            {/* Business info card */}
            <div className="border border-white/[0.08] p-6 space-y-4">
              <h3 className="font-heading text-sm uppercase tracking-widest text-[#F5F2EF]">{STORE.name}</h3>
              <div className="font-sans text-sm text-[#F5F2EF]/60 space-y-1.5">
                <p>{STORE.addressLine}</p>
                <p>
                  {STORE.city}, {STORE.region}, {STORE.country}
                </p>
              </div>
              <div className="font-sans text-sm text-[#F5F2EF]/60 space-y-1.5 pt-2 border-t border-white/[0.06]">
                <p>
                  <a href={storeMailHref()} className="hover:text-[#E50914] transition-colors">
                    {STORE.email}
                  </a>
                </p>
                <p>
                  <a href={storeTelHref()} className="hover:text-[#E50914] transition-colors">
                    {STORE.phoneDisplay}
                  </a>
                </p>
                <p>
                  <a
                    href={storeWhatsAppHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#25D366] transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                </p>
              </div>
              <div className="flex gap-4 pt-2 border-t border-white/[0.06]">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/60 hover:text-[#E50914] transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="relative aspect-[4/3] border border-white/[0.08] bg-[#1A0A0A] overflow-hidden">
              <iframe
                title={`${STORE.displayName} location`}
                src={STORE.mapsEmbedUrl}
                className="absolute inset-0 w-full h-full border-0 grayscale contrast-125 opacity-80"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={STORE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 left-3 z-10 bg-black/80 border border-white/[0.1] px-3 py-1.5 font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF] hover:border-[#E50914] hover:text-[#E50914] transition-colors"
              >
                Open in Google Maps ►
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full px-4 md:px-12 lg:px-24 py-20 max-w-3xl border-t border-white/[0.06]">
        <RevealOnScroll>
          <h2 className="font-heading text-2xl text-[#F5F2EF] text-center mb-10">Frequently Asked</h2>
          <Accordion items={FAQ} defaultOpen={null} />
        </RevealOnScroll>
      </section>
    </main>
  );
}
