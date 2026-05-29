"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, type Story } from "@/lib/supabase";

const CATEGORIES = [
  "music",
  "culture",
  "film",
  "fashion",
  "events",
  "finance",
  "policies",
  "startups",
  "lifestyle",
];

type CategoryStats = {
  name: string;
  total: number;
  published: number;
  draft: number;
};

export default function AdminStoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const activeCategory = categoryParam ?? "all";

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    async function fetchStories() {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setStories(data);
      if (error) showToast(error.message, "error");
      setLoading(false);
    }
    fetchStories();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this story?")) return;
    setDeleting(id);
    const { error } = await supabase.from("stories").delete().eq("id", id);
    if (error) {
      showToast(error.message, "error");
    } else {
      setStories((prev) => prev.filter((s) => s.id !== id));
      showToast("Story deleted");
    }
    setDeleting(null);
  }

  const categoryStats: CategoryStats[] = CATEGORIES.map((cat) => {
    const inCat = stories.filter((s) => s.category === cat);
    return {
      name: cat,
      total: inCat.length,
      published: inCat.filter((s) => s.published).length,
      draft: inCat.filter((s) => !s.published).length,
    };
  });

  const allTotal = stories.length;
  const allPublished = stories.filter((s) => s.published).length;

  const filtered =
    activeCategory === "all"
      ? stories
      : stories.filter((s) => s.category === activeCategory);

  function selectCategory(cat: string) {
    if (cat === "all") {
      router.push("/admin/stories", { scroll: false });
    } else {
      router.push(`/admin/stories?category=${cat}`, { scroll: false });
    }
  }

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
        <h1 className="text-2xl font-serif font-bold text-warm">Stories</h1>
        <Link
          href="/admin/stories/new"
          className="bg-crimson px-5 py-2.5 text-xs font-semibold tracking-[0.15em] uppercase text-warm hover:bg-darkred transition-colors"
        >
          Create New Story
        </Link>
      </div>

      {/* Category cards */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          <button
            onClick={() => selectCategory("all")}
            className={`text-left p-4 border transition-colors ${
              activeCategory === "all"
                ? "border-crimson bg-crimson/5"
                : "border-white/5 bg-charcoal hover:border-white/10"
            }`}
          >
            <p className="text-sm font-semibold text-warm">All</p>
            <p className="text-xs text-warm-dim/40 mt-1">
              {allTotal} {allTotal === 1 ? "story" : "stories"}
            </p>
            <p className="text-[0.6rem] text-warm-dim/30 mt-0.5">
              {allPublished} published, {allTotal - allPublished} draft
            </p>
          </button>
          {categoryStats.map((cat) => (
            <button
              key={cat.name}
              onClick={() => selectCategory(cat.name)}
              className={`text-left p-4 border transition-colors ${
                activeCategory === cat.name
                  ? "border-crimson bg-crimson/5"
                  : "border-white/5 bg-charcoal hover:border-white/10"
              }`}
            >
              <p className="text-sm font-semibold text-warm capitalize">
                {cat.name}
              </p>
              <p className="text-xs text-warm-dim/40 mt-1">
                {cat.total} {cat.total === 1 ? "story" : "stories"}
              </p>
              <p className="text-[0.6rem] text-warm-dim/30 mt-0.5">
                {cat.published} published, {cat.draft} draft
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Stories table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-charcoal animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-charcoal border border-white/5">
          <p className="text-warm-dim/40 mb-4">
            {activeCategory === "all"
              ? "No stories yet."
              : `No stories in "${activeCategory}" yet.`}
          </p>
          <Link
            href="/admin/stories/new"
            className="text-crimson text-sm hover:underline"
          >
            Create a story
          </Link>
        </div>
      ) : (
        <div className="bg-charcoal border border-white/5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-xs tracking-[0.1em] uppercase text-warm-dim/40 font-normal">
                  Title
                </th>
                <th className="text-left px-4 py-3 text-xs tracking-[0.1em] uppercase text-warm-dim/40 font-normal">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-xs tracking-[0.1em] uppercase text-warm-dim/40 font-normal">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs tracking-[0.1em] uppercase text-warm-dim/40 font-normal">
                  Date
                </th>
                <th className="text-right px-4 py-3 text-xs tracking-[0.1em] uppercase text-warm-dim/40 font-normal">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((story) => (
                <tr
                  key={story.id}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3 text-warm font-medium max-w-xs truncate">
                    {story.title}
                  </td>
                  <td className="px-4 py-3 text-warm-dim/50 capitalize">
                    {story.category}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-[0.65rem] tracking-wider uppercase ${
                        story.published
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-white/5 text-warm-dim/40 border border-white/10"
                      }`}
                    >
                      {story.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-warm-dim/40 text-xs">
                    {new Date(story.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link
                      href={`/admin/stories/${story.id}/edit`}
                      className="text-warm-dim/50 hover:text-crimson transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(story.id)}
                      disabled={deleting === story.id}
                      className="text-warm-dim/50 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      {deleting === story.id ? "..." : "Delete"}
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
