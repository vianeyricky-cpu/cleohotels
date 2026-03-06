"use client";

import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignOut = async () => {
    const confirmLogout = confirm("Apakah Anda yakin ingin keluar dari sistem?");
    if (!confirmLogout) return;

    // 1. Perintahkan Supabase untuk hapus session
    await supabase.auth.signOut();
    
    // 2. Bersihkan sisa data di browser (opsional tapi bagus)
    localStorage.clear();
    sessionStorage.clear();

    // 3. Tendang balik ke halaman depan atau login
    router.push("/"); 
    router.refresh(); // Segarkan halaman agar sistem tahu Anda sudah logout
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