"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase, type Story } from "@/lib/supabase";

export default function StoryDetailPage() {
  const params = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [related, setRelated] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchStory() {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setStory(data);

      const { data: relatedData } = await supabase
        .from("stories")
        .select("*")
        .eq("published", true)
        .eq("category", data.category)
        .neq("id", data.id)
        .order("created_at", { ascending: false })
        .limit(3);

      let moreStories = relatedData ?? [];

      if (moreStories.length < 3) {
        const existingIds = [data.id, ...moreStories.map((s) => s.id)];
        const { data: fillData } = await supabase
          .from("stories")
          .select("*")
          .eq("published", true)
          .not("id", "in", `(${existingIds.join(",")})`)
          .order("created_at", { ascending: false })
          .limit(3 - moreStories.length);

        if (fillData) moreStories = [...moreStories, ...fillData];
      }

      setRelated(moreStories);
      setLoading(false);
    }
    fetchStory();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-crimson/30 border-t-crimson rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !story) {
    return (
      <div className="min-h-screen bg-navy pt-36 pb-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="font-serif text-4xl font-bold text-warm mb-4">
            Story Not Found
          </h1>
          <p className="text-warm-dim/50 mb-8">
            This story may have been removed or doesn&apos;t exist.
          </p>
          <Link
            href="/stories"
            className="text-crimson text-sm tracking-[0.15em] uppercase hover:text-warm transition-colors"
          >
            &larr; Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabel =
    (story.category ?? "").charAt(0).toUpperCase() +
    (story.category ?? "").slice(1);

  return (
    <>
      {/* Hero / Cover */}
      <section className="relative pt-36 pb-16 sm:pt-44 sm:pb-24 bg-charcoal overflow-hidden">
        {story.cover_image ? (
          <div className="absolute inset-0">
            <img
              src={story.cover_image}
              alt={story.title}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/80 to-charcoal" />
          </div>
        ) : (
          <div className="absolute inset-0 x-pattern">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-charcoal)_75%)]" />
          </div>
        )}

        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <Link
            href="/stories"
            className="inline-block mb-8 text-[0.7rem] tracking-[0.2em] uppercase text-warm-dim/50 hover:text-crimson transition-colors"
          >
            &larr; Back to Stories
          </Link>

          <span className="inline-block mb-5 text-[0.6rem] tracking-[0.3em] uppercase text-crimson border border-crimson/30 px-3 py-1">
            {categoryLabel}
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-warm leading-tight">
            {story.title}
          </h1>

          <div className="mt-6 flex items-center gap-3 text-[0.7rem] tracking-[0.15em] text-warm-dim/40">
            <span className="text-warm-dim/60">{story.author}</span>
            <span>&middot;</span>
            <span>
              {new Date(story.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-navy py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          {story.excerpt && (
            <p className="text-lg sm:text-xl leading-relaxed text-warm-dim/70 mb-10 font-serif italic border-l-2 border-crimson/30 pl-6">
              {story.excerpt}
            </p>
          )}

          {story.body ? (
            <div className="prose-dark text-base leading-relaxed text-warm-dim/60 whitespace-pre-line">
              {story.body}
            </div>
          ) : (
            <p className="text-warm-dim/30 text-sm italic">
              Full story content coming soon.
            </p>
          )}
        </div>
      </section>

      {/* More Stories */}
      {related.length > 0 && (
        <section className="bg-charcoal py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-12">
              <p className="text-[0.65rem] tracking-[0.5em] uppercase text-crimson mb-3">
                + &nbsp; Keep Reading &nbsp; +
              </p>
              <h2 className="font-serif text-3xl font-bold text-warm">
                More Stories
              </h2>
            </div>

            <div className="grid gap-[1px] bg-white/5 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/stories/${r.id}`}
                  className="group bg-charcoal hover:bg-navy transition-colors duration-300"
                >
                  {r.cover_image ? (
                    <img
                      src={r.cover_image}
                      alt={r.title}
                      className="aspect-[16/9] w-full object-cover"
                    />
                  ) : (
                    <div className="story-placeholder aspect-[16/9] w-full" />
                  )}
                  <div className="p-6 sm:p-8">
                    <span className="inline-block mb-3 text-[0.55rem] tracking-[0.3em] uppercase text-crimson border border-crimson/30 px-2 py-0.5">
                      {(r.category ?? "").charAt(0).toUpperCase() +
                        (r.category ?? "").slice(1)}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-warm leading-snug group-hover:text-crimson transition-colors duration-300">
                      {r.title}
                    </h3>
                    <p className="mt-2 text-sm text-warm-dim/50 line-clamp-2">
                      {r.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
