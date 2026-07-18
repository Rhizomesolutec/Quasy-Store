"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Tab = "login" | "register" | "forgot";

export function AuthForms({ onAuthenticated }: { onAuthenticated: (email: string) => void }) {
  const [tab, setTab] = useState<Tab>("login");
  const [submitting, setSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "collector@qusaystore.com");

    if (tab === "forgot") {
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        setResetSent(true);
      }, 1000);
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onAuthenticated(email);
    }, 900);
  };

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="flex border-b border-white/[0.08] mb-8">
        {(["login", "register"] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setResetSent(false);
            }}
            className={`flex-1 pb-4 font-sans text-xs uppercase tracking-widest transition-colors relative ${
              tab === t ? "text-[#F5F2EF]" : "text-[#F5F2EF]/40 hover:text-[#F5F2EF]/70"
            }`}
          >
            {t === "login" ? "Sign In" : "Create Account"}
            {tab === t && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E50914]" />}
          </button>
        ))}
      </div>

      {tab === "forgot" ? (
        resetSent ? (
          <div className="text-center py-8">
            <h3 className="font-heading text-xl text-[#F5F2EF] mb-2">Check your inbox</h3>
            <p className="font-sans text-sm text-[#F5F2EF]/60 leading-relaxed mb-6">
              If an account exists for that email, a reset link is on its way.
            </p>
            <button onClick={() => setTab("login")} className="font-sans text-xs uppercase tracking-widest text-[#E50914] hover:text-[#660000]">
              ← Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="font-heading text-xl text-[#F5F2EF] mb-1">Reset Password</h3>
            <p className="font-sans text-sm text-[#F5F2EF]/50 mb-4">We&apos;ll email you a link to reset your password.</p>
            <Field label="Email" name="email" type="email" />
            <Button type="submit" variant="filled" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Sending..." : "Send Reset Link"}
            </Button>
            <button
              type="button"
              onClick={() => setTab("login")}
              className="block w-full text-center font-sans text-xs uppercase tracking-widest text-[#F5F2EF]/50 hover:text-[#F5F2EF]"
            >
              ← Back to Sign In
            </button>
          </form>
        )
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {tab === "register" && <Field label="Full Name" name="name" type="text" />}
          <Field label="Email" name="email" type="email" />
          <Field label="Password" name="password" type="password" />
          {tab === "register" && <Field label="Confirm Password" name="confirmPassword" type="password" />}

          {tab === "login" && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setTab("forgot")}
                className="font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/50 hover:text-[#E50914] transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button type="submit" variant="filled" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Please wait..." : tab === "login" ? "Sign In" : "Create Account"}
          </Button>

          <p className="font-sans text-[10px] text-center text-[#F5F2EF]/30 leading-relaxed">
            This is a demo account flow — no real credentials are stored or verified.
          </p>
        </form>
      )}
    </div>
  );
}

function Field({ label, name, type }: { label: string; name: string; type: string }) {
  return (
    <div>
      <label className="block font-sans text-[10px] uppercase tracking-widest text-[#F5F2EF]/50 mb-2">{label}</label>
      <input
        required
        name={name}
        type={type}
        className="w-full bg-[#1A0A0A] border border-white/[0.08] px-4 py-3 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50 transition-colors"
      />
    </div>
  );
}
