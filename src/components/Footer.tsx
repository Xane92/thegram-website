import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Stories", href: "/stories" },
  { label: "Culture", href: "/stories" },
  { label: "Music", href: "/stories" },
  { label: "Film", href: "/stories" },
  { label: "Fashion", href: "/stories" },
  { label: "Events", href: "/events" },
  { label: "Business", href: "/stories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/about" },
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
              {FOOTER_LINKS.map((link) => (
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

          <div className="flex flex-col items-start lg:items-end justify-between">
            <div className="text-warm-dim/10 text-6xl font-serif font-bold leading-none select-none">
              +&nbsp;x
              <br />
              x&nbsp;+
            </div>
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
