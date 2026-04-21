"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr"; 
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/admin/ImageUpload"; 
import { MultiImageUpload } from "@/components/admin/MultiImageUpload"; 

type HotelData = {
  id: string;
  slug: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  image_url: string;
  maps_url: string;
  google_maps_link: string;
  images?: string[]; 
};

export function EditHotelForm({ hotel }: { hotel: HotelData }) {
  // Gunakan createBrowserClient dari @supabase/ssr
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: hotel.name || "",
    description: hotel.description || "",
    address: hotel.address || "",
    phone: hotel.phone || "",
    image_url: hotel.image_url || "",
    maps_url: hotel.maps_url || "",
    google_maps_link: hotel.google_maps_link || "",
    images: hotel.images || [], 
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Generate slug baru dari input nama
      // Mengubah "Cleo Hotel Balaikota" menjadi "cleo-hotel-balaikota"
      const newSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      // 2. Gabungkan formData dengan slug yang baru
      const dataToUpdate = { ...formData, slug: newSlug };

      const { error } = await supabase
        .from("Hotel")
        .update(dataToUpdate)
        .eq("id", hotel.id);

      if (!error) {
        alert("✅ Berhasil! Data hotel tersimpan.");
        
        // 3. Cek apakah slug berubah. Jika iya, redirect ke halaman baru. Jika tidak, cukup refresh.
        if (newSlug !== hotel.slug) {
          router.push(`/admin/hotels/${newSlug}`);
        } else {
          router.refresh(); 
        }
      } else {
        alert("❌ Gagal: " + error.message);
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/hotels" className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition shadow-sm">
            <ArrowLeft size={20} className="text-gray-600"/>
          </Link>
          <div>
             <h1 className="text-2xl font-bold text-navy-950">Edit Hotel</h1>
             <p className="text-sm text-gray-500">Editing: {hotel.name}</p>
          </div>
        </div>
        <Link href={`/en/hotels/${hotel.slug}`} target="_blank" className="flex items-center gap-2 text-sm text-gold-500 font-bold hover:underline">
           <ExternalLink size={16}/> View Live Page
        </Link>
      </div>

      <form onSubmit={handleUpdate} className="space-y-8 animate-fade-in-up">
        
        {/* --- SECTION 1: INFO UTAMA --- */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-navy-950 mb-6 border-b pb-4 flex items-center gap-2">
             <span className="w-2 h-6 bg-gold-500 rounded-full"></span> Basic Information
          </h3>
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Hotel Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea 
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* --- SECTION 2: KONTAK & LOKASI --- */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-navy-950 mb-6 border-b pb-4 flex items-center gap-2">
             <span className="w-2 h-6 bg-gold-500 rounded-full"></span> Location & Contact
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Address</label>
              <input 
                type="text" 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Google Travel Link</label>
               <input 
                type="text" 
                value={formData.google_maps_link}
                onChange={(e) => setFormData({...formData, google_maps_link: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none text-xs font-mono text-gray-600"
               />
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-bold text-gray-700 mb-2">Maps Embed URL (Iframe Src)</label>
               <input 
                type="text" 
                value={formData.maps_url}
                onChange={(e) => setFormData({...formData, maps_url: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none text-xs font-mono text-gray-600"
               />
            </div>
          </div>
        </div>

        {/* --- SECTION 3: GAMBAR UTAMA --- */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-navy-950 mb-6 border-b pb-4 flex items-center gap-2">
             <span className="w-2 h-6 bg-gold-500 rounded-full"></span> Hero Image
          </h3>
          <div className="w-full">
            <ImageUpload 
              value={formData.image_url} 
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              label="Upload Hotel Main Image"
            />
            <p className="mt-2 text-xs text-gray-400">
              Recommended size: 1920x1080px (Landscape). Max 5MB.
            </p>
          </div>
        </div>

        {/* --- SECTION 4: THE EXPERIENCE (GALLERY) --- */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-navy-950 mb-6 border-b pb-4 flex items-center gap-2">
             <span className="w-2 h-6 bg-gold-500 rounded-full"></span> The Experience (Gallery)
          </h3>
          <div className="w-full">
          <MultiImageUpload 
            urls={formData.images || []} 
            onChange={(urls) => setFormData({ ...formData, images: urls })}
          />
            <p className="mt-2 text-xs text-gray-400">
              Upload foto-foto untuk bagian The Experience. Foto-foto ini akan tampil berjejer di halaman utama hotel.
            </p>
          </div>
        </div>

        {/* --- TOMBOL SAVE --- */}
        <div className="flex justify-end pt-4 pb-12">
          <button 
            type="submit" 
            disabled={isLoading}
            className="flex items-center gap-3 px-10 py-4 bg-navy-950 text-white font-bold rounded-xl hover:bg-gold-500 hover:text-navy-950 transition-all shadow-lg hover:shadow-gold-500/20 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </form>
    </div>
  );
}