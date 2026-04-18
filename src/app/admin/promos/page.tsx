"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Save, Loader2, Megaphone, Download, ArrowUpDown, Trash2, Plus, Edit, Tag } from "lucide-react";

export default function PromoAdminPage() {
  // Inisialisasi Supabase menggunakan createBrowserClient agar sesi Admin terbaca
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [activeTab, setActiveTab] = useState<"settings" | "leads" | "offers">("settings");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State Popup & Leads
  const [promo, setPromo] = useState({ id: null, title: "", description: "", image: "", is_active: false });
  const [leads, setLeads] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // State Offers & Packages (Homepage Promo Cards)
  const [offers, setOffers] = useState<any[]>([]);
  const [isEditingOffer, setIsEditingOffer] = useState(false);
  const [offerForm, setOfferForm] = useState({ id: "", title: "", description: "", image_url: "", action_text: "SEE MORE", action_link: "" });

  useEffect(() => {
    fetchPromo();
    fetchLeads();
    fetchOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOrder]);

  // --- FETCHING DATA ---
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

  const fetchOffers = async () => {
    const { data } = await supabase.from("promos").select("*").order("created_at", { ascending: false });
    if (data) setOffers(data);
  };

  // --- HANDLER POPUP & LEADS ---
  const handleDeleteLead = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini secara permanen?")) return;
    const { error } = await supabase.from("PromoLeads").delete().eq("id", id);
    if (error) {
      alert("Gagal menghapus data: " + error.message);
    } else {
      setLeads(leads.filter(lead => lead.id !== id));
    }
  };

  const handleSavePromoPopup = async (e: React.FormEvent) => {
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

  // --- HANDLER OFFERS & PACKAGES ---
  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let errorResponse;
      if (offerForm.id) {
        const { error } = await supabase.from("promos").update({
          title: offerForm.title, description: offerForm.description, image_url: offerForm.image_url,
          action_text: offerForm.action_text, action_link: offerForm.action_link
        }).eq("id", offerForm.id);
        errorResponse = error;
      } else {
        const { error } = await supabase.from("promos").insert([{
          title: offerForm.title, description: offerForm.description, image_url: offerForm.image_url,
          action_text: offerForm.action_text, action_link: offerForm.action_link
        }]);
        errorResponse = error;
      }

      if (errorResponse) throw errorResponse;

      alert("✅ Berhasil! Data promo telah tersimpan.");
      setIsEditingOffer(false);
      setOfferForm({ id: "", title: "", description: "", image_url: "", action_text: "SEE MORE", action_link: "" });
      fetchOffers();
    } catch (err: any) {
      alert("❌ Gagal menyimpan: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (confirm("Hapus promo/paket ini?")) {
      const { error } = await supabase.from("promos").delete().eq("id", id);
      if (error) {
        alert("Gagal menghapus promo: " + error.message);
      } else {
        fetchOffers();
      }
    }
  };

  if (loading) return <div className="p-8 font-bold flex items-center justify-center gap-2 text-[#1a56db]"><Loader2 className="animate-spin text-[#1a56db]"/> Membuka Koneksi Supabase...</div>;

  return (
    <div className="w-full">
      <div className="max-w-6xl py-8 px-4 md:px-0">
        
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-100 text-[#1a56db] rounded-xl"><Megaphone size={24} /></div>
          <div>
            <h1 className="text-3xl font-extrabold text-neutral-900">Promo & Leads</h1>
            <p className="text-neutral-500">Kelola popup website, data kontak pengunjung, dan katalog promo homepage.</p>
          </div>
        </div>

        {/* TABS MENU */}
        <div className="flex gap-4 border-b border-neutral-200 mb-8 overflow-x-auto whitespace-nowrap">
          <button onClick={() => setActiveTab("settings")} className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors ${activeTab === "settings" ? "border-[#1a56db] text-[#1a56db]" : "border-transparent text-neutral-500 hover:text-neutral-800"}`}>Pengaturan Popup</button>
          <button onClick={() => setActiveTab("offers")} className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === "offers" ? "border-[#1a56db] text-[#1a56db]" : "border-transparent text-neutral-500 hover:text-neutral-800"}`}>
            Offers & Packages
          </button>
          <button onClick={() => setActiveTab("leads")} className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors ${activeTab === "leads" ? "border-[#1a56db] text-[#1a56db]" : "border-transparent text-neutral-500 hover:text-neutral-800"}`}>
            Data User <span className="ml-2 bg-neutral-100 text-neutral-600 py-0.5 px-2 rounded-full text-xs">{leads.length}</span>
          </button>
        </div>

        {/* --- TAB 1: PENGATURAN POPUP --- */}
        {activeTab === "settings" && (
          <form onSubmit={handleSavePromoPopup} className="bg-white p-6 md:p-8 rounded-[2rem] border border-neutral-200 shadow-sm space-y-6 animate-fade-in max-w-3xl">
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

        {/* --- TAB 2: OFFERS & PACKAGES --- */}
        {activeTab === "offers" && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-neutral-800">Manajemen Katalog Promo</h2>
              {!isEditingOffer && (
                <button onClick={() => setIsEditingOffer(true)} className="bg-[#1a56db] text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-800 transition">
                  <Plus size={18} /> Tambah Promo Baru
                </button>
              )}
            </div>

            {isEditingOffer ? (
              <form onSubmit={handleSaveOffer} className="bg-white p-6 md:p-8 rounded-[2rem] border border-neutral-200 shadow-sm space-y-5 max-w-3xl">
                <h3 className="text-lg font-bold border-b pb-3">{offerForm.id ? "Edit Promo" : "Tambah Promo Baru"}</h3>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">Judul Promo</label>
                  <input required type="text" value={offerForm.title} onChange={(e) => setOfferForm({...offerForm, title: e.target.value})} className="w-full border border-neutral-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1a56db] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">Deskripsi Singkat</label>
                  <textarea required rows={3} value={offerForm.description} onChange={(e) => setOfferForm({...offerForm, description: e.target.value})} className="w-full border border-neutral-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1a56db] outline-none"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">Upload Gambar Promo (Landscape)</label>
                  <ImageUpload value={offerForm.image_url} onChange={(url: string) => setOfferForm({...offerForm, image_url: url})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Teks Tombol</label>
                    <select value={offerForm.action_text} onChange={(e) => setOfferForm({...offerForm, action_text: e.target.value})} className="w-full border border-neutral-300 p-3 rounded-lg bg-white">
                      <option value="SEE MORE">SEE MORE</option>
                      <option value="BOOK NOW">BOOK NOW</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Link Tujuan URL</label>
                    <input type="text" value={offerForm.action_link} onChange={(e) => setOfferForm({...offerForm, action_link: e.target.value})} className="w-full border border-neutral-300 p-3 rounded-lg" placeholder="https://..." />
                  </div>
                </div>
                <div className="flex gap-3 pt-5 border-t">
                  <button type="submit" disabled={saving} className="bg-[#1a56db] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-800">{saving ? "Menyimpan..." : "Simpan Promo"}</button>
                  <button type="button" onClick={() => { setIsEditingOffer(false); setOfferForm({ id: "", title: "", description: "", image_url: "", action_text: "SEE MORE", action_link: "" }); }} className="bg-neutral-100 text-neutral-700 px-8 py-2.5 rounded-lg font-bold hover:bg-neutral-200">Batal</button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.length === 0 ? (
                  <p className="col-span-3 text-neutral-500 italic p-6 bg-white rounded-xl border">Belum ada promo yang ditambahkan.</p>
                ) : (
                  offers.map((offer) => (
                    <div key={offer.id} className="bg-white rounded-[1.5rem] border border-neutral-200 overflow-hidden shadow-sm flex flex-col">
                      <div className="h-40 w-full relative bg-neutral-100">
                        {offer.image_url && <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover" />}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-bold text-lg mb-2 text-neutral-900 line-clamp-1">{offer.title}</h3>
                        <p className="text-sm text-neutral-500 mb-4 line-clamp-2 flex-1">{offer.description}</p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100">
                          <span className="text-xs font-bold bg-blue-50 text-[#1a56db] px-3 py-1 rounded-full">{offer.action_text}</span>
                          <div className="flex gap-2">
                            <button onClick={() => { setOfferForm(offer); setIsEditingOffer(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                            <button onClick={() => handleDeleteOffer(offer.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* --- TAB 3: DATA LEADS USER --- */}
        {activeTab === "leads" && (
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-neutral-200 shadow-sm animate-fade-in">
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
                    <tr><td colSpan={4} className="p-8 text-center text-neutral-400 italic">Belum ada data yang masuk.</td></tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead.id} className="border-t border-neutral-100 hover:bg-red-50/30 transition-colors group">
                        <td className="p-4 font-medium text-neutral-900">
                          {new Date(lead.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-4 text-[#1a56db] font-medium">{lead.email}</td>
                        <td className="p-4 font-mono text-neutral-600">{lead.whatsapp}</td>
                        <td className="p-4 text-center">
                          <button onClick={() => handleDeleteLead(lead.id)} className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all" title="Hapus Data"><Trash2 size={18} /></button>
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