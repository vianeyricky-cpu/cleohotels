import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer"; // <--- PENTING: Import Footer

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair" 
});

export const metadata: Metadata = {
  title: "Cleo Hotels - Managed by Tanly Hospitality",
  description: "Smart comfort for every journey. Business & leisure hotels in Surabaya.",
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale} className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-navy-950 text-white antialiased`}>
        
        {/* Navbar Selalu di Atas */}
        <Navbar />
        
        {/* Konten Halaman Berubah-ubah disini */}
        {children}

        {/* Footer Selalu di Bawah */}
        <Footer /> 

      </body>
    </html>
  );
}