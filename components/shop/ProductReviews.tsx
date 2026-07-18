"use client";

import { useState, useEffect } from "react";
import { Review } from "@/lib/types";
import { Rating } from "@/components/ui/Rating";

const LS_KEY = (slug: string) => `quasy_reviews_${slug}`;

export function ProductReviews({
  reviews,
  rating,
  count,
  productSlug,
  productName,
}: {
  reviews: Review[];
  rating: number;
  count: number;
  productSlug: string;
  productName: string;
}) {
  const [localReviews, setLocalReviews] = useState<Review[]>(reviews);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [author, setAuthor] = useState("");
  const [ratingInput, setRatingInput] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // On mount: merge any localStorage reviews with the default product reviews
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY(productSlug));
      if (stored) {
        const parsed: Review[] = JSON.parse(stored);
        // Merge: stored reviews first (newest), then seed reviews that are NOT duplicated
        const storedIds = new Set(parsed.map((r) => r.id));
        const merged = [...parsed, ...reviews.filter((r) => !storedIds.has(r.id))];
        setLocalReviews(merged);
      }
    } catch {
      // ignore parse errors
    }
  }, [productSlug]);

  // Persist to localStorage whenever localReviews changes (but only user-submitted ones)
  const persistToStorage = (updatedReviews: Review[]) => {
    try {
      // Store ALL reviews (seed + submitted) under the product slug key
      // so admin can see the full list with any deletions applied
      const existing = localReviews.map((r) => ({ ...r, productSlug, productName }));
      const allWithMeta = updatedReviews.map((r) => ({ ...r, productSlug, productName }));
      localStorage.setItem(LS_KEY(productSlug), JSON.stringify(allWithMeta));
    } catch {
      // ignore storage errors
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !title || !body) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      author,
      rating: ratingInput,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      title,
      body,
      verified: true,
    };

    const updated = [newReview, ...localReviews];
    setLocalReviews(updated);
    persistToStorage(updated);

    setAuthor("");
    setTitle("");
    setBody("");
    setRatingInput(5);
    setSubmitSuccess(true);
    setIsFormOpen(false);
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const reviewsCount = localReviews.length;
  const averageRating =
    reviewsCount > 0
      ? localReviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount
      : rating;

  return (
    <div>
      {/* Top Section with Average & Write Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/[0.08]">
        <div className="flex items-baseline gap-3">
          <span className="font-heading text-5xl text-[#F5F2EF]">{averageRating.toFixed(1)}</span>
          <div>
            <Rating value={averageRating} size="md" />
            <p className="font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/40 mt-1">
              Based on {reviewsCount} reviews
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setSubmitSuccess(false);
          }}
          className="px-6 py-2.5 bg-[#0B0B0B] text-[#CFC6C1] border border-[#E50914] hover:bg-[#660000] hover:text-[#F5F2EF] hover:shadow-[0_0_15px_rgba(229,9,20,0.35)] transition-all duration-300 text-[10px] uppercase tracking-widest font-heading rounded-md w-full sm:w-auto text-center"
        >
          {isFormOpen ? "Cancel Review" : "Write a Review"}
        </button>
      </div>

      {/* Success Notification */}
      {submitSuccess && (
        <div className="mb-8 border border-[#E50914]/40 bg-[#1A0A0A] p-4 text-center shadow-[0_0_15px_rgba(229,9,20,0.15)] animate-fade-in">
          <p className="font-heading text-sm text-[#E50914] uppercase tracking-wider mb-1">Review Cast Successfully</p>
          <p className="font-sans text-xs text-[#F5F2EF]/60">Your words have been etched into the vault of the Upside Down.</p>
        </div>
      )}

      {/* Interactive Review Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mb-12 p-6 md:p-8 bg-[#0B0B0B]/80 border border-white/[0.06] rounded-md shadow-2xl shadow-black/50 space-y-6 animate-slide-down"
        >
          <h3 className="font-heading text-lg text-[#F5F2EF] tracking-wider border-b border-white/[0.06] pb-3">
            Cast Your Assessment
          </h3>

          {/* Rating Stars Input */}
          <div className="space-y-2">
            <label className="block font-sans text-xs uppercase tracking-widest text-[#F5F2EF]/60">Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingInput(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="text-2xl transition-all duration-200 focus:outline-none hover:scale-110"
                >
                  <span
                    className={
                      star <= (hoverRating !== null ? hoverRating : ratingInput)
                        ? "text-[#E50914] drop-shadow-[0_0_4px_rgba(229,9,20,0.6)]"
                        : "text-[#F5F2EF]/20"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Author Name */}
            <div className="space-y-2">
              <label className="block font-sans text-xs uppercase tracking-widest text-[#F5F2EF]/60">Your Name</label>
              <input
                required
                type="text"
                placeholder="e.g. Dustin Henderson"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-[#1A0A0A] border border-white/[0.08] px-4 py-3 text-sm text-[#F5F2EF] placeholder-[#F5F2EF]/30 outline-none focus:border-[#E50914]/50 transition-colors"
              />
            </div>

            {/* Review Title */}
            <div className="space-y-2">
              <label className="block font-sans text-xs uppercase tracking-widest text-[#F5F2EF]/60">Review Summary</label>
              <input
                required
                type="text"
                placeholder="e.g. Breathtaking details!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#1A0A0A] border border-white/[0.08] px-4 py-3 text-sm text-[#F5F2EF] placeholder-[#F5F2EF]/30 outline-none focus:border-[#E50914]/50 transition-colors"
              />
            </div>
          </div>

          {/* Review Body */}
          <div className="space-y-2">
            <label className="block font-sans text-xs uppercase tracking-widest text-[#F5F2EF]/60">Your Review</label>
            <textarea
              required
              rows={4}
              placeholder="Share your thoughts on the craftsmanship and details..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-[#1A0A0A] border border-white/[0.08] px-4 py-3 text-sm text-[#F5F2EF] placeholder-[#F5F2EF]/30 outline-none focus:border-[#E50914]/50 transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#0B0B0B] text-[#CFC6C1] border border-[#E50914] hover:bg-[#660000] hover:text-[#F5F2EF] hover:shadow-[0_0_15px_rgba(229,9,20,0.35)] transition-all duration-300 text-xs uppercase tracking-widest font-heading rounded-md font-semibold"
          >
            Submit Review
          </button>
        </form>
      )}

      {/* Review List */}
      <div className="space-y-8">
        {localReviews.length === 0 ? (
          <p className="font-sans text-sm text-[#F5F2EF]/40 text-center py-6">
            Be the first to leave a review for this relic.
          </p>
        ) : (
          localReviews.map((review) => (
            <div key={review.id} className="border-b border-white/[0.05] pb-8 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <Rating value={review.rating} />
                <span className="font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/30">{review.date}</span>
              </div>
              <h4 className="font-heading text-base text-[#F5F2EF] mb-1.5">{review.title}</h4>
              <p className="font-sans text-sm text-[#F5F2EF]/60 leading-relaxed mb-2">{review.body}</p>
              <p className="font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/40">
                {review.author}{" "}
                {review.verified && <span className="text-[#E50914]">· Verified Purchase</span>}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
