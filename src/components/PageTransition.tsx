"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });

    if (ref.current) {
      ref.current.style.animation = "none";
      void ref.current.offsetHeight;
      ref.current.style.animation = "";
    }
  }, [pathname]);

  return (
    <div ref={ref} className="page-enter">
      {children}
    </div>
  );
}
