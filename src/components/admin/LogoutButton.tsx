"use client";

// 1. GANTI IMPORT INI: Gunakan library SSR
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  
  // 2. SETUP CLIENT: Gunakan createBrowserClient agar cookie ikut terhapus
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignOut = async () => {
    const confirmLogout = confirm("Apakah Anda yakin ingin keluar dari sistem?");
    if (!confirmLogout) return;

    // 1. Hapus session di Supabase (Ini sekarang akan menghapus Cookies juga)
    await supabase.auth.signOut();
    
    // 2. Bersihkan sisa data lokal (opsional)
    localStorage.clear();
    sessionStorage.clear();

    // 3. Arahkan ke login dan paksa refresh agar middleware membaca ulang status tanpa cookie
    router.push("/en/login"); // Arahkan ke route login dengan prefix bahasa
    router.refresh(); 
  };

  return (
    <button 
      onClick={handleSignOut}
      className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-blue-100 transition hover:bg-red-500 hover:text-white"
    >
      <LogOut size={18} />
      Sign Out
    </button>
  );
}