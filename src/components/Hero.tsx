"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <div className="w-full flex flex-col">
      
      {/* --- HERO BANNER SECTION --- */}
      <section className="relative w-full h-[60vh] md:h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-neutral-900 mt-[70px]">
        {/* Background Image: Ganti path ini dengan gambar ramadan/hotel Anda di folder /public */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: `url('/hero-ramadan.jpg')` }}
        />
        
        {/* Gradient Overlay agak gelap agar teks putih lebih mudah dibaca */}
        <div className="absolute inset-0 bg-black/40" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-wide drop-shadow-lg">
            THE SPIRIT OF <br />
            {/* Font script/serif untuk kata Ramadan */}
            <span className="font-serif italic font-light text-5xl md:text-7xl lg:text-8xl">Ramadan</span>
          </h1>
        </motion.div>
      </section>

      {/* --- BOOKING BAR SECTION (PERSIS DI BAWAH HERO) --- */}
      <section className="w-full bg-white border-b border-neutral-200 shadow-md relative z-20">
        <div className="container mx-auto px-0 lg:px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col lg:flex-row items-stretch w-full"
          >
            {/* Bagian Input Formulir (Membentang Horizontal di Desktop) */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-200 text-left border-neutral-200">
              
              <div className="px-6 py-4 hover:bg-neutral-50 cursor-pointer transition flex flex-col justify-center">
                <label className="block text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">
                  Destination / Hotel
                </label>
                <p className="text-sm font-semibold text-neutral-900 truncate">Select a hotel...</p>
              </div>
              
              <div className="px-6 py-4 hover:bg-neutral-50 cursor-pointer transition flex flex-col justify-center">
                <label className="block text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">
                  Check-in
                </label>
                <p className="text-sm font-semibold text-neutral-900">Add Date</p>
              </div>
              
              <div className="px-6 py-4 hover:bg-neutral-50 cursor-pointer transition flex flex-col justify-center">
                <label className="block text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">
                  Check-out
                </label>
                <p className="text-sm font-semibold text-neutral-900">Add Date</p>
              </div>
              
              <div className="px-6 py-4 hover:bg-neutral-50 cursor-pointer transition flex flex-col justify-center">
                <label className="block text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">
                  Guests & Rooms
                </label>
                <p className="text-sm font-semibold text-neutral-900">1 Room, 2 Guests</p>
              </div>
            </div>

            {/* Bagian Kode Promo & Tombol Aksi */}
            <div className="flex flex-col sm:flex-row items-stretch lg:border-l border-neutral-200">
               <div className="px-6 py-4 hover:bg-neutral-50 cursor-pointer transition flex flex-col justify-center border-t sm:border-t-0 sm:border-r lg:border-r-0 border-neutral-200 lg:w-40">
                <label className="block text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">
                  Special Code
                </label>
                <p className="text-sm font-semibold text-neutral-900">Promo / Corp</p>
              </div>
              <button className="bg-red-600 text-white text-sm font-bold px-10 py-5 sm:py-0 hover:bg-red-700 transition uppercase tracking-wider h-full w-full sm:w-auto flex items-center justify-center">
                Check <br className="hidden lg:block"/> Rates
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- INFO TAMBAHAN (Opsional, di bawah booking bar) --- */}
      <div className="bg-neutral-50 w-full py-4 border-b border-neutral-200 hidden md:block">
        <div className="container mx-auto px-4 flex justify-center gap-8 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          <span className="flex items-center gap-2">✓ Best Rate Guarantee</span>
          <span className="flex items-center gap-2">✓ Exclusive Member Offers</span>
          <span className="flex items-center gap-2">✓ No Hidden Booking Fees</span>
        </div>
      </div>

    </div>
  );
}