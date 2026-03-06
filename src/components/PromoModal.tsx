"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { X, Send, CheckCircle2, Loader2 } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function PromoModal({ promo }: { promo: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Cek apakah promo ada dan sedang aktif
    if (promo && promo.is_active) {
      // Gunakan sessionStorage agar popup tidak muncul terus-terusan mengganggu jika user sudah menutupnya
      const hasSeenPromo = sessionStorage.getItem("cleo_promo_seen");
      
      if (!hasSeenPromo) {
        // Tunda 3 detik sebelum popup muncul agar lebih natural
        const timer = setTimeout(() => setIsOpen(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [promo]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("cleo_promo_seen", "true"); // Tandai sudah dilihat
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simpan data pengunjung ke tabel PromoLeads
    const { error } = await supabase.from("PromoLeads").insert([{
      email: email,
      whatsapp: whatsapp
    }]);

    setLoading(false);

    if (!error) {
      setSuccess(true);
      // Tutup otomatis setelah 3 detik
      setTimeout(() => handleClose(), 3000);
    } else {
      alert("Terjadi kesalahan, silakan coba lagi.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Tombol Tutup (X) */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/50 backdrop-blur-md text-white rounded-full transition"
        >
          <X size={20} className={promo.image ? "text-white" : "text-neutral-500"} />
        </button>

        {/* Gambar Promo */}
        {promo.image && (
          <div className="w-full h-48 sm:h-56 bg-neutral-200 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={promo.image} 
              alt={promo.title} 
              className="w-full h-full object-cover"
            />
            {/* Gradient untuk membuat teks di bawahnya lebih terbaca */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
          </div>
        )}

        {/* Konten Form */}
        <div className="p-8 relative z-10 -mt-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">Terima Kasih!</h3>
              <p className="text-neutral-500">Promo eksklusif telah kami kirimkan ke kontak Anda.</p>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2 mt-2">{promo.title}</h3>
              <p className="text-neutral-500 mb-6">{promo.description}</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input 
                    type="email" 
                    required 
                    placeholder="Alamat Email Anda" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a56db] text-neutral-900"
                  />
                </div>
                <div>
                  <input 
                    type="tel" 
                    required 
                    placeholder="Nomor WhatsApp" 
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a56db] text-neutral-900"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#f05136] text-white px-6 py-4 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/30 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  {loading ? "Memproses..." : "Dapatkan Promo Sekarang"}
                </button>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
}