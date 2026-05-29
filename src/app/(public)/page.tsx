"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

/* ------------------------------------------------------------------ */
/*  HERO                                                               */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center x-pattern overflow-hidden">
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <p className="mb-6 text-[0.7rem] tracking-[0.5em] uppercase text-crimson/80">
          x &nbsp; x &nbsp; x
        </p>
        <h1 className="font-serif text-5xl leading-[1.1] font-bold sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="gradient-text">Stories</span>{" "}
          <span className="text-warm">of</span>
          <br />
          <span className="text-warm">African</span>{" "}
          <span className="gradient-text">Greatness</span>
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-warm-dim/70 sm:text-xl">
          The blueprint for a new generation of dreamers.
        </p>
        <a
          href="#featured"
          className="cta-glow mt-12 inline-block rounded-none bg-crimson px-10 py-4 text-[0.8rem] font-semibold tracking-[0.25em] uppercase text-warm transition-colors hover:bg-darkred"
        >
          Read Latest
        </a>
        <p className="mt-16 text-[0.6rem] tracking-[0.6em] uppercase text-warm-dim/30">
          + &nbsp;&nbsp; + &nbsp;&nbsp; +
        </p>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-navy)_75%)] pointer-events-none" />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CONTENT PILLARS                                                    */
/* ------------------------------------------------------------------ */
const PILLARS = [
  { name: "Music", desc: "From Afrobeats to Amapiano—the sounds shaping the continent and the world.", href: "/stories?category=music" },
  { name: "Culture", desc: "Traditions, movements, and the identities that define us.", href: "/stories?category=culture" },
  { name: "Film", desc: "Nollywood, documentaries, and the rise of African cinema.", href: "/stories?category=film" },
  { name: "Fashion", desc: "Designers, street style, and the aesthetics of modern Africa.", href: "/stories?category=fashion" },
  { name: "Events", desc: "Live experiences, festivals, and gatherings that move the culture.", href: "/events" },
  { name: "Finance", desc: "Building wealth, fintech, and economic futures.", href: "/stories?category=finance" },
  { name: "Policies", desc: "The decisions shaping Africa's trajectory on the global stage.", href: "/stories?category=policies" },
  { name: "Startups", desc: "Founders, ideas, and the companies rewriting the playbook.", href: "/stories?category=startups" },
  { name: "Lifestyle", desc: "Travel, food, wellness—how we live and celebrate.", href: "/stories?category=lifestyle" },
];

function Pillars() {
  return (
    <section id="culture" className="relative bg-charcoal py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-20 fade-in">
          <p className="text-[0.65rem] tracking-[0.5em] uppercase text-crimson mb-3">
            x &nbsp; The Scope &nbsp; x
          </p>
          <h2 className="font-serif text-4xl font-bold sm:text-5xl lg:text-6xl text-warm">
            What We Cover
          </h2>
        </div>

        <div className="stagger grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[1px] bg-white/5">
          {PILLARS.map((p, i) => {
            const isLarge = i === 0 || i === 3 || i === 7;
            return (
              <Link
                key={p.name}
                href={p.href}
                className={`pillar-item group relative bg-charcoal p-8 sm:p-10 transition-colors duration-300 hover:bg-navy ${
                  isLarge ? "col-span-2 row-span-1 sm:col-span-2" : "col-span-1"
                } fade-in`}
              >
                <span className="block font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-warm group-hover:text-crimson transition-colors duration-300">
                  {p.name}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-warm-dim/0 group-hover:text-warm-dim/70 transition-all duration-500 max-w-sm">
                  {p.desc}
                </p>
                <span className="absolute top-6 right-6 text-[0.6rem] text-warm-dim/20 group-hover:text-crimson/60 transition-colors">
                  +
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FEATURED STORIES                                                   */
/* ------------------------------------------------------------------ */
const FALLBACK_STORIES = [
  {
    category: "Music",
    headline: "The New Wave: How Amapiano Conquered Global Playlists",
    excerpt: "From the townships of Pretoria to festival stages in London and Tokyo, the genre refuses to be boxed in.",
    cover_image: null as string | null,
  },
  {
    category: "Film",
    headline: "Nollywood's Next Chapter Isn't What You Think",
    excerpt: "A new class of filmmakers are redefining narrative on their own terms.",
    cover_image: null as string | null,
  },
  {
    category: "Startups",
    headline: "Building in Lagos: The Founders Rewriting the Playbook",
    excerpt: "Inside the ecosystem producing Africa's most ambitious tech companies.",
    cover_image: null as string | null,
  },
];

function Featured() {
  const [stories, setStories] = useState(FALLBACK_STORIES);

  useEffect(() => {
    async function fetchFeatured() {
      const { data } = await supabase
        .from("stories")
        .select("title, excerpt, category, cover_image")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (data && data.length > 0) {
        setStories(
          data.map((s) => ({
            category: (s.category ?? "").charAt(0).toUpperCase() + (s.category ?? "").slice(1),
            headline: s.title,
            excerpt: s.excerpt ?? "",
            cover_image: s.cover_image,
          }))
        );
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section id="featured" className="relative bg-navy py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 fade-in">
          <p className="text-[0.65rem] tracking-[0.5em] uppercase text-crimson mb-3">
            + &nbsp; Latest &nbsp; +
          </p>
          <h2 className="font-serif text-4xl font-bold sm:text-5xl text-warm">
            Featured
          </h2>
        </div>

        <div className="grid gap-[1px] bg-white/5 lg:grid-cols-2">
          <div className="group relative bg-navy hover:bg-charcoal transition-colors duration-300 fade-in">
            {stories[0]?.cover_image ? (
              <img src={stories[0].cover_image} alt={stories[0].headline} className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="story-placeholder aspect-[4/3] w-full" />
            )}
            <div className="p-8 sm:p-10">
              <span className="inline-block mb-4 text-[0.65rem] tracking-[0.3em] uppercase text-crimson border border-crimson/30 px-3 py-1">
                {stories[0]?.category}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-warm leading-tight group-hover:text-crimson transition-colors duration-300">
                {stories[0]?.headline}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-warm-dim/60 max-w-md">
                {stories[0]?.excerpt}
              </p>
              <span className="mt-6 inline-block text-[0.75rem] tracking-[0.2em] uppercase text-crimson hover:text-warm transition-colors cursor-pointer">
                Read More &rarr;
              </span>
            </div>
          </div>

          <div className="grid gap-[1px] bg-white/5">
            {stories.slice(1).map((s) => (
              <div
                key={s.headline}
                className="group relative bg-navy hover:bg-charcoal transition-colors duration-300 fade-in"
              >
                <div className="flex flex-col sm:flex-row">
                  {s.cover_image ? (
                    <img src={s.cover_image} alt={s.headline} className="aspect-[16/10] sm:aspect-square sm:w-48 lg:w-56 shrink-0 object-cover" />
                  ) : (
                    <div className="story-placeholder aspect-[16/10] sm:aspect-square sm:w-48 lg:w-56 shrink-0" />
                  )}
                  <div className="p-8">
                    <span className="inline-block mb-3 text-[0.6rem] tracking-[0.3em] uppercase text-crimson border border-crimson/30 px-3 py-1">
                      {s.category}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-warm leading-snug group-hover:text-crimson transition-colors duration-300">
                      {s.headline}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-warm-dim/60">
                      {s.excerpt}
                    </p>
                    <span className="mt-4 inline-block text-[0.7rem] tracking-[0.2em] uppercase text-crimson hover:text-warm transition-colors cursor-pointer">
                      Read More &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  EVENTS / TICKETING                                                 */
/* ------------------------------------------------------------------ */
const FALLBACK_EVENTS = [
  { date: "Jul 18, 2026", name: "Afro Culture Fest", location: "Lagos, Nigeria" },
  { date: "Aug 09, 2026", name: "TheGram Live: Sound & Vision", location: "Accra, Ghana" },
  { date: "Sep 27, 2026", name: "Diaspora Connect Summit", location: "London, UK" },
];

function HomeEvents() {
  const [events, setEvents] = useState(FALLBACK_EVENTS);

  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase
        .from("events")
        .select("name, date, location")
        .eq("published", true)
        .gte("date", new Date().toISOString())
        .order("date", { ascending: true })
        .limit(3);

      if (data && data.length > 0) {
        setEvents(
          data.map((e) => ({
            date: new Date(e.date).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }),
            name: e.name,
            location: e.location,
          }))
        );
      }
    }
    fetchEvents();
  }, []);

  return (
    <section id="events" className="relative bg-charcoal py-28 sm:py-36 plus-field">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 fade-in">
          <p className="text-[0.65rem] tracking-[0.5em] uppercase text-crimson mb-3">
            x &nbsp; Live &nbsp; x
          </p>
          <h2 className="font-serif text-4xl font-bold sm:text-5xl text-warm">
            Upcoming Events
          </h2>
          <p className="mt-4 text-base text-warm-dim/60 max-w-lg">
            Experience culture live. Get your tickets.
          </p>
        </div>

        <div className="grid gap-[1px] bg-white/5 sm:grid-cols-3">
          {events.map((ev) => (
            <div
              key={ev.name}
              className="group bg-charcoal hover:bg-navy p-8 sm:p-10 transition-colors duration-300 fade-in"
            >
              <p className="text-[0.65rem] tracking-[0.3em] uppercase text-crimson/70 mb-4">
                {ev.date}
              </p>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-warm leading-tight group-hover:text-crimson transition-colors duration-300">
                {ev.name}
              </h3>
              <p className="mt-2 text-sm text-warm-dim/50">{ev.location}</p>
              <a
                href="/events#tickets"
                className="cta-glow mt-8 inline-block border border-crimson/40 px-6 py-3 text-[0.7rem] tracking-[0.2em] uppercase text-crimson hover:bg-crimson hover:text-warm transition-all duration-300"
              >
                Get Tickets
              </a>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center fade-in">
          <a
            href="/events"
            className="cta-glow inline-block bg-crimson px-12 py-4 text-[0.8rem] font-semibold tracking-[0.25em] uppercase text-warm hover:bg-darkred transition-colors"
          >
            View All Events
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  NEWSLETTER                                                         */
/* ------------------------------------------------------------------ */
function Newsletter() {
  return (
    <section className="relative bg-gradient-to-br from-crimson to-darkred py-28 sm:py-36 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-[12rem] font-serif font-bold text-white/10 leading-none select-none">
          +
        </div>
        <div className="absolute bottom-10 right-10 text-[8rem] font-serif font-bold text-white/10 leading-none select-none">
          x
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center fade-in">
        <h2 className="font-serif text-4xl font-bold sm:text-5xl text-warm">
          Join The Movement
        </h2>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-warm/80">
          Get the best of African culture, music, and business delivered weekly.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-12 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
        >
          <input
            type="email"
            required
            placeholder="your@email.com"
            className="flex-1 bg-white/10 border border-white/20 px-5 py-4 text-sm text-warm placeholder:text-warm/40 focus:bg-white/15 transition-colors"
          />
          <button
            type="submit"
            className="bg-navy px-8 py-4 text-[0.75rem] font-semibold tracking-[0.25em] uppercase text-warm hover:bg-charcoal transition-colors shrink-0"
          >
            Subscribe
          </button>
        </form>

        <p className="mt-6 text-[0.65rem] tracking-[0.3em] uppercase text-warm/40">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
export default function Home() {
  return (
    <>
      <Hero />
      <Pillars />
      <Featured />
      <HomeEvents />
      <Newsletter />
    </>
  );
}
