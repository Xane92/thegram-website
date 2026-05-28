"use client";

import { useEffect } from "react";

export default function ScrollFadeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.15 }
    );

    const observe = () => {
      document
        .querySelectorAll(".fade-in:not(.visible)")
        .forEach((el) => obs.observe(el));
    };

    observe();

    const mut = new MutationObserver(observe);
    mut.observe(document.body, { childList: true, subtree: true });

    return () => {
      obs.disconnect();
      mut.disconnect();
    };
  }, []);

  return <>{children}</>;
}
