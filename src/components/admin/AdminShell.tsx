"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminAuthGate } from "@/components/admin/AdminAuthGate";
import { Menu } from "lucide-react"; // Import ikon Menu

export function AdminShell({ children }: { children: React.ReactNode }) {
  // State untuk kontrol sidebar (default terbuka)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Otomatis menutup sidebar jika layar di bawah ukuran tablet/mobile (768px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Jalankan sekali saat pertama dimuat
    handleResize(); 
    
    // Dengarkan perubahan ukuran layar
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AdminAuthGate>
      {/* Gunakan flex agar transisi lebar sidebar berjalan mulus */}
      <div className="flex min-h-screen bg-slate-100 text-navy-900 font-sans overflow-hidden">
        
        {/* SIDEBAR KIRI */}
        <AdminSidebar isOpen={isSidebarOpen} />

        <div className="flex flex-col flex-1 min-w-0 transition-all duration-300">
          {/* HEADER ATAS */}
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 sticky top-0 z-40 shadow-sm">
            <div className="flex items-center gap-4">
              {/* TOMBOL TOGGLE SIDEBAR */}
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                title="Toggle Menu"
              >
                <Menu size={20} />
              </button>
              
              <div>
                <h1 className="text-lg font-extrabold text-navy-950 uppercase tracking-wider">
                  Cleo Management
                </h1>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium italic hidden md:block">
                  Control center for hotels, rooms, and properties.
                </p>
              </div>
            </div>
          </header>

          {/* AREA KONTEN UTAMA */}
          <main className="flex-1 px-4 md:px-8 py-8 overflow-y-auto">
            <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-2 duration-500">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminAuthGate>
  );
}