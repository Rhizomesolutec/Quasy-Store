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
        className="max-w-3xl mx-auto text-center border-2 border-[#333] bg-[#0a0a0c] px-6 sm:px-12 py-14 md:py-16 relative overflow-hidden retro-box-shadow"
      >
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 0%, #00FF66 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10">
          <Eyebrow className="mb-4">The Dispatch</Eyebrow>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#F5F2EF] leading-tight mb-5">
            Join the Inner Circle
          </h2>
          <Divider className="mx-auto mb-6" />
          <p className="font-mono text-xs text-[#F5F2EF]/70 leading-relaxed max-w-md mx-auto mb-10">
            Restock alerts, early access to limited castings, and quiet notes from the workshop — never spam.
          </p>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-4 border-2 border-[#00FF66] bg-black p-4 inline-block"
            >
              <p className="font-heading text-xl text-[#00FF66] mb-2 font-mono">YOU&apos;RE ON THE LIST! ⚡</p>
              <p className="font-mono text-xs text-[#FFE600] uppercase tracking-widest font-bold">
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
                className="flex-1 bg-[#14141c] border-2 border-[#333] px-4 py-3.5 text-xs font-mono text-[#F5F2EF] placeholder-[#F5F2EF]/40 outline-none focus:border-[#00FF66] transition-colors"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="bg-[#00FF66] hover:bg-[#39FF14] text-black font-black text-xs px-6 py-3.5 uppercase tracking-wider font-mono border-2 border-black retro-box-shadow transition-transform active:scale-95"
              >
                {status === "submitting" ? "JOINING..." : "SUBSCRIBE ►"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  );
}
