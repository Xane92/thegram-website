import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollFadeProvider from "@/components/ScrollFadeProvider";
import PageTransition from "@/components/PageTransition";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScrollFadeProvider>
      <Navbar />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </ScrollFadeProvider>
  );
}
