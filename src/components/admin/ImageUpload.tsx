"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  bucket?: string;
}

export function ImageUpload({ 
  value, 
  onChange, 
  label = "Upload Image", 
  bucket = "images" 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  // 1. Cek Apakah Env Variable Terbaca
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ FATAL: Env Variable Database tidak ditemukan di browser!");
  }

  const supabase = createClient(supabaseUrl!, supabaseKey!);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      console.log("🚀 Memulai upload file:", file.name);
      setIsUploading(true);

      // 2. Buat nama file unik
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log("📂 Target Bucket:", bucket);
      console.log("📄 Target Path:", filePath);

      // 3. Proses Upload
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("❌ Error dari Database:", uploadError);
        throw new Error(uploadError.message);
      }

      console.log("✅ Upload Berhasil, Data:", data);

      // 4. Ambil URL Publik
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      console.log("🔗 Public URL:", publicUrlData.publicUrl);

      // 5. Simpan ke State Form
      onChange(publicUrlData.publicUrl);

    } catch (error: any) {
      console.error("🔥 Error Catch:", error);
      alert(`Gagal Upload: ${error.message}`);
    } finally {
      setIsUploading(false);
      // Reset input value agar bisa upload file yang sama jika gagal lalu mencoba lagi
      event.target.value = ""; 
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      
      {/* Jika Env Var Error, Tampilkan Pesan Merah */}
      {(!supabaseUrl || !supabaseKey) && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 text-xs rounded-lg">
          ERROR: FILE .ENV TIDAK TERBACA. Pastikan ada NEXT_PUBLIC_SUPABASE_URL.
        </div>
      )}

      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 group">
          <Image 
            src={value} 
            alt="Uploaded image" 
            fill 
            className="object-cover" 
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
              title="Remove Image"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center justify-center">
          <label className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition relative">
            
            {/* INPUT FILE YANG SEBENARNYA */}
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              accept="image/png, image/jpeg, image/jpg, image/webp" 
              onChange={handleUpload}
              disabled={isUploading} 
            />

            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              {isUploading ? (
                <>
                  <Loader2 className="mb-4 h-10 w-10 animate-spin text-gold-500" />
                  <p className="text-sm text-gray-500">Uploading ke Database...</p>
                </>
              ) : (
                <>
                  <Upload className="mb-4 h-10 w-10 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 font-bold">Click to upload</p>
                  <p className="text-xs text-gray-500">PNG, JPG or WebP (Max 5MB)</p>
                </>
              )}
            </div>
          </label>
        </div>
      )}
    </div>
  );
}