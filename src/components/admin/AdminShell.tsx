"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminAuthGate } from "@/components/admin/AdminAuthGate";
import { supabase } from "@/lib/supabase";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGate>
      <div className="min-h-screen bg-slate-100 text-navy-900 font-sans">
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px,1fr]">
          
          {/* SIDEBAR KIRI */}
          <AdminSidebar />

          <div className="flex flex-col">
            {/* HEADER ATAS */}
            <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 sticky top-0 z-40 shadow-sm">
              <div>
                {/* PERUBAHAN NAMA DI SINI */}
                <h1 className="text-lg font-extrabold text-navy-950 uppercase tracking-wider">
                  Cleo Management Content
                </h1>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium italic">
                  Control center for hotels, rooms, and properties.
                </p>
              </div>

              {/* TOMBOL LOGOUT */}
              <button
                type="button"
                onClick={async () => {
                  const confirmLogout = window.confirm("Are you sure you want to logout?");
                  if (confirmLogout) {
                    await supabase.auth.signOut();
                    window.location.reload();
                  }
                }}
                className="rounded-full border border-slate-200 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-600 transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:scale-95 shadow-sm"
              >
                Logout Account
              </button>
            </header>

            {/* AREA KONTEN UTAMA */}
            <main className="flex-1 px-6 py-8">
              <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
                {children}
              </div>
            </main>

            {/* FOOTER ADMIN (OPSIONAL) */}
            <footer className="px-6 py-4 border-t border-slate-200 bg-white/50 text-center">
               <p className="text-[10px] text-slate-400 font-medium">
                 Cleo Hotels Internal System v2.0 • 2026 Dashboard
               </p>
            </footer>
          </div>
        </div>
      </div>
    </AdminAuthGate>
  );
}