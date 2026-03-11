"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Tambahkan omniId sesuai dengan mapping di SingleBookingWidget
const HOTELS = [
  { id: "tunjungan", name: "Cleo Hotel Tunjungan", code: "tunjungan", omniId: "296" },
  { id: "jemursari", name: "Cleo Hotel Jemursari", code: "jemursari", omniId: "297" },
  { id: "walikota", name: "Cleo Hotel Walikota", code: "walikota", omniId: "298" },
];

export function BookingWidget({ defaultHotelSlug }: { defaultHotelSlug?: string }) {
  const router = useRouter();
  
  // State untuk form
  const [property, setProperty] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState("1");
  const [children, setChildren] = useState("0");
  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    if (defaultHotelSlug) {
      const matchedHotel = HOTELS.find(h => defaultHotelSlug.includes(h.id));
      if (matchedHotel) {
        setProperty(matchedHotel.code);
      }
    }
  }, [defaultHotelSlug]);

  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Cari data hotel yang dipilih
    const selectedHotel = HOTELS.find(h => h.code === property);
    let baseUrl = "";

    // 2. Tentukan Base URL Omnihotelier (Group vs Single Property)
    if (selectedHotel) {
      // Jika user memilih spesifik hotel
      baseUrl = `https://book.omnihotelier.com/v1/property/${selectedHotel.omniId}`;
    } else {
      // Jika user memilih "Semua Lokasi", arahkan ke halaman Group Booking (ID 46)
      baseUrl = `https://book.omnihotelier.com/v1/group/46`;
    }

    // 3. Susun parameter URL secara dinamis
    const params = new URLSearchParams();
    if (checkIn) params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);
    if (adults) params.append("adult", adults);
    if (children) params.append("child", children);
    if (promoCode) params.append("promoCode", promoCode);

    // 4. Gabungkan URL dan buka di tab baru
    const finalUrl = `${baseUrl}?${params.toString()}`;
    window.open(finalUrl, "_blank"); // Buka di tab baru
    
    // Opsional: Jika ingin buka di tab yang sama, gunakan:
    // window.location.href = finalUrl;
  };

  return (
    <div className="w-full bg-[#1c1c1c] text-white rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-black/30 border border-white/5 relative z-30">
      <form onSubmit={handleCheckAvailability} className="flex flex-col lg:flex-row items-end gap-4 lg:gap-6">
        
        {/* SELECT PROPERTY */}
        <div className="flex-1 w-full">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Select Property</label>
          <div className="relative">
            <select 
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              className="w-full appearance-none bg-[#2a2a2a] border border-white/10 text-white text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1a56db] cursor-pointer"
            >
              <option value="">Semua Lokasi</option>
              {HOTELS.map((h) => (
                <option key={h.id} value={h.code}>{h.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* CHECKIN DATE */}
        <div className="flex-1 w-full">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Checkin Date</label>
          <input 
            type="date" 
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
            className="w-full bg-[#2a2a2a] border border-white/10 text-white text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1a56db] color-scheme-dark" 
          />
        </div>

        {/* CHECKOUT DATE */}
        <div className="flex-1 w-full">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Checkout Date</label>
          <input 
            type="date" 
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
            className="w-full bg-[#2a2a2a] border border-white/10 text-white text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1a56db] color-scheme-dark" 
          />
        </div>

        {/* ADULT & CHILDREN */}
        <div className="flex gap-4 w-full lg:w-auto">
          <div className="w-20">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Adult</label>
            <div className="relative">
              <select value={adults} onChange={(e) => setAdults(e.target.value)} className="w-full appearance-none bg-[#2a2a2a] border border-white/10 text-white text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1a56db] cursor-pointer">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><svg width="10" height="6" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
            </div>
          </div>
          <div className="w-20">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Children</label>
            <div className="relative">
              <select value={children} onChange={(e) => setChildren(e.target.value)} className="w-full appearance-none bg-[#2a2a2a] border border-white/10 text-white text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1a56db] cursor-pointer">
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><svg width="10" height="6" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
            </div>
          </div>
        </div>

        {/* PROMO CODE */}
        <div className="flex-1 w-full lg:w-32">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Promo Code</label>
          <input 
            type="text" 
            placeholder="promocode"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="w-full bg-[#2a2a2a] border border-white/10 text-white text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1a56db] placeholder-gray-500" 
          />
        </div>

        {/* BUTTON */}
        <div className="w-full lg:w-auto mt-4 lg:mt-0">
          <button 
            type="submit" 
            className="w-full lg:w-auto bg-[#1a56db] hover:bg-blue-700 text-white text-[11px] font-extrabold uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 whitespace-nowrap"
          >
            Check Availability
          </button>
        </div>

      </form>
    </div>
  );
}