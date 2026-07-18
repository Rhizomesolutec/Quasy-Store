import Hero from "@/components/Hero";
import DetailsPricing from "@/components/DetailsPricing";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { NewArrivalsShowcase } from "@/components/home/NewArrivalsShowcase";
import { BestSellersGrid } from "@/components/home/BestSellersGrid";
import { FeaturedCollectionBanner } from "@/components/home/FeaturedCollectionBanner";
import { WhyShopWithUs } from "@/components/home/WhyShopWithUs";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { BrandStoryPreview } from "@/components/home/BrandStoryPreview";
import { ShoppingExperience } from "@/components/home/ShoppingExperience";
import { FeaturedProductsCarousel } from "@/components/home/FeaturedProductsCarousel";
import { LimitedEditionBanner } from "@/components/home/LimitedEditionBanner";
import { NewsletterSubscription } from "@/components/home/NewsletterSubscription";
import { SocialGallery } from "@/components/home/SocialGallery";
import { FaqPreview } from "@/components/home/FaqPreview";
import { FinalCta } from "@/components/home/FinalCta";

export default function Home() {
  return (
    <main className="relative w-full flex flex-col items-center">
      <div className="bg-noise" />

      {/* Existing hero — unchanged */}
      <Hero />

      {/* Refined transition spacer */}
      <div className="w-full h-[2vh] md:h-[12vh] flex items-center justify-center" aria-hidden>
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-[1px] h-4 md:h-16 bg-gradient-to-b from-transparent via-[#E50914]/40 to-transparent" />
        </div>
      </div>

      {/* Existing product showcase — unchanged */}
      <DetailsPricing />

      {/* New premium landing sections */}
      <FeaturedCategories />
      <NewArrivalsShowcase />
      <BestSellersGrid />
      <FeaturedCollectionBanner />
      <WhyShopWithUs />
      <CustomerReviews />
      <BrandStoryPreview />
      <ShoppingExperience />
      <FeaturedProductsCarousel />
      <LimitedEditionBanner />
      <NewsletterSubscription />
      <SocialGallery />
      <FaqPreview />
      <FinalCta />

      {/* Closing mark — preserved brand footer line */}
      <div className="w-full flex flex-col items-center justify-end pb-14 pt-8 border-t border-white/[0.04]">
        <p className="font-sans text-xs tracking-widest text-[#F5F2EF]/40 uppercase">
          © 1924 The Arachnid Requiem
        </p>
      </div>
    </main>
  );
}
