"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export function FacilityGallery({ facilities }: { facilities: any[] }) {
  // State untuk menyimpan URL gambar yang sedang di-klik (diperbesar)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!facilities || facilities.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 border-dashed">
        <p className="text-neutral-500">Fasilitas untuk hotel ini belum ditambahkan.</p>
      </div>
    );
  }

  return (
    <>
      {/* --- MODAL LIGHTBOX (POPUP GAMBAR BESAR) --- */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)} // Tutup jika background gelap diklik
        >
          {/* Tombol Close (X) */}
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 md:top-10 md:right-10 text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-10"
          >
            <X size={32} />
          </button>
          
          {/* Container Gambar Besar */}
          <div 
            className="relative w-full max-w-6xl h-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup jika gambarnya yang diklik
          >
            <Image 
              src={selectedImage} 
              alt="Enlarged Facility" 
              fill 
              className="object-contain" 
              priority
            />
          </div>
        </div>
      )}

      {/* --- FACILITY GRID --- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {facilities.map((facility) => (
          <div key={facility.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-neutral-200 group flex flex-col hover:shadow-xl transition-all duration-300">
            
            {/* Gambar Utama Fasilitas (Bisa Diklik) */}
            <div 
              className="relative h-56 w-full overflow-hidden bg-neutral-100 shrink-0 cursor-pointer"
              onClick={() => setSelectedImage(facility.image || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80")}
            >
              <Image 
                src={facility.image || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80"} 
                alt={facility.name} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Badge Tipe Fasilitas */}
              {facility.type && (
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold text-[#1a56db] uppercase tracking-widest shadow-sm z-10">
                  {facility.type}
                </div>
              )}
            </div>

            {/* Konten & Thumbnails */}
            <div className="p-6 md:p-8 flex flex-col flex-1">
              
              {/* Deretan Foto Tambahan / Thumbnails (Bisa Diklik) */}
              {facility.images && facility.images.length > 0 && (
                <div className="flex gap-2 mb-5 overflow-x-auto pb-2 custom-scrollbar">
                  {facility.images.map((imgUrl: string, idx: number) => (
                    <div 
                      key={idx} 
                      className="relative w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden shrink-0 border border-neutral-200 shadow-sm cursor-pointer"
                      onClick={() => setSelectedImage(imgUrl)}
                    >
                      <Image 
                        src={imgUrl} 
                        alt={`${facility.name} view ${idx + 1}`} 
                        fill 
                        className="object-cover hover:scale-110 transition-transform duration-300" 
                      />
                    </div>
                  ))}
                </div>
              )}

              <h3 className="text-xl font-bold text-neutral-900 mb-3">{facility.name}</h3>
              <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3">
                {facility.description}
              </p>
            </div>

          </div>
        ))}
      </div>
    </>
  );
}