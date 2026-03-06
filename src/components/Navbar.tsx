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
  
  const locale = (params?.locale as string) || "id";
  const isHotelsPage = pathname?.includes("/hotels");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled || isOpen 
          ? "bg-white shadow-md py-2" 
          : "bg-white/95 backdrop-blur-sm py-2 border-b border-neutral-100"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          
          <Link href={`/${locale}`} className="relative h-10 w-32 md:h-12 md:w-36 z-[101]">
             <Image 
               src="/logo.png" 
               alt="Cleo Hotels" 
               fill 
               className="object-contain object-left"
               priority
             />
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <NavLink href={`/${locale}`} label="Home" active={pathname === `/${locale}` || pathname === `/${locale}/`} />
            <NavLink href={`/${locale}/hotels`} label="Our Hotels" active={isHotelsPage} />
            <NavLink href={`/${locale}/about`} label="About Us" active={pathname?.includes("/about")} />
            <NavLink href={`/${locale}/contact`} label="Contact" active={pathname?.includes("/contact")} />
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden z-[101] p-2 text-neutral-800 transition hover:text-blue-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-white z-[90] flex flex-col items-center justify-center gap-8 transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <NavLink href={`/${locale}`} label="Home" onClick={() => setIsOpen(false)} mobile />
        <NavLink href={`/${locale}/hotels`} label="Our Hotels" onClick={() => setIsOpen(false)} mobile />
        <NavLink href={`/${locale}/about`} label="About Us" onClick={() => setIsOpen(false)} mobile />
        <NavLink href={`/${locale}/contact`} label="Contact" onClick={() => setIsOpen(false)} mobile />
      </div>
    </nav>
  );
}

function NavLink({ href, label, active, mobile, onClick }: { href: string; label: string; active?: boolean; mobile?: boolean; onClick?: () => void; }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`font-medium transition-colors hover:text-blue-700 tracking-wide ${
        mobile ? "text-2xl" : "text-sm" 
      } ${active ? "text-blue-700 font-bold" : "text-neutral-600"}`}
    >
      {label}
    </Link>
  );
}