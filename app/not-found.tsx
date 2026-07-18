import { LinkButton } from "@/components/ui/Button";
import { Eyebrow, Divider } from "@/components/ui/Eyebrow";

export default function NotFound() {
  return (
    <main className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="bg-noise" />
      <Eyebrow className="mb-4">Lost in the Archives</Eyebrow>
      <h1 className="font-heading text-7xl md:text-9xl text-[#F5F2EF] leading-none mb-4">404</h1>
      <Divider className="mx-auto mb-6" />
      <p className="font-sans text-sm md:text-base text-[#F5F2EF]/60 leading-relaxed max-w-md mb-10">
        This relic isn&apos;t in the catalog. It may have been retired, moved, or never existed at all.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <LinkButton href="/" variant="filled" size="lg">
          Return Home
        </LinkButton>
        <LinkButton href="/shop" variant="outline" size="lg">
          Browse the Shop
        </LinkButton>
      </div>
    </main>
  );
}
