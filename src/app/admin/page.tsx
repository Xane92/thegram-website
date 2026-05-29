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
    events: 0,
    eventsPublished: 0,
    eventsDraft: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      const [storiesRes, eventsRes] = await Promise.all([
        supabase.from("stories").select("id, published"),
        supabase.from("events").select("id, published"),
      ]);

      const stories = storiesRes.data ?? [];
      const events = eventsRes.data ?? [];
      const sp = stories.filter((s) => s.published).length;
      const ep = events.filter((e) => e.published).length;

      setStats({
        stories: stories.length,
        storiesPublished: sp,
        storiesDraft: stories.length - sp,
        events: events.length,
        eventsPublished: ep,
        eventsDraft: events.length - ep,
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatCard
          label="Total Stories"
          value={stats.stories}
          loading={loading}
        />
        <StatCard
          label="Published Stories"
          value={stats.storiesPublished}
          loading={loading}
        />
        <StatCard
          label="Total Events"
          value={stats.events}
          loading={loading}
        />
        <StatCard
          label="Published Events"
          value={stats.eventsPublished}
          loading={loading}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/admin/stories"
          className="group block bg-charcoal border border-white/5 p-8 hover:border-crimson/30 transition-colors"
        >
          <h2 className="font-serif text-xl font-bold text-warm group-hover:text-crimson transition-colors">
            Manage Stories
          </h2>
          <p className="mt-2 text-sm text-warm-dim/50">
            Create, edit, and publish stories.
          </p>
        </Link>
        <Link
          href="/admin/events"
          className="group block bg-charcoal border border-white/5 p-8 hover:border-crimson/30 transition-colors"
        >
          <h2 className="font-serif text-xl font-bold text-warm group-hover:text-crimson transition-colors">
            Manage Events
          </h2>
          <p className="mt-2 text-sm text-warm-dim/50">
            Create, edit, and publish events.
          </p>
        </Link>
      </div>
    </div>
  );
}
