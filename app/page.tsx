import fs from "fs";
import path from "path";
import Hero from "@/components/Hero";
import DetailsPricing from "@/components/DetailsPricing";
import HangingSpider from "@/components/HangingSpider";
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
  const mobileSequencePath = path.join(process.cwd(), "public", "images", "hero-mobile");
  const isMobileSequenceAvailable = fs.existsSync(mobileSequencePath);

  return (
    <main className="relative w-full flex flex-col items-center">
      <div className="bg-noise" />
      <HangingSpider />

      {/* Wrapper to isolate flex layout from GSAP pin spacer */}
      <div className="w-full block">
        <Hero isMobileSequenceAvailable={isMobileSequenceAvailable} />
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
