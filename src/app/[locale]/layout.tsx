import { Suspense } from "react";
import { Concierge } from "@/components/public/Concierge";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlobalLoader } from "@/components/GlobalLoader";

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cleo-site">
      <Suspense fallback={null}><GlobalLoader /></Suspense>
      <ScrollReveal />
      <Navbar />
      {children}
      <Footer />
      <Concierge />
    </div>
  );
}