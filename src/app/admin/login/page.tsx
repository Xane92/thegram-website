"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/admin");
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      router.replace("/admin");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="font-serif text-2xl font-bold tracking-[0.2em] text-warm">
            THE GRAM
            <sup className="text-[0.55em] text-crimson align-super ml-0.5">
              co
            </sup>
          </span>
          <p className="mt-2 text-xs tracking-[0.3em] uppercase text-warm-dim/40">
            Admin Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-warm-dim/50 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-charcoal border border-white/10 px-4 py-3 text-sm text-warm placeholder:text-warm-dim/30 focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/50 transition-colors"
              placeholder="admin@thegram.co"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-warm-dim/50 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-charcoal border border-white/10 px-4 py-3 text-sm text-warm placeholder:text-warm-dim/30 focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-crimson py-3 text-sm font-semibold tracking-[0.2em] uppercase text-warm hover:bg-darkred transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
