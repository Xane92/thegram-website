import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stories | THEGRAM — The Blueprint of Greatness",
  description:
    "The blueprint of greatness. Read stories of African greatness across music, culture, film, fashion, finance, and business.",
};

export default function StoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
