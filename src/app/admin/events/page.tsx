"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, type SiteEvent } from "@/lib/supabase";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<SiteEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });
      if (data) setEvents(data);
      if (error) showToast(error.message, "error");
      setLoading(false);
    }
    fetchEvents();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setDeleting(id);
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      showToast(error.message, "error");
    } else {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      showToast("Event deleted");
    }
    setDeleting(null);
  }

  const filtered = events.filter((ev) => {
    if (statusFilter === "published") return ev.published;
    if (statusFilter === "draft") return !ev.published;
    return true;
  });

  const publishedCount = events.filter((e) => e.published).length;
  const draftCount = events.length - publishedCount;

  return (
    <div>
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 text-sm ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          } text-white`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif font-bold text-warm">Events</h1>
        <Link
          href="/admin/events/new"
          className="bg-crimson px-5 py-2.5 text-xs font-semibold tracking-[0.15em] uppercase text-warm hover:bg-darkred transition-colors"
        >
          Create New Event
        </Link>
      </div>

      {/* Filter bar */}
      {!loading && events.length > 0 && (
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs tracking-[0.1em] uppercase text-warm-dim/40">
            Filter:
          </span>
          {(
            [
              { key: "all", label: `All (${events.length})` },
              { key: "published", label: `Published (${publishedCount})` },
              { key: "draft", label: `Draft (${draftCount})` },
            ] as const
          ).map((opt) => (
            <button
              key={opt.key}
              onClick={() => setStatusFilter(opt.key)}
              className={`px-3 py-1.5 text-xs tracking-[0.1em] uppercase transition-colors ${
                statusFilter === opt.key
                  ? "bg-crimson text-warm"
                  : "bg-charcoal text-warm-dim/50 border border-white/5 hover:border-white/10"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-charcoal animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-charcoal border border-white/5">
          <p className="text-warm-dim/40 mb-4">
            {events.length === 0
              ? "No events yet."
              : `No ${statusFilter} events.`}
          </p>
          {events.length === 0 && (
            <Link
              href="/admin/events/new"
              className="text-crimson text-sm hover:underline"
            >
              Create your first event
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-charcoal border border-white/5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-xs tracking-[0.1em] uppercase text-warm-dim/40 font-normal">
                  Event Name
                </th>
                <th className="text-left px-4 py-3 text-xs tracking-[0.1em] uppercase text-warm-dim/40 font-normal">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-xs tracking-[0.1em] uppercase text-warm-dim/40 font-normal">
                  Location
                </th>
                <th className="text-left px-4 py-3 text-xs tracking-[0.1em] uppercase text-warm-dim/40 font-normal">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs tracking-[0.1em] uppercase text-warm-dim/40 font-normal">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev) => (
                <tr
                  key={ev.id}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3 text-warm font-medium max-w-xs truncate">
                    {ev.name}
                  </td>
                  <td className="px-4 py-3 text-warm-dim/50 text-xs">
                    {new Date(ev.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-warm-dim/50 text-xs">
                    {ev.location}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-[0.65rem] tracking-wider uppercase ${
                        ev.published
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-white/5 text-warm-dim/40 border border-white/10"
                      }`}
                    >
                      {ev.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link
                      href={`/admin/events/${ev.id}/edit`}
                      className="text-warm-dim/50 hover:text-crimson transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(ev.id)}
                      disabled={deleting === ev.id}
                      className="text-warm-dim/50 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      {deleting === ev.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
