import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center x-pattern overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-navy)_75%)] pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <p className="text-[0.65rem] tracking-[0.5em] uppercase text-crimson/80 mb-6">
          x &nbsp; 404 &nbsp; x
        </p>
        <h1 className="font-serif text-6xl sm:text-8xl font-bold gradient-text mb-4">
          Lost
        </h1>
        <p className="font-serif text-2xl sm:text-3xl font-bold text-warm mb-4">
          Page Not Found
        </p>
        <p className="text-base text-warm-dim/50 max-w-md mx-auto mb-12">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back to the stories that matter.
        </p>
        <Link
          href="/"
          className="cta-glow inline-block bg-crimson px-10 py-4 text-[0.8rem] font-semibold tracking-[0.25em] uppercase text-warm hover:bg-darkred transition-colors"
        >
          Back to Home
        </Link>
        <p className="mt-16 text-[0.6rem] tracking-[0.6em] uppercase text-warm-dim/20">
          + &nbsp;&nbsp; + &nbsp;&nbsp; +
        </p>
      </div>
    </section>
  );
}
