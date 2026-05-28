const EVENTS = [
  {
    date: "Jul 18",
    year: "2026",
    name: "AfroNation Lagos 2026",
    location: "Eko Atlantic, Lagos, Nigeria",
    desc: "The biggest Afrobeats festival returns with three stages, 40+ artists, and a weekend of non-stop energy on the Atlantic coastline.",
  },
  {
    date: "Aug 22",
    year: "2026",
    name: "Lagos Fashion Week",
    location: "Federal Palace Hotel, Lagos, Nigeria",
    desc: "Africa's premier fashion event showcasing 30 emerging and established designers pushing the boundaries of contemporary African design.",
  },
  {
    date: "Sep 12",
    year: "2026",
    name: "Nollywood Film Premiere Night",
    location: "Silverbird Cinemas, Victoria Island, Lagos",
    desc: "An exclusive screening and red-carpet premiere celebrating the latest wave of Nollywood cinema with the filmmakers behind the lens.",
  },
  {
    date: "Oct 04",
    year: "2026",
    name: "Diaspora Connect Summit",
    location: "Kempinski Hotel, Accra, Ghana",
    desc: "A two-day gathering of founders, creatives, and policymakers bridging the African continent and its global diaspora.",
  },
];

export default function EventsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-20 sm:pt-44 sm:pb-28 bg-charcoal plus-field overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-charcoal)_75%)] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center page-enter">
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
            {EVENTS.map((ev) => (
              <article
                key={ev.name}
                className="group bg-navy hover:bg-charcoal transition-colors duration-300 p-8 sm:p-10 fade-in"
              >
                <div className="flex items-start gap-6">
                  {/* Date badge */}
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
                    <a
                      href="#tickets"
                      className="cta-glow mt-6 inline-block border border-crimson/40 px-6 py-3 text-[0.7rem] tracking-[0.2em] uppercase text-crimson hover:bg-crimson hover:text-warm transition-all duration-300"
                    >
                      Get Tickets
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Tickets & Booking */}
      <section
        id="tickets"
        className="bg-charcoal py-20 sm:py-28 plus-field"
      >
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
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

          <div className="fade-in border border-white/10 border-dashed bg-navy/50 p-12 sm:p-16 text-center">
            <div className="text-warm-dim/20 text-5xl font-serif font-bold mb-4 select-none">
              +
            </div>
            <p className="text-sm tracking-[0.15em] text-warm-dim/40 uppercase">
              Ticketing widget will be embedded here
            </p>
            <p className="mt-3 text-[0.7rem] text-warm-dim/25">
              Integration coming soon
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
