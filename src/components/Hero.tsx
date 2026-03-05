"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <div className="relative w-full flex flex-col items-center">
      
      {/* --- HERO BANNER SECTION --- */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-neutral-900 mt-[70px]">
        {/* Background Image: Ganti path ini dengan gambar ramadan Anda di folder /public */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: `url('/hero-ramadan.jpg')` }}
        />
        
        {/* Gradient Overlay agar teks putih lebih mudah dibaca */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-wide drop-shadow-lg">
            THE SPIRIT OF <br />
            {/* Jika Anda punya font script khusus (seperti Playfair Display/Great Vibes), tambahkan class-nya di sini */}
            <span className="font-serif italic font-light text-5xl md:text-7xl lg:text-8xl">Ramadan</span>
          </h1>
        </motion.div>
      </section>

      {/* --- BOOKING BAR SECTION --- */}
      <section className="container mx-auto px-4 -mt-16 relative z-20 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white rounded-full shadow-2xl p-3 flex flex-col md:flex-row items-center justify-between gap-4 border border-neutral-100"
        >
          {/* Fields */}
          <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-100 text-left">
            
            <div className="px-4 py-2 hover:bg-neutral-50 rounded-l-full cursor-pointer transition">
              <label className="block text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">
                Hotel
              </label>
              <p className="text-sm font-semibold text-neutral-900 truncate">Select hotel</p>
            </div>
            
            <div className="px-4 py-2 hover:bg-neutral-50 cursor-pointer transition">
              <label className="block text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">
                Check-in
              </label>
              <p className="text-sm font-semibold text-neutral-900">Select dates</p>
            </div>
            
            <div className="px-4 py-2 hover:bg-neutral-50 cursor-pointer transition">
              <label className="block text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">
                Check-out
              </label>
              <p className="text-sm font-semibold text-neutral-900">Select dates</p>
            </div>
            
            <div className="px-4 py-2 hover:bg-neutral-50 md:rounded-r-full cursor-pointer transition">
              <label className="block text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">
                No. of Guest
              </label>
              <p className="text-sm font-semibold text-neutral-900">2 guests</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-3 px-2 md:px-0">
            <button className="text-xs md:text-sm text-neutral-600 font-semibold px-4 py-2 md:py-3 rounded-full border border-neutral-200 hover:bg-neutral-50 transition whitespace-nowrap">
              + Promo Code
            </button>
            <button className="bg-red-600 text-white text-xs md:text-sm font-bold px-6 py-3 rounded-full hover:bg-red-700 shadow-md shadow-red-600/30 transition whitespace-nowrap">
              SEE AVAILABILITY
            </button>
          </div>
        </motion.div>

        {/* --- PROMO PERKS BANNER --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 mx-auto max-w-5xl hidden md:flex items-center justify-between gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">✓</div>
            <span className="text-sm font-medium text-neutral-700">Best Rate Guarantee</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">%</div>
            <span className="text-sm font-medium text-neutral-700">Member's Discount</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">☕</div>
            <span className="text-sm font-medium text-neutral-700">Free Second Drink</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">✈</div>
            <span className="text-sm font-medium text-neutral-700">Earn AirMiles</span>
          </div>
        </motion.div>

      </section>
    </div>
  );
}