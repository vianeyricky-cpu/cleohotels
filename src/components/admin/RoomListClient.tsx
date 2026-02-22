"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
// Import ikon ArrowLeft dan ArrowRight
import { Users, Ruler, Edit, GripVertical, Save, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import DeleteRoomButton from "@/components/admin/DeleteRoomButton";
import { createClient } from "@supabase/supabase-js";

export default function RoomListClient({ initialRooms, hotelSlug }: { initialRooms: any[], hotelSlug: string }) {
  // Urutkan berdasarkan order_index saat pertama kali load
  const [rooms, setRooms] = useState(
    [...initialRooms].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
  );
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [isOrderChanged, setIsOrderChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // --- LOGIKA DRAG AND DROP (HTML5) ---
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
    setTimeout(() => { if (e.target instanceof HTMLElement) e.target.style.opacity = "0.4"; }, 0);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedIdx(null);
    if (e.target instanceof HTMLElement) e.target.style.opacity = "1";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIndex) return;

    const newOrder = [...rooms];
    const draggedItem = newOrder.splice(draggedIdx, 1)[0];
    newOrder.splice(dropIndex, 0, draggedItem);
    
    setRooms(newOrder);
    setDraggedIdx(null);
    setIsOrderChanged(true);
  };

  // --- LOGIKA TOMBOL PANAH (GANTI JADI KIRI-KANAN) ---
  // Pindah ke Kiri (sebelumnya Move Up)
  const moveLeft = (index: number) => {
    if (index === 0) return;
    const newOrder = [...rooms];
    [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    setRooms(newOrder);
    setIsOrderChanged(true);
  };

  // Pindah ke Kanan (sebelumnya Move Down)
  const moveRight = (index: number) => {
    if (index === rooms.length - 1) return;
    const newOrder = [...rooms];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setRooms(newOrder);
    setIsOrderChanged(true);
  };

  // --- SAVE URUTAN KE SUPABASE ---
  const saveOrder = async () => {
    setIsSaving(true);
    try {
      const promises = rooms.map((room, index) => 
        supabase.from("Room").update({ order_index: index }).eq("id", room.id)
      );
      await Promise.all(promises);
      setIsOrderChanged(false);
      alert("✅ Urutan kamar berhasil disimpan!");
    } catch (error) {
      alert("❌ Gagal menyimpan urutan.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* NOTIFIKASI SAVE ORDER (TEKS DIUBAH) */}
      {isOrderChanged && (
        <div className="flex justify-end bg-gold-50 p-4 rounded-xl border border-gold-200 shadow-sm animate-fade-in-up">
          <div className="flex items-center justify-between w-full">
            <span className="text-lg text-gold-700 font-bold flex items-center gap-2 tracking-wide uppercase">
              <GripVertical size={20}/> Reorder Posisi Kamar
            </span>
            <button onClick={saveOrder} disabled={isSaving} className="flex items-center gap-2 bg-navy-950 text-gold-400 px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-navy-900 transition animate-bounce">
              {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
              Save New Order
            </button>
          </div>
        </div>
      )}

      {/* GRID KAMAR */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room, index) => {
          const thumbnail = room.images?.[0] || room.image;

          return (
            <div 
              key={room.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`relative group bg-white rounded-2xl border transition-all duration-300 flex flex-col ${
                draggedIdx === index ? "border-gold-500 scale-105 z-50 shadow-2xl opacity-80" : "border-gray-200 hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              {/* --- CONTROL REORDER: TOMBOL KIRI-KANAN --- */}
              {/* Ubah flex-col jadi flex-row agar tombol sejajar menyamping */}
              <div className="absolute top-3 right-3 z-10 flex flex-row items-center gap-1 bg-white/95 p-1 rounded-lg shadow-md backdrop-blur-md border border-gray-100">
                {/* Tombol Kiri */}
                <button onClick={() => moveLeft(index)} disabled={index === 0} className="p-1 text-gray-400 hover:text-gold-500 hover:bg-gray-100 rounded disabled:opacity-20 disabled:hover:bg-transparent transition" title="Move Left">
                    <ArrowLeft size={18} />
                </button>
                
                {/* Drag Handle (Titik-titik) */}
                <div className="p-1 text-gray-400 cursor-grab active:cursor-grabbing hover:text-gold-500 px-2" title="Drag to reorder">
                    <GripVertical size={18} />
                </div>

                {/* Tombol Kanan */}
                <button onClick={() => moveRight(index)} disabled={index === rooms.length - 1} className="p-1 text-gray-400 hover:text-gold-500 hover:bg-gray-100 rounded disabled:opacity-20 disabled:hover:bg-transparent transition" title="Move Right">
                    <ArrowRight size={18} />
                </button>
              </div>

              {/* Thumbnail */}
              <div className="relative h-56 bg-gray-100 overflow-hidden rounded-t-2xl pointer-events-none">
                {thumbnail ? (
                  <Image src={thumbnail} alt={room.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm flex-col gap-2">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>No Image
                  </div>
                )}
                {room.images && room.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-md border border-white/10">+{room.images.length - 1} MORE</div>
                )}
              </div>

              {/* Text Content */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-navy-950 mb-1 pr-10 line-clamp-1">{room.name}</h3>
                
                <div className="grid grid-cols-2 gap-3 mt-auto text-xs text-gray-500 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100 pointer-events-none">
                  <div className="flex items-center gap-2"><Ruler size={14} className="text-gold-500"/><span className="font-medium">{room.size || "-"} m²</span></div>
                  <div className="flex items-center gap-2"><Users size={14} className="text-gold-500"/><span className="font-medium">{room.capacity || "-"} People</span></div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                    <Link href={`/admin/rooms/${hotelSlug}/${room.id}`} className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-navy-950 text-white font-bold text-sm hover:bg-gold-500 hover:text-navy-950 transition-colors"><Edit size={16} /> Edit</Link>
                    <DeleteRoomButton roomId={room.id} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}