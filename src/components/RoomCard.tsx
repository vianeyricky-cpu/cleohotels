"use client";

import { useState } from "react";
import Image from "next/image";
import { Room } from "@/types";
import { 
  Users, 
  Maximize, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Expand 
} from "lucide-react";

// --- GAMBAR CADANGAN (PASTI JALAN) ---
// Gambar ini akan dipakai jika database kosong atau link-nya rusak
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop",
];

export function RoomCard({ room }: { room: Room }) {
  // 1. FILTER URL GAMBAR
  // Cek apakah gambar dari database itu link online (http/https).
  // Jika CUMA tulisan path lokal (misal: "/images/foto.jpg") dan filenya tidak ada, kita anggap invalid.
  const isValidUrl = room.image && (room.image.startsWith("http") || room.image.startsWith("https"));
  
  // Jika valid, pakai gambar DB + Defaults. Jika tidak, pakai Defaults saja.
  const images = isValidUrl ? [room.image!, ...DEFAULT_IMAGES] : DEFAULT_IMAGES;
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Navigasi Slide
  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah klik tembus ke lightbox
    setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <>
      {/* --- KARTU UTAMA --- */}
      <div className="group relative overflow-hidden rounded-xl bg-navy-950 border border-white/5 transition flex flex-col h-full hover:border-gold-500/30 hover:shadow-2xl">
        
        {/* AREA GAMBAR (KLIK DISINI UNTUK ZOOM) */}
        <div 
          onClick={() => setIsLightboxOpen(true)}
          className="relative aspect-[4/3] w-full overflow-hidden bg-navy-800 cursor-pointer group-image"
        >
          <Image
            src={images[currentIdx]}
            alt={room.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            // Penting: unoptimized membantu jika domain gambar belum di-whitelist sempurna
            unoptimized 
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Tombol Navigasi Kiri/Kanan (Selalu Muncul) */}
          <div className="absolute inset-0 flex items-center justify-between p-2">
            <button 
              onClick={prevSlide}
              className="rounded-full bg-black/40 p-2 text-white hover:bg-gold-500 hover:text-navy-950 transition backdrop-blur-sm z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextSlide}
              className="rounded-full bg-black/40 p-2 text-white hover:bg-gold-500 hover:text-navy-950 transition backdrop-blur-sm z-10"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Icon Expand di Pojok (Indikator bisa di-klik) */}
          <div className="absolute top-3 right-3 rounded-full bg-black/50 p-2 text-white hover:bg-gold-500 hover:text-navy-950 transition backdrop-blur-md z-10 pointer-events-none">
            <Expand size={16} />
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all shadow-sm ${idx === currentIdx ? "w-6 bg-gold-500" : "w-1.5 bg-white/50"}`} 
              />
            ))}
          </div>
        </div>

        {/* DETAIL INFO KAMAR */}
        <div className="relative p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-white group-hover:text-gold-400 transition">
            {room.name}
          </h3>
          
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-400 border-b border-white/10 pb-4">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-gold-500" />
              <span>{room.capacity}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize className="h-4 w-4 text-gold-500" />
              <span>{room.size}</span>
            </div>
          </div>

          <p className="mt-4 line-clamp-2 text-sm text-gray-400">
            {room.description}
          </p>

          <div className="mt-auto pt-6 flex flex-wrap gap-2">
            {room.amenities.slice(0, 3).map((amenity) => (
              <span key={amenity} className="rounded-full bg-navy-800 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/60">
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
               <span className="rounded-full bg-navy-800 px-3 py-1 text-[10px] font-bold text-white/60">
                 +{room.amenities.length - 3} more
               </span>
            )}
          </div>
        </div>
      </div>

      {/* --- POP-UP LIGHTBOX (FULLSCREEN) --- */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)} // Klik background untuk tutup
        >
          {/* Tombol Close */}
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 z-50 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 hover:rotate-90 transition duration-300"
          >
            <X size={32} />
          </button>

          {/* Container Gambar Besar */}
          <div 
            className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()} // Supaya klik gambar tidak menutup popup
          >
            <Image
              src={images[currentIdx]}
              alt={room.name}
              fill
              className="object-contain"
              unoptimized
              priority
            />
            
            {/* Tombol Navigasi Besar */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-4 text-white hover:bg-gold-500 hover:text-navy-950 transition"
            >
              <ChevronLeft size={40} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-4 text-white hover:bg-gold-500 hover:text-navy-950 transition"
            >
              <ChevronRight size={40} />
            </button>

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8 text-center">
              <h3 className="text-2xl font-bold text-white">{room.name}</h3>
              <p className="text-sm text-gold-400 mt-1">
                Image {currentIdx + 1} of {images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}