"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteFacilityButton({ facilityId }: { facilityId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this facility?");
    if (!confirm) return;

    setIsDeleting(true);

    try {
      const { error } = await supabase.from("Facility").delete().eq("id", facilityId);
      if (error) throw error;
      router.refresh();
    } catch (err: any) {
      alert("Failed: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center justify-center gap-2 px-4 py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition"
    >
      {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      {isDeleting ? "..." : "Delete"}
    </button>
  );
}