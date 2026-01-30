"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Efek Scroll: Ubah background saat di-scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup menu otomatis saat pindah halaman
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled || isOpen ? "bg-navy-950 shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="relative h-16 w-52 md:h-18 md:w-54 z-[101]">
             {/* Pastikan file logo ada di public/icon.svg atau sesuaikan src-nya */}
             <Image 
               src="/logo.png" 
               alt="Cleo Hotels" 
               fill 
               className="object-contain"
               priority
             />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/" label="Home" active={pathname === "/"} />
            <NavLink href="/hotels" label="Our Hotels" active={pathname?.startsWith("/hotels")} />
            <NavLink href="/facilities" label="Facilities" active={pathname === "/facilities"} />
            <NavLink href="/contact" label="Contact" active={pathname === "/contact"} />
            
            <Link
              href="/hotels"
              className="rounded-full bg-gold-500 px-6 py-2.5 text-sm font-bold text-navy-950 transition hover:bg-white hover:text-navy-950"
            >
              Book Now
            </Link>
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden z-[101] p-2 text-white transition hover:text-gold-500 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div
        className={`fixed inset-0 bg-navy-950 z-[90] flex flex-col items-center justify-center gap-8 transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <NavLink href="/" label="Home" onClick={() => setIsOpen(false)} />
        <NavLink href="/hotels" label="Our Hotels" onClick={() => setIsOpen(false)} />
        <NavLink href="/facilities" label="Facilities" onClick={() => setIsOpen(false)} />
        <NavLink href="/contact" label="Contact" onClick={() => setIsOpen(false)} />
        
        <Link
          href="/hotels"
          onClick={() => setIsOpen(false)}
          className="mt-4 rounded-full bg-gold-500 px-8 py-3 text-lg font-bold text-navy-950 transition hover:bg-white"
        >
          Book Now
        </Link>
      </div>
    </nav>
  );
}

// Komponen Kecil untuk Link agar rapi
function NavLink({ 
  href, 
  label, 
  active, 
  onClick 
}: { 
  href: string; 
  label: string; 
  active?: boolean; 
  onClick?: () => void; 
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-sm md:text-base font-medium transition-colors hover:text-gold-500 ${
        active ? "text-gold-500" : "text-white/90"
      }`}
    >
      {label}
    </Link>
  );
}