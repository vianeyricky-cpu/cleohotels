"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useParams } from "next/navigation"; 
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const pathname = usePathname();
  const params = useParams();
  
  // Ambil locale (bahasa) dari URL, default ke 'id' jika tidak ada
  const locale = (params?.locale as string) || "id";

  // Efek Scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup menu saat pindah halaman
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled || isOpen ? "bg-navy-950 shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          
          {/* LOGO JUMBO (Tetap Besar) */}
          <Link href={`/${locale}`} className="relative h-14 w-48 md:h-28 md:w-80 z-[101] -ml-2">
             <Image 
               src="/logo.png" 
               alt="Cleo Hotels" 
               fill 
               className="object-contain object-left"
               priority
             />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-10">
            <NavLink 
              href={`/${locale}`} 
              label="Home" 
              active={pathname === `/${locale}` || pathname === `/${locale}/`} 
            />
            <NavLink 
              href={`/${locale}/hotels`} 
              label="Our Hotels" 
              active={pathname?.includes("/hotels")} 
            />
            
            {/* GANTI FACILITIES JADI ABOUT US */}
            <NavLink 
              href={`/${locale}/about`} 
              label="About Us" 
              active={pathname?.includes("/about")} 
            />
            
            <NavLink 
              href={`/${locale}/contact`} 
              label="Contact" 
              active={pathname?.includes("/contact")} 
            />
            
            <Link
              href={`/${locale}/hotels`}
              className="rounded-full bg-gold-500 px-8 py-3 text-base font-bold text-navy-950 transition hover:bg-white hover:text-navy-950 shadow-lg shadow-gold-500/20"
            >
              Book Now
            </Link>
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden z-[101] p-2 text-white transition hover:text-gold-500 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div
        className={`fixed inset-0 bg-navy-950 z-[90] flex flex-col items-center justify-center gap-8 transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <NavLink href={`/${locale}`} label="Home" onClick={() => setIsOpen(false)} mobile />
        <NavLink href={`/${locale}/hotels`} label="Our Hotels" onClick={() => setIsOpen(false)} mobile />
        
        {/* GANTI FACILITIES JADI ABOUT US (MOBILE) */}
        <NavLink href={`/${locale}/about`} label="About Us" onClick={() => setIsOpen(false)} mobile />
        
        <NavLink href={`/${locale}/contact`} label="Contact" onClick={() => setIsOpen(false)} mobile />
        
        <Link
          href={`/${locale}/hotels`}
          onClick={() => setIsOpen(false)}
          className="mt-6 rounded-full bg-gold-500 px-10 py-4 text-xl font-bold text-navy-950 transition hover:bg-white"
        >
          Book Now
        </Link>
      </div>
    </nav>
  );
}

// Helper Link Component
function NavLink({ 
  href, 
  label, 
  active, 
  mobile,
  onClick 
}: { 
  href: string; 
  label: string; 
  active?: boolean; 
  mobile?: boolean;
  onClick?: () => void; 
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`font-medium transition-colors hover:text-gold-500 tracking-wide ${
        mobile ? "text-2xl" : "text-lg" 
      } ${
        active ? "text-gold-500 font-bold" : "text-white/90"
      }`}
    >
      {label}
    </Link>
  );
}