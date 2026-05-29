"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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

const FALLBACK_STORIES = [
  { id: null as string | null, category: "Music", title: "The Rise of Afrobeats: From Local Sound to Global Domination", excerpt: "How a generation of artists turned a regional genre into the most streamed sound on the planet — and why the best is still ahead.", author: "Kofi Mensah", created_at: "2026-05-18", cover_image: null as string | null },
  { id: null as string | null, category: "Culture", title: "The Festival Revolution: How Cultural Events Are Reshaping African Tourism", excerpt: "From Afrochella to Lake of Stars, a network of festivals is drawing the diaspora home and rewriting the continent's tourism playbook.", author: "Nia Adjei", created_at: "2026-05-02", cover_image: null as string | null },
  { id: null as string | null, category: "Film", title: "Inside Nollywood's $6 Billion Creative Economy", excerpt: "The numbers behind the world's second-largest film industry and the new wave of directors pushing boundaries with global distribution deals.", author: "Chidinma Eze", created_at: "2026-05-14", cover_image: null as string | null },
  { id: null as string | null, category: "Fashion", title: "From Accra to Paris: The African Designers Redefining Luxury Fashion", excerpt: "A new guard of designers are taking African textiles and craftsmanship to the world's most prestigious runways and retail shelves.", author: "Fatima Diallo", created_at: "2026-05-10", cover_image: null as string | null },
  { id: null as string | null, category: "Finance", title: "Africa's Crypto Adoption Is Outpacing Every Other Continent — Here's Why", excerpt: "Across Nigeria, Kenya, and South Africa, cryptocurrency isn't speculation — it's infrastructure for a generation locked out of traditional banking.", author: "Emeka Nwosu", created_at: "2026-05-06", cover_image: null as string | null },
  { id: null as string | null, category: "Policies", title: "The AfCFTA Effect: How Free Trade Is Redrawing Africa's Economic Map", excerpt: "The African Continental Free Trade Area is the largest free trade zone by number of countries — and it's just getting started.", author: "Kwame Asante", created_at: "2026-04-28", cover_image: null as string | null },
  { id: null as string | null, category: "Startups", title: "How a Lagos Startup Is Revolutionizing Digital Payments Across West Africa", excerpt: "With over 40 million transactions processed in its first year, this fintech company is proving that African-built solutions can compete on the world stage.", author: "Amara Osei", created_at: "2026-05-22", cover_image: null as string | null },
  { id: null as string | null, category: "Lifestyle", title: "The New African Traveler: Exploring the Continent on Its Own Terms", excerpt: "A growing wave of intra-African tourism is redefining travel — from luxury safaris in Rwanda to surf culture in Dakar.", author: "Zuri Mwangi", created_at: "2026-04-20", cover_image: null as string | null },
  { id: null as string | null, category: "Music", title: "Amapiano's Next Chapter: The Producers Pushing the Sound Forward", excerpt: "From the townships of Pretoria to festival stages in London and Tokyo, the genre refuses to be boxed in.", author: "Thabo Dlamini", created_at: "2026-04-15", cover_image: null as string | null },
];

function resolveCategory(param: string | null): string {
  if (!param) return "All";
  const match = CATEGORIES.find(
    (c) => c.toLowerCase() === param.toLowerCase()
  );
  return match ?? "All";
}

function StoriesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const categoryParam = searchParams.get("category");
  const [active, setActive] = useState(() => resolveCategory(categoryParam));
  const [stories, setStories] = useState(FALLBACK_STORIES);

  useEffect(() => {
    setActive(resolveCategory(categoryParam));
  }, [categoryParam]);

  useEffect(() => {
    async function fetchStories() {
      const { data } = await supabase
        .from("stories")
        .select("id, title, excerpt, category, author, created_at, cover_image")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setStories(
          data.map((s) => ({
            id: s.id,
            category: (s.category ?? "").charAt(0).toUpperCase() + (s.category ?? "").slice(1),
            title: s.title,
            excerpt: s.excerpt ?? "",
            author: s.author ?? "",
            created_at: s.created_at,
            cover_image: s.cover_image,
          }))
        );
      }
    }
    fetchStories();
  }, []);

  const filtered =
    active === "All"
      ? stories
      : stories.filter((s) => s.category === active);

  const selectCategory = useCallback(
    (cat: string) => {
      setActive(cat);
      if (cat === "All") {
        router.push(pathname, { scroll: false });
      } else {
        router.push(`${pathname}?category=${cat.toLowerCase()}`, {
          scroll: false,
        });
      }
    },
    [router, pathname]
  );

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
                onClick={() => selectCategory(cat)}
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
              <p className="mt-3 text-sm text-warm-dim/30">Check back soon.</p>
            </div>
          ) : (
            <div className="grid gap-[1px] bg-white/5 md:grid-cols-2">
              {filtered.map((story) => (
                <Link
                  key={story.title}
                  href={story.id ? `/stories/${story.id}` : "#"}
                  className="group bg-navy hover:bg-charcoal transition-colors duration-300 fade-in block"
                >
                  {story.cover_image ? (
                    <img
                      src={story.cover_image}
                      alt={story.title}
                      className="aspect-[16/9] w-full object-cover"
                    />
                  ) : (
                    <div className="story-placeholder aspect-[16/9] w-full" />
                  )}
                  <div className="p-8 sm:p-10">
                    <span className="inline-block mb-4 text-[0.6rem] tracking-[0.3em] uppercase text-crimson border border-crimson/30 px-3 py-1">
                      {story.category}
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-warm leading-snug group-hover:text-crimson transition-colors duration-300">
                      {story.title}
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
                        {new Date(story.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <span className="text-[0.7rem] tracking-[0.2em] uppercase text-crimson group-hover:text-warm transition-colors">
                        Read More &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function StoriesPage() {
  return (
    <Suspense>
      <StoriesContent />
    </Suspense>
  );
}
