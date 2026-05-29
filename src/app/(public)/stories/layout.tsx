import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stories | TheGram — African Breakthroughs & Success",
  description:
    "Breakthroughs, triumphs, and the voices shaping Africa's future. Read stories of greatness across music, culture, film, fashion, finance, and business.",
};

export default function StoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
