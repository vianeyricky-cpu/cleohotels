"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface RoomFormProps {
  hotelId: string;
  room?: any;
  isNew: boolean;
}

export default function RoomForm({ hotelId, room, isNew }: RoomFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: room?.name || "",
    description: room?.description || "",
    size: room?.size || "24 SQM",
    capacity: room?.capacity || "2 Adults",
    bedType: room?.bedType || "Double/Twin",
    image: room?.image || "",
    amenities: room?.amenities ? room.amenities.join(", ") : "Free WiFi, AC, TV",
    price: room?.price || "0",
  });

  // State khusus untuk array foto-foto tambahan (Sub Gallery)
  const [extraImages, setExtraImages] = useState<string[]>(room?.images || []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi untuk menambah kotak upload foto baru
  const addExtraImageField = () => {
    setExtraImages([...extraImages, ""]);
  };

  // Fungsi untuk update foto tambahan pada index tertentu
  const updateExtraImage = (url: string, index: number) => {
    const updated = [...extraImages];
    updated[index] = url;
    setExtraImages(updated);
  };

  // Fungsi untuk menghapus foto tambahan
  const removeExtraImage = (index: number) => {
    const updated = extraImages.filter((_, i) => i !== index);
    setExtraImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const amenitiesArray = formData.amenities
      .split(",")
      .map((item: string) => item.trim())
      .filter((item: string) => item !== "");

    // Bersihkan array foto tambahan dari yang kosong
    const cleanExtraImages = extraImages.filter((img) => img.trim() !== "");

    const payload = {
      hotelId: hotelId,
      name: formData.name,
      description: formData.description,
      size: formData.size,
      capacity: formData.capacity,
      bedType: formData.bedType,
      image: formData.image,
      images: cleanExtraImages, // <-- Masukkan array foto tambahan ke database
      amenities: amenitiesArray,
      price: formData.price,
    };

    let error;

    if (isNew) {
      const { error: insertError } = await supabase.from("Room").insert([payload]);
      error = insertError;
    } else {
      const { error: updateError } = await supabase.from("Room").update(payload).eq("id", room.id);
      error = updateError;
    }

    setLoading(false);

    if (error) {
      console.error("Error saving room:", error);
      alert("Gagal menyimpan data kamar. Cek console log.");
    } else {
      alert("Kamar berhasil disimpan!");
      router.refresh();
      router.back();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-[2rem] border border-neutral-200 shadow-sm space-y-6">
      
      {/* 1. Nama & Deskripsi */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-1">Nama Kamar</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#1a56db] outline-none transition" placeholder="Contoh: Biz Room" />
        </div>
        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-1">Deskripsi Kamar</label>
          <textarea required name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#1a56db] outline-none transition" placeholder="Deskripsi kamar..."></textarea>
        </div>
      </div>

      <hr className="border-neutral-100" />

      {/* 2. Spesifikasi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-1">Luas Kamar (Size)</label>
          <input type="text" name="size" value={formData.size} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl" placeholder="15 m²" />
        </div>
        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-1">Kapasitas</label>
          <input type="text" name="capacity" value={formData.capacity} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl" placeholder="2 Adults" />
        </div>
        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-1">Tipe Kasur</label>
          <input type="text" name="bedType" value={formData.bedType} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl" placeholder="Double/Twin" />
        </div>
      </div>

      <hr className="border-neutral-100" />

      {/* 3. Foto Utama & Fasilitas */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-1">Fasilitas (Pisahkan koma)</label>
          <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl" placeholder="WiFi, AC, Smart TV" />
        </div>
        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-2">Foto Utama Kamar (Tampil paling besar)</label>
          <ImageUpload value={formData.image} onChange={(url: string) => setFormData({ ...formData, image: url })} />
        </div>
      </div>

      <hr className="border-neutral-100" />

      {/* 4. GALERI TAMBAHAN (SUDUT LAIN / KAMAR MANDI) */}
      <div className="space-y-4 bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
        <div className="flex items-center justify-between mb-2">
          <div>
            <label className="block text-sm font-bold text-neutral-700">Foto Tambahan Kamar</label>
            <p className="text-xs text-neutral-500">Tampil sebagai kotak kecil di bawah gambar utama (kamar mandi, sudut lain).</p>
          </div>
          <button type="button" onClick={addExtraImageField} className="flex items-center gap-1 bg-white border border-neutral-300 px-3 py-1.5 rounded-lg text-sm font-bold text-neutral-700 hover:bg-neutral-100">
            <Plus size={16} /> Tambah Foto
          </button>
        </div>

        {extraImages.length === 0 ? (
          <p className="text-sm text-neutral-400 italic">Belum ada foto tambahan.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {extraImages.map((imgUrl, index) => (
              <div key={index} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-neutral-200 shadow-sm">
                <div className="flex-1">
                  {/* Gunakan ImageUpload untuk mempermudah, atau bisa input URL manual */}
                  <ImageUpload value={imgUrl} onChange={(url: string) => updateExtraImage(url, index)} />
                </div>
                <button type="button" onClick={() => removeExtraImage(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Hapus foto ini">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 flex-1 bg-[#1a56db] text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-800 transition disabled:opacity-50">
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          {loading ? "Menyimpan..." : "Simpan Kamar"}
        </button>
        <button type="button" onClick={() => router.back()} className="flex-1 bg-neutral-100 text-neutral-700 px-6 py-4 rounded-xl font-bold hover:bg-neutral-200 transition">
          Batal
        </button>
      </div>
    </form>
  );
}