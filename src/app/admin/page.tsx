"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function StatCard({
  label,
  value,
  loading,
}: {
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <div className="bg-charcoal border border-white/5 p-6">
      <p className="text-xs tracking-[0.15em] uppercase text-warm-dim/40 mb-2">
        {label}
      </p>
      {loading ? (
        <div className="h-8 w-12 bg-white/5 animate-pulse" />
      ) : (
        <p className="text-3xl font-serif font-bold text-warm">{value}</p>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    stories: 0,
    storiesPublished: 0,
    storiesDraft: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      const { data } = await supabase
        .from("stories")
        .select("id, published");

      const stories = data ?? [];
      const sp = stories.filter((s) => s.published).length;

      setStats({
        stories: stories.length,
        storiesPublished: sp,
        storiesDraft: stories.length - sp,
      });
      setLoading(false);
    }
    fetchCounts();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-warm mb-8">
        Dashboard
      </h1>

      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        <StatCard
          label="Total Stories"
          value={stats.stories}
          loading={loading}
        />
        <StatCard
          label="Published"
          value={stats.storiesPublished}
          loading={loading}
        />
        <StatCard
          label="Drafts"
          value={stats.storiesDraft}
          loading={loading}
        />
      </div>

      <Link
        href="/admin/stories"
        className="group block bg-charcoal border border-white/5 p-8 hover:border-crimson/30 transition-colors max-w-md"
      >
        <h2 className="font-serif text-xl font-bold text-warm group-hover:text-crimson transition-colors">
          Manage Stories
        </h2>
        <p className="mt-2 text-sm text-warm-dim/50">
          Create, edit, and publish stories.
        </p>
      </Link>
    </div>
  );
}
