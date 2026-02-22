import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";
// Import file Client Component yang baru saja kita buat
import RoomListClient from "@/components/admin/RoomListClient";

// --- WAJIB: Agar data selalu fresh (tidak di-cache) ---
export const dynamic = "force-dynamic";

export default async function HotelRoomsPage({ params }: { params: { hotelSlug: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 1. Ambil Data Hotel
  const { data: hotel } = await supabase
    .from("Hotel")
    .select("id, name, slug")
    .eq("slug", params.hotelSlug)
    .single();
  
  if (!hotel) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <h2 className="text-2xl font-bold text-navy-950">Hotel Not Found</h2>
        <Link href="/admin/rooms" className="text-gold-500 hover:underline">Back to Hotel List</Link>
      </div>
    );
  }

  // 2. Ambil Data Rooms
  const { data: rooms } = await supabase
    .from("Room")
    .select("*")
    .eq("hotelId", hotel.id)
    .order("created_at", { ascending: true });

  return (
    <div className="max-w-7xl mx-auto py-8">
      
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/rooms" className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition shadow-sm">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-navy-950">{hotel.name} Rooms</h1>
            <p className="text-sm text-gray-500">Manage room types and galleries</p>
          </div>
        </div>
        
        <Link 
          href={`/admin/rooms/${params.hotelSlug}/new`} 
          className="flex items-center gap-2 px-6 py-3 bg-navy-950 text-white rounded-xl hover:bg-gold-500 hover:text-navy-950 transition font-bold shadow-lg shadow-navy-900/20"
        >
          <Plus size={18} /> 
          Add New Room
        </Link>
      </div>

      {/* --- KOMPONEN DRAG AND DROP --- */}
      {/* Kita pindahkan logika render kamar ke komponen Client agar bisa digeser */}
      {(!rooms || rooms.length === 0) ? (
        <div className="col-span-full flex flex-col items-center justify-center py-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center">
            <div className="p-4 bg-white rounded-full shadow-sm mb-4">
               <Plus size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-500">No rooms added yet</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">This hotel has no rooms listed. Start by creating the first one.</p>
            <Link 
              href={`/admin/rooms/${params.hotelSlug}/new`}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition shadow-sm"
            >
              Create First Room
            </Link>
        </div>
      ) : (
        <RoomListClient initialRooms={rooms} hotelSlug={params.hotelSlug} />
      )}
      
    </div>
  );
}