import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Eyebrow, Divider } from "@/components/ui/Eyebrow";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { LinkButton } from "@/components/ui/Button";
import { SHARED_SPIDER_IMAGES } from "@/lib/sharedImages";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind Qusay Store — gothic fine jewelry cast in tarnished silver since 1924.",
};

const VALUES = [
  {
    title: "Patience",
    body: "Every mould is hand-finished over days, not minutes. We'd rather ship fewer pieces and get the scrollwork right.",
  },
  {
    title: "Provenance",
    body: "Each collection traces back to an archival sketch or original 1924 catalog page — nothing is designed in a vacuum.",
  },
  {
    title: "Permanence",
    body: "Cast in solid sterling silver and brass, built to oxidize and deepen with age rather than fade.",
  },
];

const TIMELINE = [
  { year: "1924", title: "The Original Catalog", body: "A small silversmith workshop begins casting gothic mourning jewelry for a private clientele." },
  { year: "1962", title: "The Vault Closes", body: "The workshop shutters. Moulds and sketches are archived, believed lost for decades." },
  { year: "2019", title: "Rediscovery", body: "The original moulds resurface at an estate sale, sparking the idea to restore the catalog." },
  { year: "2023", title: "Qusay Store Founded", body: "The Arachnid Requiem collection launches — the first reissue from the restored catalog." },
  { year: "2026", title: "Three Collections Strong", body: "Midnight Coven and Gilded Relics expand the language beyond the flagship silhouette." },
];

const WHY_US = [
  { title: "Hand-Finished", body: "No two pieces oxidize identically — each is finished and inspected individually." },
  { title: "Lifetime Polishing", body: "Free re-polishing and clasp repair for as long as you own the piece." },
  { title: "Slow Production", body: "Small batches, cast to order where possible, to avoid warehousing dead stock." },
  { title: "Discreet Packaging", body: "Every order ships in an unmarked cedar coffret — no branding on the outside." },
];

export default function AboutPage() {
  return (
    <main className="relative w-full flex flex-col items-center">
      <div className="bg-noise" />
      <PageHero
        eyebrow="Since 1924"
        title="Our Story"
        description="A restored catalog of gothic mourning jewelry, cast the same way it was a century ago."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        bgImage={encodeURI("/images/Nacklace/Spider Collection/vol 1/vol 1.jpg")}
      />

      {/* Founder section */}
      <section className="w-full px-4 md:px-12 lg:px-24 py-20 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <RevealOnScroll>
            <div className="relative aspect-[4/5] bg-black rounded-sm overflow-hidden shadow-2xl">
              <Image src={SHARED_SPIDER_IMAGES.one} alt="Founder's workshop" fill className="object-cover" />
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <Eyebrow className="mb-4">From the Founder</Eyebrow>
            <h2 className="font-heading text-3xl md:text-4xl text-[#D8CFC0] mb-6 leading-tight">
              &ldquo;We didn&apos;t design this collection. We excavated it.&rdquo;
            
            </h2>
            <p className="font-sans text-sm md:text-base text-[#D8CFC0]/60 leading-relaxed mb-4">
              When the original moulds surfaced in 2019, most were unusable — corroded, mislabeled, half-melted.
              What survived was enough: sketches of a spider motif meant to symbolize patience, and a heart-shaped
              cavity built to hold a hidden inlay.
            </p>
            <p className="font-sans text-sm md:text-base text-[#D8CFC0]/60 leading-relaxed">
              Qusay Store exists to finish what that first workshop started — slowly, and without cutting corners.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Mission */}
      <section className="w-full px-4 md:px-12 lg:px-24 py-20 max-w-4xl text-center border-t border-white/[0.06]">
        <RevealOnScroll>
          <Eyebrow className="mb-4">Our Mission</Eyebrow>
          <h2 className="font-heading text-3xl md:text-5xl text-[#D8CFC0] mb-6 leading-tight">
            Jewelry that carries weight — literally and otherwise.
          </h2>
          <Divider className="mx-auto mb-6" />
          <p className="font-sans text-base text-[#D8CFC0]/60 leading-relaxed max-w-2xl mx-auto">
            We make pieces meant to be worn for decades, passed down, and re-polished rather than replaced. Every
            collection is a small act of restoration.
          </p>
        </RevealOnScroll>
      </section>

      {/* Values */}
      <section className="w-full px-4 md:px-12 lg:px-24 py-20 max-w-6xl border-t border-white/[0.06]">
        <RevealOnScroll>
          <h2 className="font-heading text-2xl text-[#D8CFC0] text-center mb-12">What We Value</h2>
        </RevealOnScroll>
        <div className="grid md:grid-cols-3 gap-8">
          {VALUES.map((value, idx) => (
            <RevealOnScroll key={value.title} delay={idx * 0.1}>
              <div className="border border-white/[0.08] p-8 h-full">
                <span className="font-heading text-4xl text-[#8E1F1F]/30 block mb-4">{String(idx + 1).padStart(2, "0")}</span>
                <h3 className="font-heading text-xl text-[#D8CFC0] mb-3">{value.title}</h3>
                <p className="font-sans text-sm text-[#D8CFC0]/60 leading-relaxed">{value.body}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="w-full px-4 md:px-12 lg:px-24 py-20 max-w-4xl border-t border-white/[0.06]">
        <RevealOnScroll>
          <h2 className="font-heading text-2xl text-[#D8CFC0] text-center mb-16">A Century of Silence, Then One Reissue</h2>
        </RevealOnScroll>
        <div className="relative pl-8 border-l border-[#8E1F1F]/30 space-y-12">
          {TIMELINE.map((item, idx) => (
            <RevealOnScroll key={item.year} delay={idx * 0.08} className="relative">
              <span className="absolute -left-[calc(2rem+5px)] top-1 w-2.5 h-2.5 rounded-full bg-[#8E1F1F]" />
              <span className="font-heading text-sm text-[#8E1F1F] tracking-widest">{item.year}</span>
              <h3 className="font-heading text-xl text-[#D8CFC0] mt-1 mb-2">{item.title}</h3>
              <p className="font-sans text-sm text-[#D8CFC0]/60 leading-relaxed max-w-lg">{item.body}</p>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="w-full px-4 md:px-12 lg:px-24 py-20 max-w-6xl border-t border-white/[0.06]">
        <RevealOnScroll>
          <h2 className="font-heading text-2xl text-[#D8CFC0] text-center mb-12">Why Choose Qusay Store</h2>
        </RevealOnScroll>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {WHY_US.map((item, idx) => (
            <RevealOnScroll key={item.title} delay={idx * 0.08}>
              <div className="text-center px-2">
                <h3 className="font-heading text-base text-[#D8CFC0] mb-2">{item.title}</h3>
                <p className="font-sans text-xs text-[#D8CFC0]/50 leading-relaxed">{item.body}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full px-4 md:px-12 lg:px-24 py-24 max-w-3xl text-center border-t border-white/[0.06]">
        <RevealOnScroll>
          <h2 className="font-heading text-3xl md:text-4xl text-[#D8CFC0] mb-6">Explore the Full Catalog</h2>
          <p className="font-sans text-sm text-[#D8CFC0]/60 mb-8 leading-relaxed">
            Every piece we make traces back to this story. See where it&apos;s led so far.
          </p>
          <LinkButton href="/shop" variant="filled" size="lg">
            Shop the Collection
          </LinkButton>
        </RevealOnScroll>
      </section>
    </main>
  );
}
