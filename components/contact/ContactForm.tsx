"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "submitting" | "success";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => setStatus("success"), 1400);
  };

  if (status === "success") {
    return (
      <div className="border border-[#8E1F1F]/30 bg-[#8E1F1F]/[0.06] p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-4 bg-[#8E1F1F]/20 rounded-full flex items-center justify-center border border-[#8E1F1F]/40">
          <svg className="w-6 h-6 text-[#D8CFC0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-heading text-xl text-[#D8CFC0] mb-2">Message Sent</h3>
        <p className="font-sans text-sm text-[#D8CFC0]/60 max-w-sm mx-auto leading-relaxed">
          A raven has been dispatched. Expect a reply within one to two business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-sans text-[10px] uppercase tracking-widest text-[#D8CFC0]/50 mb-2">Name</label>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-[#1a1a1a] border border-white/[0.08] px-4 py-3 text-sm text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/50 transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block font-sans text-[10px] uppercase tracking-widest text-[#D8CFC0]/50 mb-2">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-[#1a1a1a] border border-white/[0.08] px-4 py-3 text-sm text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/50 transition-colors"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div>
        <label className="block font-sans text-[10px] uppercase tracking-widest text-[#D8CFC0]/50 mb-2">Subject</label>
        <select
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full bg-[#1a1a1a] border border-white/[0.08] px-4 py-3 text-sm text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/50 transition-colors"
        >
          <option value="">Select a topic</option>
          <option>Order Inquiry</option>
          <option>Product Question</option>
          <option>Repairs & Polishing</option>
          <option>Press & Collaborations</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="block font-sans text-[10px] uppercase tracking-widest text-[#D8CFC0]/50 mb-2">Message</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full bg-[#1a1a1a] border border-white/[0.08] px-4 py-3 text-sm text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/50 transition-colors resize-none"
          placeholder="Tell us what you need..."
        />
      </div>
      <Button type="submit" variant="filled" size="lg" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
