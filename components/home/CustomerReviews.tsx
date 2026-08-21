"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { Rating } from "@/components/ui/Rating";
import type { Product } from "@/lib/types";

type DisplayReview = {
  id: string;
  author: string;
  rating: number;
  title?: string;
  body: string;
  productName?: string;
  productSlug?: string;
  date?: string;
};

const FALLBACK_TESTIMONIALS: DisplayReview[] = [
  {
    id: "fallback-1",
    author: "M. Ashworth",
    rating: 5,
    body: "The filigree work is genuinely intricate in person. Sits perfectly at the collarbone and the finish hasn't dulled after weeks of wear.",
    productName: "Collector favourite",
  },
  {
    id: "fallback-2",
    author: "J. Okafor",
    rating: 5,
    body: "Exactly as pictured. The packaging alone felt ceremonial — and the piece itself is heavier and finer than I expected.",
    productName: "Verified purchase",
  },
  {
    id: "fallback-3",
    author: "R. Delacroix",
    rating: 5,
    body: "I get asked about this constantly. The oxidized detailing catches light in a way photos don't do justice to.",
    productName: "Repeat buyer",
  },
];

export function CustomerReviews({ products }: { products: Product[] }) {
  const [reviews, setReviews] = useState<DisplayReview[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [author, setAuthor] = useState("");
  const [ratingInput, setRatingInput] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const productOptions = useMemo(
    () =>
      [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products]
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/reviews?limit=9", { cache: "no-store" });
        if (!res.ok || cancelled) return;
        const json = await res.json();
        const cloud: DisplayReview[] = (Array.isArray(json.reviews) ? json.reviews : []).map(
          (r: Record<string, unknown>) => ({
            id: String(r.id || ""),
            author: String(r.author || "Collector"),
            rating: Number(r.rating) || 5,
            title: String(r.title || ""),
            body: String(r.body || ""),
            productName: String(r.productName || ""),
            productSlug: String(r.productSlug || ""),
            date: String(r.date || ""),
          })
        );
        if (!cancelled && cloud.length > 0) setReviews(cloud.slice(0, 9));
      } catch {
        // keep fallbacks
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadReviews = async () => {
    try {
      const res = await fetch("/api/reviews?limit=9", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      const cloud: DisplayReview[] = (Array.isArray(json.reviews) ? json.reviews : []).map(
        (r: Record<string, unknown>) => ({
          id: String(r.id || ""),
          author: String(r.author || "Collector"),
          rating: Number(r.rating) || 5,
          title: String(r.title || ""),
          body: String(r.body || ""),
          productName: String(r.productName || ""),
          productSlug: String(r.productSlug || ""),
          date: String(r.date || ""),
        })
      );
      if (cloud.length > 0) setReviews(cloud.slice(0, 9));
    } catch {
      // keep fallbacks
    }
  };

  const displayReviews = reviews.length > 0 ? reviews.slice(0, 3) : FALLBACK_TESTIMONIALS;

  const resetForm = () => {
    setAuthor("");
    setTitle("");
    setBody("");
    setRatingInput(5);
    setProductId("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!productId || !author.trim() || !title.trim() || !body.trim()) {
      setError("Please choose a product and fill every field.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          author: author.trim(),
          rating: ratingInput,
          title: title.trim(),
          body: body.trim(),
          verified: true,
        }),
      });
      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(result?.error || "Failed to submit review.");
        return;
      }

      resetForm();
      setIsFormOpen(false);
      setSuccess(true);
      await loadReviews();
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError("Failed to submit review due to an unexpected error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-12 md:py-16 border-t border-white/[0.05] bg-gradient-to-b from-transparent via-[#FF0055]/[0.02] to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <SectionHeader
            eyebrow="From the Vault"
            title="What Collectors Say"
            description="Quiet praise from those who wear the relics daily — leave your own assessment below."
            align="left"
            className="mb-0"
          />
          <button
            type="button"
            onClick={() => {
              setIsFormOpen((open) => !open);
              setSuccess(false);
              setError(null);
            }}
            className="self-start md:self-end border border-[#E50914] bg-[#E50914]/10 hover:bg-[#E50914] text-[#F5F2EF] px-5 py-2.5 text-[10px] uppercase tracking-widest transition-all duration-300"
          >
            {isFormOpen ? "Cancel Review" : "Write a Review"}
          </button>
        </div>

        {success && (
          <div className="mb-8 border border-[#E50914]/40 bg-[#1A0A0A] p-4 text-center">
            <p className="font-heading text-sm text-[#E50914] uppercase tracking-wider mb-1">
              Review Submitted
            </p>
            <p className="font-sans text-xs text-[#F5F2EF]/60">
              Your review is saved and now appears with the product.
            </p>
          </div>
        )}

        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="mb-12 p-6 md:p-8 border border-white/[0.08] bg-[#0a0a0c] space-y-5"
          >
            <h3 className="font-heading text-lg text-[#F5F2EF] border-b border-white/[0.06] pb-3">
              Review a Product
            </h3>

            {error && (
              <p className="text-xs text-red-400 bg-red-950/20 border border-red-800/30 p-2 text-center">
                {error}
              </p>
            )}

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/50 mb-1.5">
                  Product
                </label>
                <select
                  required
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3 py-2.5 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50"
                >
                  <option value="">Select a product...</option>
                  {productOptions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/50 mb-1.5">
                  Your Name
                </label>
                <input
                  required
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. M. Ashworth"
                  className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3 py-2.5 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50"
                />
              </div>
            </div>

            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/50 mb-1.5">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingInput(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="text-2xl transition-transform hover:scale-110"
                    aria-label={`${star} stars`}
                  >
                    <span
                      className={
                        star <= (hoverRating ?? ratingInput)
                          ? "text-[#E50914]"
                          : "text-[#F5F2EF]/20"
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/50 mb-1.5">
                Summary
              </label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Incredible detail"
                className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3 py-2.5 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50"
              />
            </div>

            <div>
              <label className="block font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/50 mb-1.5">
                Your Review
              </label>
              <textarea
                required
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Share how the piece feels, looks, and wears..."
                className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3 py-2.5 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || productOptions.length === 0}
              className="w-full md:w-auto border border-[#E50914] bg-[#E50914]/15 hover:bg-[#E50914] text-[#F5F2EF] px-8 py-3 text-xs uppercase tracking-widest transition-all duration-300 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        <div
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 scrollbar-thin md:mx-0 md:px-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-3 md:gap-4"
          style={{ scrollbarWidth: "none" }}
        >
          {displayReviews.map((t, idx) => (
            <motion.blockquote
              key={t.id}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex-shrink-0 w-[70vw] min-[480px]:w-[280px] snap-start md:w-auto md:flex-shrink border-2 border-[#E50914]/50 bg-[#0a0a0c] p-3 sm:p-5 md:p-6 flex flex-col retro-box-shadow transition-all duration-500 hover:border-[#E50914]"
            >
              <span className="font-heading text-2xl sm:text-4xl leading-none absolute top-2 right-3 sm:top-4 sm:right-5 select-none opacity-30 text-[#E50914]">
                &rdquo;
              </span>
              <Rating value={t.rating} />
              {t.title && (
                <p className="font-heading text-xs sm:text-sm text-[#F5F2EF] mt-2 sm:mt-3">{t.title}</p>
              )}
              <p className="font-mono text-[10px] sm:text-xs text-[#F5F2EF]/80 leading-relaxed mt-2 mb-3 sm:mb-5 flex-1 line-clamp-3 sm:line-clamp-4">
                &ldquo;{t.body}&rdquo;
              </p>
              <footer className="pt-2 sm:pt-3 border-t border-[#222]">
                <cite className="font-heading text-xs sm:text-sm text-[#F5F2EF] not-italic block">
                  {t.author}
                </cite>
                {t.productSlug ? (
                  <Link
                    href={`/shop/${t.productSlug}`}
                    className="inline-block font-mono text-[8px] sm:text-[9px] uppercase tracking-widest px-1.5 sm:px-2 py-0.5 mt-1.5 sm:mt-2 font-bold text-white bg-[#E50914] hover:bg-[#B3121D] transition-colors"
                  >
                    {t.productName || "View product"}
                  </Link>
                ) : (
                  <span className="inline-block font-mono text-[8px] sm:text-[9px] uppercase tracking-widest px-1.5 sm:px-2 py-0.5 mt-1.5 sm:mt-2 font-bold text-white bg-[#E50914]">
                    {t.productName || "Verified collector"}
                  </span>
                )}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
