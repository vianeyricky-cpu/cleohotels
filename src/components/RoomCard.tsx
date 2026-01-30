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
  Expand,
  Bed
} from "lucide-react";

// --- GAMBAR CADANGAN ---
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop",
];

export function RoomCard({ room }: { room: Room }) {
  // 1. FILTER URL GAMBAR
  const isValidUrl = room.image && (room.image.startsWith("http") || room.image.startsWith("https"));
  
  const galleryImages = room.images && room.images.length > 0 ? room.images : [];
  const mainImage = isValidUrl ? [room.image!] : [];
  
  const combinedImages = [...mainImage, ...galleryImages];
  const images = combinedImages.length > 0 ? combinedImages : DEFAULT_IMAGES;
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // --- PERBAIKAN LOGIC AMENITIES (ANTI-CRASH) ---
  // Kita buat fungsi helper kecil untuk menangani berbagai tipe data
  const getAmenitiesList = (data: any) => {
    if (!data) return []; // Jika null/undefined
    if (Array.isArray(data)) return data; // Jika sudah Array (Data lama)
    if (typeof data === 'string') {
      // Jika String (Data baru), kita split koma
      return data.split(',').map(item => item.trim()).filter(item => item !== "");
    }
    return []; // Fallback aman
  };

  const amenitiesList = getAmenitiesList(room.amenities);

  // Navigasi Slide
  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Format Harga Rupiah
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(room.price || 0);

  return (
    <>
      {/* --- KARTU UTAMA --- */}
      <div className="group relative overflow-hidden rounded-xl bg-navy-950 border border-white/5 transition flex flex-col h-full hover:border-gold-500/30 hover:shadow-2xl">
        
        {/* AREA GAMBAR */}
        <div 
          onClick={() => setIsLightboxOpen(true)}
          className="relative aspect-[4/3] w-full overflow-hidden bg-navy-800 cursor-pointer group-image"
        >
          <Image
            src={images[currentIdx]}
            alt={room.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized 
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent opacity-80 pointer-events-none" />

          {/* HARGA */}
          <div className="absolute top-3 left-3 rounded-md bg-navy-900/80 backdrop-blur px-3 py-1.5 border border-white/10 z-10">
             <span className="text-sm font-bold text-gold-400">{formattedPrice}</span>
             <span className="text-[10px] text-white/60"> /night</span>
          </div>

          {/* Tombol Navigasi */}
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={prevSlide}
              className="rounded-full bg-black/40 p-2 text-white hover:bg-gold-500 hover:text-navy-950 transition backdrop-blur-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextSlide}
              className="rounded-full bg-black/40 p-2 text-white hover:bg-gold-500 hover:text-navy-950 transition backdrop-blur-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="absolute top-3 right-3 rounded-full bg-black/50 p-2 text-white hover:bg-gold-500 hover:text-navy-950 transition backdrop-blur-md z-10 pointer-events-none">
            <Expand size={16} />
          </div>

          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
            {images.slice(0, 5).map((_, idx) => ( 
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
          
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-400 border-b border-white/10 pb-4">
            <div className="flex items-center gap-1.5" title="Capacity">
              <Users className="h-4 w-4 text-gold-500" />
              <span>{room.capacity} Pax</span>
            </div>
            <div className="flex items-center gap-1.5" title="Room Size">
              <Maximize className="h-4 w-4 text-gold-500" />
              <span>{room.size} m²</span>
            </div>
            <div className="flex items-center gap-1.5" title="Bed Type">
              <Bed className="h-4 w-4 text-gold-500" />
              <span>{room.bedType || "King Bed"}</span>
            </div>
          </div>

          <p className="mt-4 line-clamp-2 text-sm text-gray-400">
            {room.description}
          </p>

          <div className="mt-auto pt-6 flex flex-wrap gap-2">
            {/* Logic Render Amenities yang sudah aman */}
            {amenitiesList.length > 0 ? (
                amenitiesList.slice(0, 3).map((amenity: string, index: number) => (
                <span key={index} className="rounded-full bg-navy-800 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/60 border border-white/5">
                    {amenity}
                </span>
                ))
            ) : (
                <span className="text-[10px] text-gray-500 italic">No amenities info</span>
            )}
            
            {amenitiesList.length > 3 && (
                <span className="rounded-full bg-navy-800 px-3 py-1 text-[10px] font-bold text-white/60 border border-white/5">
                  +{amenitiesList.length - 3} more
                </span>
            )}
          </div>
        </div>
      </div>

      {/* --- POP-UP LIGHTBOX --- */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)} 
        >
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 z-50 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 hover:rotate-90 transition duration-300"
          >
            <X size={32} />
          </button>

          <div 
            className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()} 
          >
            <Image
              src={images[currentIdx]}
              alt={room.name}
              fill
              className="object-contain"
              unoptimized
              priority
            />
            
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

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8 text-center">
              <h3 className="text-2xl font-bold text-white">{room.name}</h3>
              <p className="text-xl font-medium text-gold-400 mt-1">{formattedPrice}</p>
              <p className="text-sm text-gray-400 mt-1">
                Image {currentIdx + 1} of {images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}