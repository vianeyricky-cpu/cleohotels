"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import { MultiImageUpload } from "@/components/admin/MultiImageUpload";

export default function RoomForm({ hotelId, room, isNew = false }: { hotelId: string, room?: any, isNew?: boolean }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Initial State
  const [formData, setFormData] = useState({
    name: room?.name || "",
    description: room?.description || "",
    size: room?.size || "",
    capacity: room?.capacity || "",
    // FIX ERROR: Inisialisasi amenities sebagai array kosong [] agar tidak null
    amenities: (room?.amenities || []) as string[], 
    images: room?.images || (room?.image ? [room.image] : []) || [] 
  });

  // State khusus untuk input text amenities (dipisah koma)
  const [amenitiesInput, setAmenitiesInput] = useState(
    room?.amenities ? room.amenities.join(", ") : ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert input string amenities menjadi Array
      // Contoh: "WiFi, AC, TV" -> ["WiFi", "AC", "TV"]
      const amenitiesArray = amenitiesInput.length > 0 
        ? amenitiesInput.split(",").map((item: string) => item.trim()) 
        : [];

      const payload = {
        hotelId,
        name: formData.name,
        description: formData.description,
        size: formData.size,
        capacity: formData.capacity,
        images: formData.images,
        image: formData.images[0] || null, // Thumbnail legacy
        amenities: amenitiesArray // Kirim array ini agar tidak error Not-Null
      };

      let error;
      if (isNew) {
        const { error: err } = await supabase.from("Room").insert(payload);
        error = err;
      } else {
        const { error: err } = await supabase.from("Room").update(payload).eq("id", room.id);
        error = err;
      }

      if (error) throw error;
      
      alert("Success! Room saved.");
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
        {/* KOLOM KIRI: Data Text */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Room Name</label>
            <input 
              type="text" 
              required 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Size (m²)</label>
                <input 
                  type="text" 
                  value={formData.size} 
                  onChange={e => setFormData({...formData, size: e.target.value})} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" 
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Capacity</label>
                <input 
                  type="text" 
                  value={formData.capacity} 
                  onChange={e => setFormData({...formData, capacity: e.target.value})} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" 
                />
             </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Amenities</label>
            <input 
              type="text" 
              value={amenitiesInput} 
              onChange={e => setAmenitiesInput(e.target.value)} 
              placeholder="Example: WiFi, AC, TV, Bathtub (Separate with comma)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" 
            />
            <p className="text-xs text-gray-400 mt-1">Separate items with a comma (,)</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
            <textarea 
              rows={4} 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" 
            />
          </div>
        </div>

        {/* KOLOM KANAN: Upload Image */}
        <div>
           <MultiImageUpload 
             urls={formData.images} 
             onChange={(newUrls) => setFormData({...formData, images: newUrls})} 
           />
           <p className="text-xs text-gray-400 mt-2">
             * The first image will be used as the main thumbnail. <br/>
             * You can upload multiple images at once.
           </p>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t mt-4">
        <button 
          type="submit" 
          disabled={isLoading} 
          className="flex items-center gap-2 px-8 py-3 bg-navy-950 text-white font-bold rounded-lg hover:bg-gold-500 hover:text-navy-950 transition disabled:opacity-50"
        >
           {isLoading ? <Loader2 className="animate-spin"/> : <Save size={18} />}
           Save Room Data
        </button>
      </div>
    </form>
  );
}