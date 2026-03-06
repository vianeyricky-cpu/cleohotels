import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlobalLoader } from "@/components/GlobalLoader";

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalLoader />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}