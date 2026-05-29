"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase, type SiteEvent } from "@/lib/supabase";

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const [event, setEvent] = useState<SiteEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setEvent(data);
      }
      setLoading(false);
    }
    fetchEvent();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-crimson/30 border-t-crimson rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className="min-h-screen bg-navy pt-36 pb-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="font-serif text-4xl font-bold text-warm mb-4">
            Event Not Found
          </h1>
          <p className="text-warm-dim/50 mb-8">
            This event may have been removed or doesn&apos;t exist.
          </p>
          <Link
            href="/events"
            className="text-crimson text-sm tracking-[0.15em] uppercase hover:text-warm transition-colors"
          >
            &larr; Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-16 sm:pt-44 sm:pb-24 bg-charcoal overflow-hidden">
        {event.cover_image ? (
          <div className="absolute inset-0">
            <img
              src={event.cover_image}
              alt={event.name}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/80 to-charcoal" />
          </div>
        ) : (
          <div className="absolute inset-0 plus-field">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-charcoal)_75%)]" />
          </div>
        )}

        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <Link
            href="/events"
            className="inline-block mb-8 text-[0.7rem] tracking-[0.2em] uppercase text-warm-dim/50 hover:text-crimson transition-colors"
          >
            &larr; Back to Events
          </Link>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-warm leading-tight">
            {event.name}
          </h1>

          <div className="mt-8 flex flex-col sm:flex-row gap-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-crimson/10 border border-crimson/20 flex flex-col items-center justify-center shrink-0">
                <span className="text-lg font-bold font-serif text-crimson leading-none">
                  {eventDate.getDate()}
                </span>
                <span className="text-[0.5rem] tracking-[0.15em] uppercase text-crimson/70">
                  {eventDate.toLocaleDateString("en-US", { month: "short" })}
                </span>
              </div>
              <div>
                <p className="text-sm text-warm">
                  {eventDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-warm-dim/40">
                  {eventDate.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-warm-dim/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
              </div>
              <p className="text-sm text-warm">{event.location}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Description + CTA */}
      <section className="bg-navy py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-lg leading-relaxed text-warm-dim/60 whitespace-pre-line">
            {event.description}
          </p>

          {event.ticket_link && (
            <div className="mt-12">
              <a
                href={event.ticket_link}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-glow inline-block bg-crimson px-10 py-4 text-[0.8rem] font-semibold tracking-[0.25em] uppercase text-warm hover:bg-darkred transition-colors"
              >
                Get Tickets
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
