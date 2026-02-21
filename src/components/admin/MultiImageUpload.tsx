"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Upload, X, Loader2, Plus, GripVertical } from "lucide-react";
import Image from "next/image";

interface MultiImageUploadProps {
  urls: string[];
  onChange: (urls: string[]) => void;
  bucket?: string;
}

export function MultiImageUpload({ 
  urls = [], 
  onChange, 
  bucket = "images" 
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Setup Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        newUrls.push(data.publicUrl);
      }

      // Gabungkan URL lama dengan yang baru
      onChange([...urls, ...newUrls]);

    } catch (error: any) {
      alert("Gagal upload: " + error.message);
    } finally {
      setIsUploading(false);
      event.target.value = ""; // Reset input
    }
  };

  const handleRemove = (urlToRemove: string) => {
    onChange(urls.filter((url) => url !== urlToRemove));
  };

  // --- LOGIKA DRAG AND DROP ---
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Wajib agar onDrop bisa berjalan
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null) return;
    
    // Copy array lama
    const newUrls = [...urls];
    // Cabut item yang di-drag
    const draggedItem = newUrls.splice(draggedIndex, 1)[0];
    // Sisipkan item ke posisi yang baru (drop)
    newUrls.splice(index, 0, draggedItem);
    
    onChange(newUrls);
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-bold text-gray-700">Room Gallery (Carousel)</label>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
          Drag images to reorder
        </span>
      </div>
      
      {/* Grid Foto yang sudah ada */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {urls.map((url, index) => (
          <div 
            key={index} 
            draggable // Mengaktifkan fitur drag bawaan HTML
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all group cursor-grab active:cursor-grabbing ${
              draggedIndex === index ? "border-gold-500 opacity-50 scale-95" : "border-gray-200 hover:border-gold-400"
            }`}
          >
            <Image src={url} alt={`Gallery ${index}`} fill className="object-cover" unoptimized/>
            
            {/* Overlay Gradient Hitam untuk tombol */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
               <GripVertical className="text-white h-8 w-8" />
            </div>

            {/* Tombol Hapus */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Mencegah drag terpanggil saat klik hapus
                handleRemove(url);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600 z-10"
            >
              <X size={14} />
            </button>

            {/* Label "Thumbnail" Khusus Gambar Pertama */}
            {index === 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-gold-500 text-navy-950 text-[10px] font-bold text-center py-1 uppercase tracking-wider">
                Main Thumbnail
              </div>
            )}
          </div>
        ))}
        
        {/* Tombol Tambah Foto */}
        <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition">
          {isUploading ? (
            <Loader2 className="animate-spin text-gold-500" />
          ) : (
            <>
              <Plus className="text-gray-400 mb-2 h-8 w-8" />
              <span className="text-xs text-gray-500 font-bold">Add Images</span>
            </>
          )}
          <input 
            type="file" 
            multiple 
            className="hidden" 
            accept="image/*" 
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      </div>
      <p className="text-xs text-gray-400 mt-2">
         * Gambar paling pertama (Thumbnail) akan muncul di halaman depan list kamar.<br/>
         * Tahan dan geser (drag) gambar untuk mengubah urutannya.
      </p>
    </div>
  );
}