"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.refresh();
        router.push("/admin");
      } else {
        setError(data.error || "Invalid username or password");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-[#111111] px-4">
      {/* Noise Overlay */}
      <div className="bg-noise" />

      {/* Decorative Gothic Shadows/Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#8E1F1F] opacity-10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-[#8E1F1F] opacity-5 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-md border border-white/[0.06] bg-[#161616]/80 backdrop-blur-xl p-8 md:p-10 shadow-2xl relative">
        {/* Accent Top Border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8E1F1F] to-transparent" />

        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl uppercase tracking-widest text-[#D8CFC0]">
            QUSAY
          </h1>
          <p className="font-sans text-[10px] uppercase tracking-widest text-[#8E1F1F] mt-2">
            Admin Vault Portal
          </p>
        </div>

        {error && (
          <div 
            id="login-error-msg"
            className="border border-[#8E1F1F]/30 bg-[#8E1F1F]/10 px-4 py-3 text-xs text-[#D8CFC0]/90 mb-6 font-sans tracking-wide text-center"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="admin-username-input"
              className="block font-sans text-[10px] uppercase tracking-widest text-[#D8CFC0]/50 mb-2"
            >
              Username
            </label>
            <input
              id="admin-username-input"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/[0.08] px-4 py-3 text-sm text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/60 focus:bg-[#202020] transition-all font-sans"
              placeholder="Enter admin username"
            />
          </div>

          <div>
            <label 
              htmlFor="admin-password-input"
              className="block font-sans text-[10px] uppercase tracking-widest text-[#D8CFC0]/50 mb-2"
            >
              Password
            </label>
            <input
              id="admin-password-input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/[0.08] px-4 py-3 text-sm text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/60 focus:bg-[#202020] transition-all font-sans"
              placeholder="••••••••"
            />
          </div>

          <button
            id="admin-login-submit"
            type="submit"
            disabled={loading}
            className="w-full border border-[#8E1F1F] bg-[#8E1F1F]/10 hover:bg-[#8E1F1F] text-[#D8CFC0] py-3.5 px-4 font-sans text-xs uppercase tracking-widest transition-all duration-300 hover:tracking-[0.15em] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-[#D8CFC0] border-t-transparent rounded-full animate-spin" />
            ) : (
              "Unlock Vault"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
