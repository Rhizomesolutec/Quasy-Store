import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Accordion } from "@/components/ui/Accordion";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Qusay Store — order inquiries, repairs, and press.",
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
        bgImage={encodeURI("/images/Nacklace/Spider Collection/vol 5/vol 5.jpg")}
      />

      <section className="w-full px-4 md:px-12 lg:px-24 py-20 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          <RevealOnScroll>
            <ContactForm />
          </RevealOnScroll>

          <RevealOnScroll delay={0.1} className="space-y-8">
            {/* Business info card */}
            <div className="border border-white/[0.08] p-6 space-y-4">
              <h3 className="font-heading text-sm uppercase tracking-widest text-[#F5F2EF]">The Workshop</h3>
              <div className="font-sans text-sm text-[#F5F2EF]/60 space-y-1.5">
                <p>14 Cathedral Row, Suite 3</p>
                <p>New Haven Quarter, NH 06510</p>
              </div>
              <div className="font-sans text-sm text-[#F5F2EF]/60 space-y-1.5 pt-2 border-t border-white/[0.06]">
                <p>hello@qusaystore.com</p>
                <p>+1 (555) 019-2426</p>
              </div>
              <div className="font-sans text-sm text-[#F5F2EF]/60 pt-2 border-t border-white/[0.06]">
                <p>Mon–Fri, 10:00–18:00 EST</p>
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

            {/* Map placeholder */}
            <div className="relative aspect-[4/3] border border-white/[0.08] bg-[#1A0A0A] overflow-hidden flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(216,207,192,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(216,207,192,0.08) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative z-10 flex flex-col items-center gap-2 text-center px-6">
                <svg className="w-8 h-8 text-[#E50914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/40">Map preview unavailable</p>
              </div>
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
