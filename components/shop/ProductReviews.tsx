import { Review } from "@/lib/types";
import { Rating } from "@/components/ui/Rating";

export function ProductReviews({ reviews, rating, count }: { reviews: Review[]; rating: number; count: number }) {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-10 pb-8 border-b border-white/[0.08]">
        <div className="flex items-baseline gap-3">
          <span className="font-heading text-5xl text-[#D8CFC0]">{rating.toFixed(1)}</span>
          <div>
            <Rating value={rating} size="md" />
            <p className="font-sans text-[10px] uppercase tracking-widest text-[#D8CFC0]/40 mt-1">
              Based on {count} reviews
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-white/[0.05] pb-8 last:border-b-0">
            <div className="flex items-center justify-between mb-2">
              <Rating value={review.rating} />
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#D8CFC0]/30">{review.date}</span>
            </div>
            <h4 className="font-heading text-base text-[#D8CFC0] mb-1.5">{review.title}</h4>
            <p className="font-sans text-sm text-[#D8CFC0]/60 leading-relaxed mb-2">{review.body}</p>
            <p className="font-sans text-[10px] uppercase tracking-widest text-[#D8CFC0]/40">
              {review.author} {review.verified && <span className="text-[#8E1F1F]">· Verified Purchase</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
