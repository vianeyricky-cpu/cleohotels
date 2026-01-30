"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Upload, X, Loader2, Plus } from "lucide-react";
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

  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-gray-700">Room Gallery (Carousel)</label>
      
      {/* Grid Foto yang sudah ada */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {urls.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
            <Image src={url} alt="Gallery" fill className="object-cover" unoptimized/>
            <button
              type="button"
              onClick={() => handleRemove(url)}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {/* Tombol Tambah Foto */}
        <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition">
          {isUploading ? (
            <Loader2 className="animate-spin text-gold-500" />
          ) : (
            <>
              <Plus className="text-gray-400 mb-2" />
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
    </div>
  );
}