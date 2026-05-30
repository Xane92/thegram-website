import Link from "next/link";

const PILLARS = [
  {
    name: "Music",
    text: "From the rise of Afrobeats to the global spread of Amapiano, we chronicle the artists, producers, and cultural movements that have turned African sound into the world's most exciting musical force. We go beyond the charts to tell the stories behind the music.",
  },
  {
    name: "Culture",
    text: "We document the traditions, art, language, and social movements that define who we are. Culture is not static — it is living, evolving, and constantly being reimagined by a new generation that honors the past while building something entirely new.",
  },
  {
    name: "Film",
    text: "Nollywood is the world's second-largest film industry by volume, but our lens extends beyond Nigeria. From documentaries in East Africa to animation studios in South Africa, we cover the full breadth of African cinema and the filmmakers pushing its boundaries.",
  },
  {
    name: "Fashion",
    text: "African fashion is no longer emerging — it has arrived. We profile the designers, textile artisans, and creative directors whose work is reshaping luxury fashion from Lagos to Paris, Accra to Milan.",
  },
  {
    name: "Events",
    text: "Festivals, premieres, summits, and gatherings are where culture happens in real time. We cover the events that bring communities together and create the moments that define a generation.",
  },
  {
    name: "Finance & Business",
    text: "Africa's startup ecosystem is producing unicorns, its fintech sector is leapfrogging legacy banking, and a new class of entrepreneurs is building companies that solve real problems at continental scale. We tell their stories with the depth they deserve.",
  },
  {
    name: "Policies",
    text: "The political and regulatory decisions shaping Africa's future deserve rigorous, accessible coverage. We break down trade agreements, digital governance, and economic policy through the lens of how they affect the people building the continent's future.",
  },
  {
    name: "Lifestyle",
    text: "Travel, food, wellness, architecture — how we live is as important as what we build. We explore the spaces, rituals, and daily choices that define modern African life across the continent and its diaspora.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-20 sm:pt-44 sm:pb-28 bg-charcoal x-pattern overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-charcoal)_75%)] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center page-enter">
          <p className="mb-4 text-[0.65rem] tracking-[0.5em] uppercase text-crimson/80">
            x &nbsp; Who We Are &nbsp; x
          </p>
          <h1 className="font-serif text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-warm">About</span>{" "}
            <span className="gradient-text">TheGram</span>
          </h1>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-navy py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <div className="fade-in">
            <p className="text-[0.65rem] tracking-[0.5em] uppercase text-crimson mb-6">
              + &nbsp; Our Mission &nbsp; +
            </p>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-warm leading-snug">
              TheGram exists to amplify stories of African greatness.
            </p>
            <div className="mt-8 space-y-6 text-base leading-[1.85] text-warm-dim/60">
              <p>
                Across music, culture, film, fashion, events, finance, policies,
                and business, we believe the most important stories of our time
                are being written on the African continent and across its
                diaspora. These are not stories waiting to be discovered — they
                are stories that deserve a platform equal to their ambition.
              </p>
              <p>
                We are the blueprint of greatness. Not a
                news wire, not an aggregator — an editorial platform built with
                the same care, craft, and intentionality as the culture we
                cover. Every piece we publish is a deliberate act of
                amplification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-charcoal py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <div className="fade-in">
            <p className="text-[0.65rem] tracking-[0.5em] uppercase text-crimson mb-6">
              x &nbsp; Our Vision &nbsp; x
            </p>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-warm leading-snug">
              To become the definitive media platform for African excellence and
              the diaspora.
            </p>
            <div className="mt-8 space-y-6 text-base leading-[1.85] text-warm-dim/60">
              <p>
                We see a future where the default narrative about Africa is one
                of innovation, creativity, and relentless forward motion. Where
                the founders, artists, filmmakers, and thinkers shaping the
                continent&apos;s trajectory are as recognized globally as their
                counterparts anywhere else. TheGram is building toward that
                future — one story at a time.
              </p>
              <p>
                Our audience is the young professional in Lagos, the creative
                director in Accra, the diaspora entrepreneur in London, the
                investor in Nairobi. They share a common thread: they are
                building something, and they want media that reflects the scale
                of their ambition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-navy py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <div className="mb-16 fade-in">
            <p className="text-[0.65rem] tracking-[0.5em] uppercase text-crimson mb-3">
              + &nbsp; What We Cover &nbsp; +
            </p>
            <h2 className="font-serif text-3xl font-bold sm:text-4xl text-warm">
              Our Pillars
            </h2>
          </div>

          <div className="space-y-0">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.name}
                className="pillar-item relative border-t border-white/5 py-10 sm:py-12 fade-in"
              >
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-crimson mb-4">
                  {pillar.name}
                </h3>
                <p className="text-base leading-[1.85] text-warm-dim/55 max-w-2xl">
                  {pillar.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="bg-gradient-to-br from-crimson to-darkred py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-12 text-[10rem] font-serif font-bold text-white/10 leading-none select-none">
            x
          </div>
        </div>
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center fade-in">
          <h2 className="font-serif text-3xl font-bold sm:text-4xl text-warm">
            Join The Movement
          </h2>
          <p className="mt-6 text-base leading-relaxed text-warm/75 max-w-md mx-auto">
            Get the best of African culture, music, and business delivered to
            your inbox every week.
          </p>
          <Link
            href="/#newsletter"
            className="cta-glow mt-10 inline-block bg-navy px-10 py-4 text-[0.8rem] font-semibold tracking-[0.25em] uppercase text-warm hover:bg-charcoal transition-colors"
          >
            Subscribe Now
          </Link>
        </div>
      </section>
    </>
  );
}
