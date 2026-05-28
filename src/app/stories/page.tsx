"use client";

import { useState } from "react";

const CATEGORIES = [
  "All",
  "Music",
  "Culture",
  "Film",
  "Fashion",
  "Finance",
  "Policies",
  "Startups",
  "Lifestyle",
];

const STORIES = [
  {
    category: "Startups",
    headline:
      "How a Lagos Startup Is Revolutionizing Digital Payments Across West Africa",
    excerpt:
      "With over 40 million transactions processed in its first year, this fintech company is proving that African-built solutions can compete on the world stage.",
    author: "Amara Osei",
    date: "May 22, 2026",
  },
  {
    category: "Music",
    headline:
      "The Rise of Afrobeats: From Local Sound to Global Domination",
    excerpt:
      "How a generation of artists turned a regional genre into the most streamed sound on the planet — and why the best is still ahead.",
    author: "Kofi Mensah",
    date: "May 18, 2026",
  },
  {
    category: "Film",
    headline: "Inside Nollywood's $6 Billion Creative Economy",
    excerpt:
      "The numbers behind the world's second-largest film industry and the new wave of directors pushing boundaries with global distribution deals.",
    author: "Chidinma Eze",
    date: "May 14, 2026",
  },
  {
    category: "Fashion",
    headline:
      "From Accra to Paris: The African Designers Redefining Luxury Fashion",
    excerpt:
      "A new guard of designers are taking African textiles and craftsmanship to the world's most prestigious runways and retail shelves.",
    author: "Fatima Diallo",
    date: "May 10, 2026",
  },
  {
    category: "Finance",
    headline:
      "Africa's Crypto Adoption Is Outpacing Every Other Continent — Here's Why",
    excerpt:
      "Across Nigeria, Kenya, and South Africa, cryptocurrency isn't speculation — it's infrastructure for a generation locked out of traditional banking.",
    author: "Emeka Nwosu",
    date: "May 6, 2026",
  },
  {
    category: "Culture",
    headline:
      "The Festival Revolution: How Cultural Events Are Reshaping African Tourism",
    excerpt:
      "From Afrochella to Lake of Stars, a network of festivals is drawing the diaspora home and rewriting the continent's tourism playbook.",
    author: "Nia Adjei",
    date: "May 2, 2026",
  },
];

export default function StoriesPage() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? STORIES
      : STORIES.filter((s) => s.category === active);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-20 sm:pt-44 sm:pb-28 bg-charcoal x-pattern overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-charcoal)_75%)] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center page-enter">
          <p className="mb-4 text-[0.65rem] tracking-[0.5em] uppercase text-crimson/80">
            x &nbsp; Editorial &nbsp; x
          </p>
          <h1 className="font-serif text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="gradient-text">Stories</span>{" "}
            <span className="text-warm">of Greatness</span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-warm-dim/60 sm:text-lg">
            Breakthroughs, triumphs, and the voices shaping Africa&apos;s
            future.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-[60px] z-30 bg-navy/90 backdrop-blur-xl border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 text-[0.7rem] tracking-[0.15em] uppercase transition-all duration-300 shrink-0 ${
                  active === cat
                    ? "bg-crimson text-warm"
                    : "bg-white/5 text-warm-dim/60 hover:bg-white/10 hover:text-warm"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Story grid */}
      <section className="bg-navy py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {filtered.length === 0 ? (
            <div className="text-center py-20 fade-in">
              <p className="font-serif text-2xl text-warm-dim/40">
                No stories in this category yet.
              </p>
              <p className="mt-3 text-sm text-warm-dim/30">
                Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-[1px] bg-white/5 md:grid-cols-2">
              {filtered.map((story) => (
                <article
                  key={story.headline}
                  className="group bg-navy hover:bg-charcoal transition-colors duration-300 fade-in"
                >
                  <div className="story-placeholder aspect-[16/9] w-full" />
                  <div className="p-8 sm:p-10">
                    <span className="inline-block mb-4 text-[0.6rem] tracking-[0.3em] uppercase text-crimson border border-crimson/30 px-3 py-1">
                      {story.category}
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-warm leading-snug group-hover:text-crimson transition-colors duration-300">
                      {story.headline}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-warm-dim/50 line-clamp-2">
                      {story.excerpt}
                    </p>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-[0.65rem] tracking-[0.15em] text-warm-dim/30">
                        <span className="text-warm-dim/50">
                          {story.author}
                        </span>
                        <span className="mx-2">&middot;</span>
                        {story.date}
                      </div>
                      <a
                        href="#"
                        className="text-[0.7rem] tracking-[0.2em] uppercase text-crimson hover:text-warm transition-colors"
                      >
                        Read More &rarr;
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
