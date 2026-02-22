"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";

export function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Efek 1: Matikan loading saat URL selesai berubah
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  // Efek 2: Tangkap setiap klik pada link (tag <a>)
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      // Cari elemen <a> terdekat yang di-klik
      const target = (e.target as Element).closest("a");
      
      if (!target) return; // Kalau bukan link, abaikan
      
      // Pastikan itu adalah link internal web kita, bukan buka tab baru
      if (
        target.href &&
        target.target !== "_blank" &&
        target.href.startsWith(window.location.origin) &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        // Cek apakah tujuan URL beda dengan URL saat ini
        const currentPath = window.location.pathname + window.location.search;
        const targetPath = target.pathname + target.search;
        
        if (currentPath !== targetPath) {
          setIsLoading(true); // Nyalakan loading!
        }
      }
    };

    // Pasang alat pendengar klik ke seluruh dokumen
    document.addEventListener("click", handleAnchorClick);
    
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  // Jika tidak loading, jangan tampilkan apa-apa
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="relative flex flex-col items-center animate-fade-in-up">
        {/* Pastikan nama file GIF di bawah ini sesuai dengan yang ada di folder public Anda */}
        <Image 
          src="/loading-cleo.gif" 
          alt="Memuat halaman..." 
          width={120} 
          height={120} 
          className="object-contain"
          unoptimized 
        />
        <p className="mt-4 text-sm font-bold text-gold-500 uppercase tracking-widest animate-pulse">
          Cleo Hotels
        </p>
      </div>
    </div>
  );
}