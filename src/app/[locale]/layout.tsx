import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css"; // Mengembalikan nyawa CSS Tailwind
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlobalLoader } from "@/components/GlobalLoader";
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Cleo Hotels - Managed by Tanly Hospitality",
  description: "Smart comfort for every journey. Business & leisure hotels in Surabaya.",
};

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale} className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased text-neutral-900 bg-white`}>
        <GlobalLoader />
        <Navbar />
        
        {children}
        
        <Footer />
        <GoogleAnalytics gaId="G-GANTIDENGANIDANDA" />
      </body>
    </html>
  );
}