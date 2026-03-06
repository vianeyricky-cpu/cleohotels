"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { ImageUpload } from "@/components/admin/ImageUpload";
// Tambahkan ikon Trash
import { Save, Loader2, Megaphone, Download, ArrowUpDown, Trash2 } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PromoAdminPage() {
  const [activeTab, setActiveTab] = useState<"settings" | "leads">("settings");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [promo, setPromo] = useState({ id: null, title: "", description: "", image: "", is_active: false });
  const [leads, setLeads] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchPromo();
    fetchLeads();
  }, [sortOrder]);

  const fetchPromo = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from("PromoPopup").select("*").limit(1).maybeSingle();
      if (data) setPromo(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    const { data } = await supabase.from("PromoLeads").select("*").order("created_at", { ascending: sortOrder === "asc" });
    if (data) setLeads(data);
  };

  // --- FUNGSI HAPUS DATA USER ---
  const handleDeleteLead = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini secara permanen?")) return;

    const { error } = await supabase.from("PromoLeads").delete().eq("id", id);
    
    if (error) {
      alert("Gagal menghapus data: " + error.message);
    } else {
      // Refresh data di layar
      setLeads(leads.filter(lead => lead.id !== id));
    }
  };

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (promo.id) {
        const { error } = await supabase.from("PromoPopup").update({
          title: promo.title, description: promo.description, image: promo.image, is_active: promo.is_active
        }).eq("id", promo.id);
        if (error) throw error;
        alert("Promo Popup berhasil diperbarui!");
      } else {
        const { data, error } = await supabase.from("PromoPopup").insert([{
          title: promo.title, description: promo.description, image: promo.image, is_active: promo.is_active
        }]).select();
        if (error) throw error;
        alert("Promo Popup baru berhasil dibuat!");
        if (data && data.length > 0) setPromo(data[0]);
      }
    } catch (err: any) {
      alert("GAGAL MENYIMPAN! Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const exportToCSV = () => {
    if (leads.length === 0) return alert("Belum ada data untuk diexport!");
    const headers = ["Tanggal", "Email", "WhatsApp"];
    const csvContent = [
      headers.join(","), 
      ...leads.map(row => `"${new Date(row.created_at).toLocaleString('id-ID')}","${row.email}","${row.whatsapp}"`)
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.setAttribute("download", `Data_Promo_Cleo.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  if (loading) return <div className="p-8 font-bold flex items-center justify-center gap-2 text-[#1a56db]"><Loader2 className="animate-spin text-[#1a56db]"/> Membuka Koneksi Supabase...</div>;

  return (
    <div className="w-full">
      <div className="max-w-5xl py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-orange-100 text-[#f05136] rounded-xl"><Megaphone size={24} /></div>
          <div><h1 className="text-3xl font-extrabold text-neutral-900">Promo & Leads</h1><p className="text-neutral-500">Kelola popup website dan data kontak pengunjung.</p></div>
        </div>

        <div className="flex gap-4 border-b border-neutral-200 mb-8">
          <button onClick={() => setActiveTab("settings")} className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors ${activeTab === "settings" ? "border-[#1a56db] text-[#1a56db]" : "border-transparent text-neutral-500 hover:text-neutral-800"}`}>Pengaturan Popup</button>
          <button onClick={() => setActiveTab("leads")} className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors ${activeTab === "leads" ? "border-[#1a56db] text-[#1a56db]" : "border-transparent text-neutral-500 hover:text-neutral-800"}`}>
            Data User <span className="ml-2 bg-neutral-100 py-0.5 px-2 rounded-full text-xs">{leads.length}</span>
          </button>
        </div>

        {/* TAB 1: PENGATURAN */}
        {activeTab === "settings" && (
          <form onSubmit={handleSavePromo} className="bg-white p-6 md:p-8 rounded-[2rem] border border-neutral-200 shadow-sm space-y-6 animate-fade-in">
            {/* ... Form pengaturan (sama seperti sebelumnya) ... */}
            <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-xl border border-neutral-100">
              <div><p className="font-bold text-neutral-900">Status Popup Promo</p><p className="text-sm text-neutral-500">Tampilkan di Homepage agar tamu bisa mengisi form.</p></div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={promo.is_active} onChange={(e) => setPromo({...promo, is_active: e.target.checked})} />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#1a56db]"></div>
              </label>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-bold text-neutral-700 mb-1">Judul Promo</label><input required type="text" value={promo.title} onChange={(e) => setPromo({...promo, title: e.target.value})} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a56db]" /></div>
              <div><label className="block text-sm font-bold text-neutral-700 mb-1">Deskripsi & Instruksi</label><textarea required rows={3} value={promo.description} onChange={(e) => setPromo({...promo, description: e.target.value})} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a56db]"></textarea></div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Gambar Header Popup</label>
                <ImageUpload value={promo.image} onChange={(url: string) => setPromo({...promo, image: url})} />
              </div>
            </div>
            <button type="submit" disabled={saving} className="flex items-center justify-center gap-2 w-full bg-[#1a56db] text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-800 transition disabled:opacity-50">
              {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />} {saving ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
          </form>
        )}

        {/* TAB 2: DATA LEADS (DENGAN TOMBOL HAPUS) */}
        {activeTab === "leads" && (
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-neutral-200 shadow-sm animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Terkumpul {leads.length} Data</h3>
              <div className="flex gap-2">
                <button onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")} className="flex items-center gap-2 bg-neutral-100 px-4 py-2 rounded-lg text-sm font-bold text-neutral-700 hover:bg-neutral-200 transition">
                  <ArrowUpDown size={16} /> Urutkan
                </button>
                <button onClick={exportToCSV} className="flex items-center gap-2 bg-[#10b981] px-4 py-2 rounded-lg text-sm font-bold text-white hover:bg-emerald-600 transition shadow-md shadow-emerald-500/20">
                  <Download size={16} /> Export CSV
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-neutral-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider">
                  <tr>
                    <th className="p-4 font-bold">Tanggal Masuk</th>
                    <th className="p-4 font-bold">Alamat Email</th>
                    <th className="p-4 font-bold">Nomor WhatsApp</th>
                    <th className="p-4 font-bold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-neutral-400 italic">Belum ada data yang masuk.</td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead.id} className="border-t border-neutral-100 hover:bg-red-50/30 transition-colors group">
                        <td className="p-4 font-medium text-neutral-900">
                          {new Date(lead.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-4 text-[#1a56db] font-medium">{lead.email}</td>
                        <td className="p-4 font-mono text-neutral-600">{lead.whatsapp}</td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all"
                            title="Hapus Data"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}