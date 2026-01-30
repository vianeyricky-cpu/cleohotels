"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import { MultiImageUpload } from "@/components/admin/MultiImageUpload";

export default function FacilityForm({ hotelId, facility, isNew = false }: { hotelId: string, facility?: any, isNew?: boolean }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: facility?.name || "",
    type: facility?.type || "", // Contoh: "Pool", "Meeting Room"
    description: facility?.description || "",
    images: facility?.images || (facility?.image ? [facility.image] : []) || [] 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        hotelId,
        ...formData,
        image: formData.images[0] || null // Thumbnail legacy
      };

      let error;
      if (isNew) {
        const { error: err } = await supabase.from("Facility").insert(payload);
        error = err;
      } else {
        const { error: err } = await supabase.from("Facility").update(payload).eq("id", facility.id);
        error = err;
      }

      if (error) throw error;
      
      alert("Facility Saved!");
      router.refresh();
      router.back(); 
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Facility Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-lg" placeholder="e.g. Grand Ballroom" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Type / Category</label>
            <input type="text" required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-3 border rounded-lg" placeholder="e.g. MICE, Pool, Dining" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
            <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border rounded-lg" />
          </div>
        </div>

        <div>
           <MultiImageUpload 
             urls={formData.images} 
             onChange={(newUrls) => setFormData({...formData, images: newUrls})} 
           />
           <p className="text-xs text-gray-400 mt-2">* First image is the thumbnail.</p>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t mt-4">
        <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-8 py-3 bg-navy-950 text-white font-bold rounded-lg hover:bg-gold-500 hover:text-navy-950 transition">
           {isLoading ? <Loader2 className="animate-spin"/> : <Save size={18} />}
           Save Facility
        </button>
      </div>
    </form>
  );
}