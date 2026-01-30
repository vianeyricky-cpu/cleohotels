"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteRoomButton({ roomId }: { roomId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Setup Supabase Client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleDelete = async () => {
    // 1. Konfirmasi User
    const confirm = window.confirm("Are you sure you want to delete this room? This action cannot be undone.");
    if (!confirm) return;

    setIsDeleting(true);

    try {
      // 2. Hapus dari Database
      const { error } = await supabase
        .from("Room")
        .delete()
        .eq("id", roomId);

      if (error) throw error;

      // 3. Refresh Halaman agar data hilang
      router.refresh();
      
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center gap-2 px-4 py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
    >
      {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}