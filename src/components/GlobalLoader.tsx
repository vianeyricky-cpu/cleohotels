"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";

export function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Menggunakan useRef untuk menyimpan waktu mulai loading tanpa memicu render ulang
  const loadStartTime = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Efek 1: Matikan loading saat URL berubah, tapi WAJIB tunggu minimal 3 detik
  useEffect(() => {
    // Kalau tidak sedang loading, jangan lakukan apa-apa
    if (!isLoading) return;

    // Hitung berapa lama loading sudah berjalan
    const elapsed = Date.now() - loadStartTime.current;
    const MINIMUM_LOADING_TIME = 3000; // 3000 milidetik = 3 detik

    if (elapsed < MINIMUM_LOADING_TIME) {
      // Jika loading terlalu cepat, tahan sisa waktunya
      const remainingTime = MINIMUM_LOADING_TIME - elapsed;
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    } else {
      // Jika loading aslinya memang sudah lebih dari 3 detik, langsung matikan
      setIsLoading(false);
    }

    // Bersihkan timer jika komponen ditutup
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname, searchParams]); // Efek ini berjalan setiap kali halaman berganti

  // Efek 2: Tangkap setiap klik pada link
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as Element).closest("a");
      
      if (!target) return; 
      
      if (
        target.href &&
        target.target !== "_blank" &&
        target.href.startsWith(window.location.origin) &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        const currentPath = window.location.pathname + window.location.search;
        const targetPath = target.pathname + target.search;
        
        if (currentPath !== targetPath) {
          // CATAT WAKTU MULAI KLIK
          loadStartTime.current = Date.now();
          setIsLoading(true); 
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm transition-opacity duration-500">
      <div className="relative flex flex-col items-center animate-fade-in-up">
        {/* LOGO DIPERBESAR (Ubah angka width & height di bawah ini jika ingin lebih besar/kecil lagi) */}
        <Image 
          src="/loading-cleo.gif" 
          alt="Memuat halaman..." 
          width={240} 
          height={240} 
          className="object-contain"
          unoptimized 
        />
        
        {/* TEKS DIPERKECIL (Menggunakan text-xs, jika masih kurang kecil bisa diganti text-[10px]) */}
        <p className="mt-2 text-xs font-bold text-gold-500 uppercase tracking-widest animate-pulse">
          Please Wait ...
        </p>
      </div>
    </div>
  );
}