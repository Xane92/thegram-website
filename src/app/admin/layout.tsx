"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Stories", href: "/admin/stories" },
  { label: "Events", href: "/admin/events" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [loading, user, isLoginPage, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-navy">{children}</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-crimson/30 border-t-crimson rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen bg-navy">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-charcoal border-b border-white/5 flex items-center justify-between px-4 lg:pl-64">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-warm-dim/60 hover:text-warm"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="text-sm font-semibold tracking-[0.15em] uppercase text-warm">
            TheGram Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-warm-dim/40 hidden sm:block">
            {user.email}
          </span>
          <button
            onClick={handleSignOut}
            className="text-xs tracking-[0.1em] uppercase text-warm-dim/50 hover:text-crimson transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-14 left-0 bottom-0 w-60 bg-charcoal border-r border-white/5 z-30 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                  isActive
                    ? "bg-crimson/10 text-crimson"
                    : "text-warm-dim/60 hover:text-warm hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleSignOut}
            className="w-full px-3 py-2.5 text-sm text-warm-dim/40 hover:text-crimson transition-colors text-left"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="pt-14 lg:pl-60">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
