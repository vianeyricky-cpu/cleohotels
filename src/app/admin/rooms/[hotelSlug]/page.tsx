import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Plus, ArrowLeft, Edit, Users, Ruler } from "lucide-react";
import Image from "next/image";
// Import tombol hapus yang sudah dibuat sebelumnya
import DeleteRoomButton from "@/components/admin/DeleteRoomButton"; 

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

  // 2. Ambil Data Rooms (Sort by Created At agar data baru ada di bawah/atas)
  // Pastikan kolom 'created_at' sudah ditambahkan di database sesuai instruksi sebelumnya
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

      {/* --- GRID ROOMS --- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms?.map((room) => {
          // Logika Gambar: Prioritaskan Galeri[0], lalu Legacy Image
          const thumbnail = room.images?.[0] || room.image;

          return (
            <div key={room.id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              
              {/* Gambar Thumbnail */}
              <div className="relative h-56 bg-gray-100 overflow-hidden">
                {thumbnail ? (
                  <Image 
                    src={thumbnail} 
                    alt={room.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    unoptimized 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm flex-col gap-2">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    No Image
                  </div>
                )}
                
                {/* Badge Jumlah Foto */}
                {room.images && room.images.length > 1 && (
                   <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-md border border-white/10">
                      +{room.images.length - 1} MORE
                   </div>
                )}
              </div>

              {/* Konten Text */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-navy-950 mb-1 line-clamp-1">{room.name}</h3>
                
                {/* Info Ukuran & Kapasitas */}
                <div className="grid grid-cols-2 gap-3 mt-auto text-xs text-gray-500 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                   <div className="flex items-center gap-2">
                      <Ruler size={14} className="text-gold-500"/>
                      <span className="font-medium">{room.size || "-"} m²</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Users size={14} className="text-gold-500"/>
                      <span className="font-medium">{room.capacity || "-"} People</span>
                   </div>
                </div>

                {/* --- ACTION BUTTONS (Edit & Delete) --- */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {/* Tombol Edit */}
                    <Link 
                      href={`/admin/rooms/${params.hotelSlug}/${room.id}`}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-navy-950 text-white font-bold text-sm hover:bg-gold-500 hover:text-navy-950 transition-colors"
                    >
                      <Edit size={16} /> Edit
                    </Link>

                    {/* Tombol Hapus (Ini memanggil komponen client yang kita buat) */}
                    <DeleteRoomButton roomId={room.id} />
                </div>

              </div>
            </div>
          );
        })}

        {/* --- EMPTY STATE (Jika belum ada kamar) --- */}
        {(!rooms || rooms.length === 0) && (
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
        )}
      </div>
    </div>
  );
}