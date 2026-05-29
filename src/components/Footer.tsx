import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Stories", href: "/stories" },
  { label: "Events", href: "https://gramtickets.com", external: true },
  { label: "About", href: "/about" },
];

const CATEGORY_LINKS = [
  { label: "Music", href: "/stories?category=music" },
  { label: "Culture", href: "/stories?category=culture" },
  { label: "Film", href: "/stories?category=film" },
  { label: "Fashion", href: "/stories?category=fashion" },
  { label: "Finance", href: "/stories?category=finance" },
  { label: "Policies", href: "/stories?category=policies" },
  { label: "Startups", href: "/stories?category=startups" },
  { label: "Lifestyle", href: "/stories?category=lifestyle" },
];

const SOCIALS = ["Instagram", "TikTok", "X / Twitter", "Facebook", "LinkedIn"];

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-white/5 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex flex-col leading-none">
              <span className="font-serif text-xl font-bold tracking-[0.2em] text-warm">
                THE GRAM
                <sup className="text-[0.55em] text-crimson align-super ml-0.5">
                  co
                </sup>
              </span>
              <span className="text-[0.6rem] tracking-[0.35em] uppercase text-warm-dim/60 mt-0.5">
                Lifestyle Branding
              </span>
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-warm-dim/40 max-w-xs">
              The premium editorial platform for African culture, music, and
              lifestyle.
            </p>
          </div>

          <div>
            <p className="text-[0.65rem] tracking-[0.3em] uppercase text-crimson mb-6">
              Navigate
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-warm-dim/50 hover:text-warm transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-warm-dim/50 hover:text-warm transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[0.65rem] tracking-[0.3em] uppercase text-crimson mb-6">
              Categories
            </p>
            <ul className="space-y-3">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-warm-dim/50 hover:text-warm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[0.65rem] tracking-[0.3em] uppercase text-crimson mb-6">
              Follow
            </p>
            <ul className="space-y-3">
              {SOCIALS.map((s) => (
                <li key={s}>
                  <a
                    href="#"
                    className="text-sm text-warm-dim/50 hover:text-warm transition-colors"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[0.7rem] tracking-[0.15em] text-warm-dim/30">
            &copy; 2026 TheGram Media. All rights reserved.
          </p>
          <p className="text-[0.6rem] tracking-[0.4em] text-warm-dim/15 uppercase">
            + &nbsp; + &nbsp; + &nbsp; + &nbsp; +
          </p>
        </div>
      </div>
    </footer>
  );
}
