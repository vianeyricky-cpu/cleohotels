"use client";

import { useState, useEffect } from "react";
// 1. KITA IMPORT CREATECLIENT SEPERTI HALAMAN YANG LANCAR
import { createClient } from "@supabase/supabase-js"; 
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Save, Loader2, Settings as SettingsIcon, Image as ImageIcon, AlertCircle } from "lucide-react";

// 2. KITA BUAT KONEKSINYA LANGSUNG DI SINI
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SettingsPage() {
  const [heroImage, setHeroImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "hero_image")
        .maybeSingle();

      if (error) throw error;
      if (data) setHeroImage(data.value);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Gagal menarik data dari Supabase.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from("settings")
        .upsert({ key: "hero_image", value: heroImage }, { onConflict: 'key' });
        
      if (error) throw error;
      alert("Gambar Hero berhasil diperbarui! Silakan cek Homepage.");
    } catch (err: any) {
      alert("GAGAL MENYIMPAN: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-4xl py-8">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-neutral-100 text-[#1a56db] rounded-xl">
            <SettingsIcon size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-neutral-900">Hero Homepage</h1>
            <p className="text-neutral-500">Atur gambar banner utama yang tampil di halaman depan website.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">Error: {errorMsg}</p>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-[#1a56db] font-bold flex items-center justify-center gap-2">
            <Loader2 size={24} className="animate-spin" /> Membuka Koneksi Supabase...
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-neutral-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-neutral-100 pb-4">
                <ImageIcon className="text-[#1a56db]" size={20} />
                <h2 className="text-xl font-bold text-neutral-900">Homepage Hero Image</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-neutral-500 mb-4 leading-relaxed">
                  Gunakan gambar landscape beresolusi tinggi (rekomendasi: <strong>1920x1080px</strong>).
                </p>
                <ImageUpload value={heroImage} onChange={(url: string) => setHeroImage(url)} />
                
                <div className="mt-4 pt-4 border-t border-neutral-100">
                  <label className="block text-xs font-bold text-neutral-500 mb-2 uppercase tracking-wider">
                    Atau Paste Link URL Gambar Langsung
                  </label>
                  <input 
                    type="text" 
                    value={heroImage} 
                    onChange={(e) => setHeroImage(e.target.value)} 
                    placeholder="https://images.unsplash.com/..." 
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#1a56db] outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" disabled={saving || !heroImage} className="flex items-center justify-center gap-2 bg-[#1a56db] text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-800 transition disabled:opacity-50">
                {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}