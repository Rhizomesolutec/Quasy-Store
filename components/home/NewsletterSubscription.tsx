"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eyebrow, Divider } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("submitting");
    setTimeout(() => setStatus("success"), 1100);
  };

  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-24 md:py-32 border-t border-white/[0.05]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl mx-auto text-center border border-white/[0.08] bg-gradient-to-b from-[#151515] to-[#111111] px-6 sm:px-12 py-14 md:py-16 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 0%, #8E1F1F 0%, transparent 55%)",
          }}
        />

        <div className="relative z-10">
          <Eyebrow className="mb-4">The Dispatch</Eyebrow>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#D8CFC0] leading-tight mb-5">
            Join the Inner Circle
          </h2>
          <Divider className="mx-auto mb-6" />
          <p className="font-sans text-sm text-[#D8CFC0]/60 leading-relaxed max-w-md mx-auto mb-10">
            Restock alerts, early access to limited castings, and quiet notes from the workshop — never spam.
          </p>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-4"
            >
              <p className="font-heading text-xl text-[#D8CFC0] mb-2">You&apos;re on the list</p>
              <p className="font-sans text-xs text-[#D8CFC0]/50 uppercase tracking-widest">
                A raven will find you soon.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-[#1a1a1a] border border-white/[0.08] px-4 py-3.5 text-sm text-[#D8CFC0] placeholder-[#D8CFC0]/30 outline-none focus:border-[#8E1F1F]/50 transition-colors"
              />
              <Button type="submit" variant="filled" size="lg" disabled={status === "submitting"}>
                {status === "submitting" ? "Joining..." : "Subscribe"}
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  );
}
