"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/", match: "/" },
  { label: "Stories", href: "/stories", match: "/stories" },
  { label: "Events", href: "/events", match: "/events" },
  { label: "About", href: "/about", match: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy/80 backdrop-blur-xl border-b border-white/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
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

        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.match === "/"
                ? pathname === "/"
                : pathname.startsWith(link.match);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`nav-link relative text-[0.8rem] tracking-[0.15em] uppercase transition-colors ${
                  isActive
                    ? "text-crimson"
                    : "text-warm-dim/80 hover:text-warm"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-crimson" />
                )}
              </Link>
            );
          })}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex flex-col gap-[5px] p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-[1.5px] w-6 bg-warm transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-[6.5px]" : ""
            }`}
          />
          <span
            className={`block h-[1.5px] w-6 bg-warm transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-[1.5px] w-6 bg-warm transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`lg:hidden overflow-hidden transition-all duration-400 ${
          menuOpen ? "max-h-[480px] border-b border-white/5" : "max-h-0"
        }`}
      >
        <div className="bg-navy/95 backdrop-blur-xl px-6 pb-8 pt-4 flex flex-col gap-5">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.match === "/"
                ? pathname === "/"
                : pathname.startsWith(link.match);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm tracking-[0.2em] uppercase transition-colors ${
                  isActive
                    ? "text-crimson"
                    : "text-warm-dim/80 hover:text-crimson"
                }`}
              >
                {isActive && (
                  <span className="inline-block w-3 h-[1px] bg-crimson mr-3 align-middle" />
                )}
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
