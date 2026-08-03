"use client";

import { useState, useEffect } from "react";
import { Review } from "@/lib/types";
import { Rating } from "@/components/ui/Rating";

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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/reviews?slug=${encodeURIComponent(productSlug)}`,
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const json = await res.json();
        const cloud: Review[] = Array.isArray(json.reviews) ? json.reviews : [];
        if (cancelled) return;

        const byId = new Map<string, Review>();
        for (const r of [...cloud, ...reviews]) {
          if (r?.id && !byId.has(r.id)) byId.set(r.id, r);
        }
        setLocalReviews(Array.from(byId.values()));
      } catch {
        // keep seed reviews
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productSlug, reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !title || !body || submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          productName,
          author: author.trim(),
          rating: ratingInput,
          title: title.trim(),
          body: body.trim(),
          verified: true,
        }),
      });
      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSubmitError(result?.error || "Failed to submit review.");
        return;
      }

      const saved: Review = result.review || {
        id: `rev-${Date.now()}`,
        author: author.trim(),
        rating: ratingInput,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        title: title.trim(),
        body: body.trim(),
        verified: true,
      };

      setLocalReviews((prev) => [saved, ...prev.filter((r) => r.id !== saved.id)]);
      setAuthor("");
      setTitle("");
      setBody("");
      setRatingInput(5);
      setSubmitSuccess(true);
      setIsFormOpen(false);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch {
      setSubmitError("Failed to submit review due to an unexpected error.");
    } finally {
      setSubmitting(false);
    }
  };

  const reviewsCount = localReviews.length;
  const averageRating =
    reviewsCount > 0
      ? localReviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount
      : rating;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/[0.08]">
        <div className="flex items-baseline gap-3">
          <span className="font-heading text-5xl text-[#F5F2EF]">{averageRating.toFixed(1)}</span>
          <div>
            <Rating value={averageRating} size="md" />
            <p className="font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/40 mt-1">
              Based on {reviewsCount || count} reviews
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setSubmitSuccess(false);
            setSubmitError(null);
          }}
          className="px-6 py-2.5 bg-[#0B0B0B] text-[#CFC6C1] border border-[#E50914] hover:bg-[#660000] hover:text-[#F5F2EF] hover:shadow-[0_0_15px_rgba(229,9,20,0.35)] transition-all duration-300 text-[10px] uppercase tracking-widest font-heading rounded-md w-full sm:w-auto text-center"
        >
          {isFormOpen ? "Cancel Review" : "Write a Review"}
        </button>
      </div>

      {submitSuccess && (
        <div className="mb-8 border border-[#E50914]/40 bg-[#1A0A0A] p-4 text-center shadow-[0_0_15px_rgba(229,9,20,0.15)] animate-fade-in">
          <p className="font-heading text-sm text-[#E50914] uppercase tracking-wider mb-1">Review Cast Successfully</p>
          <p className="font-sans text-xs text-[#F5F2EF]/60">Your review is saved and visible in the vault.</p>
        </div>
      )}

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mb-12 p-6 md:p-8 bg-[#0B0B0B]/80 border border-white/[0.06] rounded-md shadow-2xl shadow-black/50 space-y-6 animate-slide-down"
        >
          <h3 className="font-heading text-lg text-[#F5F2EF] tracking-wider border-b border-white/[0.06] pb-3">
            Cast Your Assessment
          </h3>

          {submitError && (
            <p className="text-xs text-red-400 bg-red-950/20 border border-red-800/30 p-2 text-center">
              {submitError}
            </p>
          )}

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

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#0B0B0B] text-[#CFC6C1] border border-[#E50914] hover:bg-[#660000] hover:text-[#F5F2EF] hover:shadow-[0_0_15px_rgba(229,9,20,0.35)] transition-all duration-300 text-xs uppercase tracking-widest font-heading rounded-md font-semibold disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Submit Review"}
          </button>
        </form>
      )}

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
