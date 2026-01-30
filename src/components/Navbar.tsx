"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-navy-950/95 shadow-2xl backdrop-blur-md py-4" 
          : "bg-gradient-to-b from-black/80 to-transparent py-8" 
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8 md:px-12">
        
        {/* LOGO */}
        <Link 
          href="/en" 
          className={`relative transition-all duration-500 ${
            isScrolled ? "h-20 w-56" : "h-28 w-80" 
          }`}
        >
          <Image 
            src="/logo.png" 
            alt="Cleo Hotels" 
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        {/* MENU (UPDATED: About Us & Contact) */}
        <div className="hidden md:flex items-center gap-10"> 
          {[
            { name: "HOME", path: "/en" },
            { name: "OUR HOTELS", path: "/en#hotels" },
            { name: "ABOUT US", path: "/en/about" },   // <-- Menu Baru
            { name: "CONTACT", path: "/en/contact" }   // <-- Menu Baru
          ].map((item, index) => (
              <Link 
                key={index}
                href={item.path} 
                className="text-base font-bold tracking-[0.15em] text-white transition-all duration-300 hover:text-gold-400 hover:scale-105"
              >
                {item.name}
              </Link>
          ))}
        </div>

        {/* TOMBOL BOOK NOW */}
        <button className="hidden md:block rounded-full bg-gold-500 px-8 py-3 text-sm font-extrabold tracking-wider text-navy-950 shadow-[0_0_20px_rgba(184,139,58,0.4)] transition-all hover:bg-gold-400 hover:scale-105 hover:shadow-[0_0_30px_rgba(184,139,58,0.7)]">
          BOOK NOW
        </button>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
            <button className="text-white p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
        </div>
      </div>
    </nav>
  );
}