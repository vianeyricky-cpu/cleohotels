"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize, Users, BedDouble, ChevronLeft, ChevronRight } from "lucide-react";

export function RoomCarousel({ rooms }: { rooms: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-center py-20 bg-neutral-50 rounded-[2rem] border border-neutral-100">
        <p className="text-neutral-500 text-lg">Kamar untuk hotel ini belum tersedia.</p>
      </div>
    );
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? rooms.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === rooms.length - 1 ? 0 : prev + 1));
  };

  // Mengambil data kamar yang sedang aktif dilihat
  const activeRoom = rooms[currentIndex];

  return (
    <div className="w-full">
      {/* Header & Navigasi Panah */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-2">Rooms</h2>
          <p className="text-neutral-500">Smartly designed spaces for your maximum comfort.</p>
        </div>
        
        {rooms.length > 1 && (
          <div className="flex items-center gap-2">
            <button onClick={handlePrev} className="p-3 rounded-full hover:bg-neutral-100 transition text-neutral-500 hover:text-neutral-900 border border-transparent hover:border-neutral-200">
              <ChevronLeft size={24} />
            </button>
            <button onClick={handleNext} className="p-3 rounded-full hover:bg-neutral-100 transition text-neutral-500 hover:text-neutral-900 border border-transparent hover:border-neutral-200">
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>

      {/* Frame Slider Utama */}
      <div className="relative w-full overflow-hidden rounded-[2rem] shadow-lg bg-neutral-100 mb-6">
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {rooms.map((room) => (
            <div key={room.id} className="relative w-full h-[450px] md:h-[550px] flex-shrink-0 group">
              
              {/* Gambar Utama Kamar */}
              <Image 
                src={room.image || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80"} 
                alt={room.name} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent z-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-0" />

              {/* Konten Teks Kamar */}
              <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-center text-white z-10 w-full md:w-3/4 lg:w-[60%]">
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-md tracking-tight">
                  {room.name}
                </h3>
                <p className="text-white/80 text-base md:text-lg leading-relaxed line-clamp-4 drop-shadow-sm font-medium mb-12 max-w-xl">
                  {room.description || "Enjoy stylish comfort for a relaxing and restful stay."}
                </p>

                {/* Spesifikasi Ikon */}
                <div className="flex flex-wrap items-center gap-6 md:gap-10 text-sm md:text-base font-semibold mt-auto absolute bottom-8 md:bottom-12">
                  {room.size && (
                    <div className="flex items-center gap-3">
                      <Maximize size={22} className="text-white/70" /> 
                      <span>{room.size}</span>
                    </div>
                  )}
                  {room.capacity && (
                    <div className="flex items-center gap-3">
                      <Users size={22} className="text-white/70" /> 
                      <span>{room.capacity}</span>
                    </div>
                  )}
                  {room.bedType && (
                    <div className="flex items-center gap-3">
                      <BedDouble size={22} className="text-white/70" /> 
                      <span>{room.bedType}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Titik Indikator (Dots) */}
      {rooms.length > 1 && (
        <div className="flex items-center justify-center gap-3 mb-8">
          {rooms.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "bg-[#1a56db] w-8" : "bg-neutral-300 hover:bg-neutral-400 w-2"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* --- SUB GALLERY (FOTO TAMBAHAN / THUMBNAILS) --- */}
      {/* Sesuai desain kotak-kotak merah Anda */}
      {activeRoom?.images && activeRoom.images.length > 0 && (
        <div className="w-full mt-4">
          <p className="text-sm font-bold text-neutral-500 mb-3 uppercase tracking-widest">More Views</p>
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {activeRoom.images.map((imgUrl: string, idx: number) => (
              <div 
                key={idx} 
                className="relative w-28 h-24 md:w-36 md:h-28 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-transparent hover:border-[#1a56db] transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <Image 
                  src={imgUrl} 
                  alt={`${activeRoom.name} view ${idx + 1}`} 
                  fill 
                  className="object-cover" 
                />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}