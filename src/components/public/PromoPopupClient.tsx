"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Loader2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export function PromoPopupClient() {
  const [isOpen, setIsOpen] = useState(false);
  const [promo, setPromo] = useState<any>(null);
  
  // State untuk form
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const checkAndShowPromo = async () => {
      const hasSeen = localStorage.getItem("hasSeenPromo");
      if (hasSeen) return;

      const { data } = await supabase.from("PromoPopup").select("*").eq("is_active", true).limit(1).single();
      
      if (data) {
        setPromo(data);
        setTimeout(() => setIsOpen(true), 3000);
      }
    };
    checkAndShowPromo();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenPromo", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from("PromoLeads").insert([{ email, whatsapp }]);

    setIsSubmitting(false);
    
    if (!error) {
      setIsSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 3000); // Tutup otomatis setelah 3 detik
    } else {
      alert("Terjadi kesalahan, coba lagi.");
    }
  };

  if (!isOpen || !promo) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        
        <button onClick={handleClose} className="absolute top-4 right-4 bg-white/80 hover:bg-white text-neutral-800 p-2 rounded-full backdrop-blur-md transition-colors z-10 shadow-sm">
          <X size={20} />
        </button>

        <div className="relative w-full h-48 md:h-56 bg-neutral-200">
          <Image src={promo.image || "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80"} alt="Promo" fill className="object-cover" />
        </div>

        <div className="p-8 text-center">
          <h3 className="text-2xl font-extrabold text-neutral-900 mb-2">{promo.title}</h3>
          <p className="text-neutral-600 mb-6 text-sm leading-relaxed">{promo.description}</p>

          {isSuccess ? (
            <div className="bg-green-50 text-green-600 p-4 rounded-xl font-bold border border-green-200">
              Terima kasih! Promo eksklusif akan segera kami kirimkan.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="email" 
                required 
                placeholder="Enter e-mail address*" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#f05136] outline-none transition text-sm text-center"
              />
              <input 
                type="text" 
                required 
                placeholder="Enter WhatsApp number*" 
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#f05136] outline-none transition text-sm text-center"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#f05136] hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-orange-500/30 uppercase tracking-wider text-sm disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
                {isSubmitting ? "Mengirim..." : "KIRIM PROMO"}
              </button>
            </form>
          )}
          
          <button onClick={handleClose} className="mt-4 text-xs font-bold text-neutral-400 hover:text-neutral-600 uppercase tracking-widest">
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}