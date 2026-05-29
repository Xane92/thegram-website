import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TheGram — Stories of African Greatness",
  description:
    "TheGram is a premium African culture and lifestyle media platform covering music, film, fashion, events, business, and more.",
  keywords: [
    "African culture",
    "Afrobeats",
    "African media",
    "lifestyle",
    "music",
    "film",
    "fashion",
    "events",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
