import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollFadeProvider from "@/components/ScrollFadeProvider";
import PageTransition from "@/components/PageTransition";
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
      <body className="min-h-full">
        <ScrollFadeProvider>
          <Navbar />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </ScrollFadeProvider>
      </body>
    </html>
  );
}
