"use client";

import { useState } from "react";
import { seedDatabase } from "@/lib/seed";

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    stories: number;
    events: number;
    skipped: boolean;
  } | null>(null);
  const [error, setError] = useState("");

  async function handleSeed() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await seedDatabase();
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Seeding failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-serif font-bold text-warm mb-2">
        Seed Database
      </h1>
      <p className="text-sm text-warm-dim/50 mb-8">
        Insert starter stories and events into the database. This will only run
        if the stories table is empty.
      </p>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          {result.skipped
            ? "Database already has stories — seeding skipped to avoid duplicates."
            : `Seeded ${result.stories} stories and ${result.events} events.`}
        </div>
      )}

      <button
        onClick={handleSeed}
        disabled={loading}
        className="bg-crimson px-8 py-3 text-sm font-semibold tracking-[0.15em] uppercase text-warm hover:bg-darkred transition-colors disabled:opacity-50"
      >
        {loading ? "Seeding..." : "Seed Database"}
      </button>
    </div>
  );
}
