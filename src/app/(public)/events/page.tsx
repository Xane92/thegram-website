"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, type SiteEvent } from "@/lib/supabase";

const FALLBACK_EVENTS = [
  {
    id: null,
    date: "Jul 18",
    year: "2026",
    name: "AfroNation Lagos 2026",
    location: "Eko Atlantic, Lagos, Nigeria",
    desc: "The biggest Afrobeats festival returns with three stages, 40+ artists, and a weekend of non-stop energy on the Atlantic coastline.",
  },
  {
    id: null,
    date: "Aug 22",
    year: "2026",
    name: "Lagos Fashion Week",
    location: "Federal Palace Hotel, Lagos, Nigeria",
    desc: "Africa's premier fashion event showcasing 30 emerging and established designers pushing the boundaries of contemporary African design.",
  },
  {
    id: null,
    date: "Sep 12",
    year: "2026",
    name: "Nollywood Film Premiere Night",
    location: "Silverbird Cinemas, Victoria Island, Lagos",
    desc: "An exclusive screening and red-carpet premiere celebrating the latest wave of Nollywood cinema with the filmmakers behind the lens.",
  },
  {
    id: null,
    date: "Oct 04",
    year: "2026",
    name: "Diaspora Connect Summit",
    location: "Kempinski Hotel, Accra, Ghana",
    desc: "A two-day gathering of founders, creatives, and policymakers bridging the African continent and its global diaspora.",
  },
];

type DisplayEvent = {
  id: string | null;
  date: string;
  year: string;
  name: string;
  location: string;
  desc: string;
  ticket_link?: string;
};

function TicketEmbed() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative fade-in">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-navy rounded-lg z-10">
          <div className="text-center">
            <div className="inline-block w-6 h-6 border-2 border-crimson/30 border-t-crimson rounded-full animate-spin mb-4" />
            <p className="text-sm tracking-[0.2em] uppercase text-crimson">
              Loading tickets...
            </p>
          </div>
        </div>
      )}
      <iframe
        src="https://gramtickets.com"
        title="TheGram Tickets"
        onLoad={() => setLoaded(true)}
        className="w-full min-h-[400px] sm:min-h-[600px] rounded-lg border border-charcoal bg-navy"
        allow="payment"
      />
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<DisplayEvent[]>(FALLBACK_EVENTS);

  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase
        .from("events")
        .select("id, name, date, location, description, ticket_link")
        .eq("published", true)
        .gte("date", new Date().toISOString())
        .order("date", { ascending: true });

      if (data && data.length > 0) {
        setEvents(
          data.map((e) => {
            const d = new Date(e.date);
            return {
              id: e.id,
              date: d.toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
              year: d.getFullYear().toString(),
              name: e.name,
              location: e.location,
              desc: e.description ?? "",
              ticket_link: e.ticket_link,
            };
          })
        );
      }
    }
    fetchEvents();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-20 sm:pt-44 sm:pb-28 bg-charcoal plus-field overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-charcoal)_75%)] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-[0.65rem] tracking-[0.5em] uppercase text-crimson/80">
            + &nbsp; Live &nbsp; +
          </p>
          <h1 className="font-serif text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="gradient-text">Experience</span>{" "}
            <span className="text-warm">Culture Live</span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-warm-dim/60 sm:text-lg">
            Concerts, premieres, launches, and gatherings across the continent.
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-navy py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-16 fade-in">
            <p className="text-[0.65rem] tracking-[0.5em] uppercase text-crimson mb-3">
              x &nbsp; Calendar &nbsp; x
            </p>
            <h2 className="font-serif text-3xl font-bold sm:text-4xl text-warm">
              Upcoming Events
            </h2>
          </div>

          <div className="grid gap-[1px] bg-white/5 md:grid-cols-2">
            {events.map((ev) => (
              <Link
                key={ev.name}
                href={ev.id ? `/events/${ev.id}` : "#tickets"}
                className="group bg-navy hover:bg-charcoal transition-colors duration-300 p-8 sm:p-10 fade-in block"
              >
                <div className="flex items-start gap-6">
                  <div className="shrink-0 w-20 h-20 bg-crimson/10 border border-crimson/20 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold font-serif text-crimson leading-none">
                      {ev.date.split(" ")[1]}
                    </span>
                    <span className="text-[0.6rem] tracking-[0.2em] uppercase text-crimson/70 mt-1">
                      {ev.date.split(" ")[0]}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-warm leading-snug group-hover:text-crimson transition-colors duration-300">
                      {ev.name}
                    </h3>
                    <p className="mt-1 text-[0.7rem] tracking-[0.15em] text-warm-dim/40">
                      {ev.location}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-warm-dim/50">
                      {ev.desc}
                    </p>
                    <span className="cta-glow mt-6 inline-block border border-crimson/40 px-6 py-3 text-[0.7rem] tracking-[0.2em] uppercase text-crimson group-hover:bg-crimson group-hover:text-warm transition-all duration-300">
                      View Event
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tickets & Booking */}
      <section id="tickets" className="bg-charcoal py-20 sm:py-28 plus-field">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <div className="text-center mb-12 fade-in">
            <p className="text-[0.65rem] tracking-[0.5em] uppercase text-crimson mb-3">
              + &nbsp; Booking &nbsp; +
            </p>
            <h2 className="font-serif text-3xl font-bold sm:text-4xl text-warm">
              Tickets &amp; Booking
            </h2>
            <p className="mt-4 text-base text-warm-dim/50 max-w-md mx-auto">
              Powered by our ticketing partner. Select an event above to secure
              your spot.
            </p>
          </div>

          <TicketEmbed />
        </div>
      </section>
    </>
  );
}
