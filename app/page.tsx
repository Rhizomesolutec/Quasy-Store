import fs from "fs";
import path from "path";
import Hero from "@/components/Hero";
import DetailsPricing from "@/components/DetailsPricing";
import HangingSpider from "@/components/HangingSpider";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { NewArrivalsShowcase } from "@/components/home/NewArrivalsShowcase";
import { BestSellersGrid } from "@/components/home/BestSellersGrid";
import { WhyShopWithUs } from "@/components/home/WhyShopWithUs";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { BrandStoryPreview } from "@/components/home/BrandStoryPreview";
import { NewsletterSubscription } from "@/components/home/NewsletterSubscription";
import { FaqPreview } from "@/components/home/FaqPreview";
import {
  filterBestSellers,
  filterNewArrivals,
  getCatalogCategories,
  getCatalogProducts,
} from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function Home() {
  const mobileSequencePath = path.join(process.cwd(), "public", "images", "hero-mobile");
  const isMobileSequenceAvailable = fs.existsSync(mobileSequencePath);
  const [{ products }, { categories }] = await Promise.all([
    getCatalogProducts(),
    getCatalogCategories(),
  ]);
  const newArrivals = filterNewArrivals(products, 6);
  const bestSellers = filterBestSellers(products, 4);

  return (
    <main className="relative w-full flex flex-col items-center">
      <div className="bg-noise" />
      <HangingSpider />

      <div className="w-full block">
        <Hero isMobileSequenceAvailable={isMobileSequenceAvailable} />
      </div>

      <DetailsPricing />

      <FeaturedCategories
        products={products}
        categories={categories.map((c) => c.name)}
      />
      <NewArrivalsShowcase products={newArrivals} />
      <BestSellersGrid products={bestSellers} />
      <WhyShopWithUs />
      <CustomerReviews products={products} />
      <BrandStoryPreview />
      <NewsletterSubscription />
      <FaqPreview />

      <div className="w-full flex flex-col items-center justify-end pb-8 pt-6 border-t border-white/[0.04]">
        <p className="font-sans text-xs tracking-widest text-[#F5F2EF]/40 uppercase">
          © 1924 The Arachnid Requiem
        </p>
      </div>
    </main>
  );
}
