"use client";

import { useState, useTransition, useEffect } from "react";
import type { Room } from "@/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoom, deleteRoom, updateRoom } from "@/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { GripVertical, Save, Loader2, ArrowUp, ArrowDown } from "lucide-react";

// SCHEMA VALIDASI
const roomSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description too short"),
  capacity: z.coerce.number().min(1),
  price: z.coerce.number().min(0),
  size: z.coerce.number().min(0),
  bedType: z.string().min(2, "Bed type is required"),
  amenities: z.string().optional(),
});

type RoomFormValues = z.infer<typeof roomSchema>;

export function RoomManager({
  hotelId,
  rooms,
}: {
  hotelId: string;
  rooms: Room[];
}) {
  const [isPending, startTransition] = useTransition();
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  
  const sortedRooms = [...rooms].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  const [orderedRooms, setOrderedRooms] = useState<Room[]>(sortedRooms);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [isOrderChanged, setIsOrderChanged] = useState(false);

  useEffect(() => {
    setOrderedRooms([...rooms].sort((a, b) => (a.order_index || 0) - (b.order_index || 0)));
    setIsOrderChanged(false);
  }, [rooms]);

  const createForm = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: "", description: "", capacity: 2, price: 0, size: 20, bedType: "", amenities: "",
    },
  });

  // --- LOGIKA DRAG AND DROP (DIPERBAIKI UNTUK SEMUA BROWSER) ---
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
    // Trik wajib untuk Firefox dan versi Chrome tertentu:
    e.dataTransfer.setData("text/plain", index.toString()); 
    
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = "0.4";
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedIdx(null);
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = "1";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Mengizinkan drop area
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIndex) return;

    const newOrder = [...orderedRooms];
    const draggedItem = newOrder.splice(draggedIdx, 1)[0];
    newOrder.splice(dropIndex, 0, draggedItem);
    
    setOrderedRooms(newOrder);
    setDraggedIdx(null);
    setIsOrderChanged(true);
  };

  // --- LOGIKA TOMBOL PANAH (UP/DOWN) ---
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...orderedRooms];
    [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    setOrderedRooms(newOrder);
    setIsOrderChanged(true);
  };

  const moveDown = (index: number) => {
    if (index === orderedRooms.length - 1) return;
    const newOrder = [...orderedRooms];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setOrderedRooms(newOrder);
    setIsOrderChanged(true);
  };

  // --- SAVE KE DATABASE ---
  const handleSaveOrder = async () => {
    setIsSavingOrder(true);
    try {
      const updatePromises = orderedRooms.map((room, index) => 
        updateRoom(room.id, { order_index: index } as any)
      );
      await Promise.all(updatePromises);
      setIsOrderChanged(false);
      alert("✅ Berhasil! Urutan kamar telah disimpan.");
    } catch (error) {
      alert("❌ Gagal menyimpan urutan.");
    } finally {
      setIsSavingOrder(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* FORM CREATE */}
      <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-navy-900">Add New Room</h3>
          <p className="text-xs text-navy-500">Create a new room type for this hotel</p>
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={createForm.handleSubmit((values) => { startTransition(async () => { await createRoom({ hotelId, ...values, amenities: values.amenities || "", image: "", order_index: orderedRooms.length } as any); createForm.reset(); }); })}>
          <InputField label="Room Name" {...createForm.register("name")} placeholder="e.g. Deluxe King" />
          <InputField label="Bed Type" {...createForm.register("bedType")} placeholder="e.g. 1 King Bed" />
          
          <div className="grid grid-cols-3 gap-4 md:col-span-2">
             <InputField type="number" label="Price (IDR)" {...createForm.register("price")} />
             <InputField type="number" label="Capacity (Pax)" {...createForm.register("capacity")} />
             <InputField type="number" label="Size (m²)" {...createForm.register("size")} />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-navy-700">Description</label>
            <textarea rows={2} className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-gold-500 outline-none" {...createForm.register("description")} />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-navy-700">Amenities</label>
            <input className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-gold-500 outline-none" placeholder="WiFi, AC, TV" {...createForm.register("amenities")} />
          </div>

          <div className="md:col-span-2">
            <button type="submit" disabled={isPending} className="rounded-lg bg-gold-500 px-6 py-2 text-sm font-bold text-white transition hover:bg-gold-600 shadow-sm disabled:opacity-50">
              {isPending ? "Adding..." : "Add Room"}
            </button>
          </div>
        </form>
      </section>

      {/* LIST ROOMS (DRAG & DROP + BUTTONS) */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
           <div>
              <h3 className="text-lg font-semibold text-navy-900">Room List & Reorder</h3>
              <p className="text-xs text-navy-500 mt-1">
                Tarik ikon <GripVertical size={14} className="inline"/> untuk menggeser, atau gunakan tombol panah.
              </p>
           </div>
           
           {isOrderChanged && (
             <button onClick={handleSaveOrder} disabled={isSavingOrder} className="flex items-center gap-2 bg-navy-950 text-gold-400 px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:bg-navy-900 transition animate-bounce">
                {isSavingOrder ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                Save New Order
             </button>
           )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orderedRooms.map((room, index) => (
            <div 
              key={room.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`relative transition-all duration-200 ease-in-out border-2 rounded-xl bg-white ${
                draggedIdx === index 
                  ? "border-gold-500 scale-105 z-50 shadow-2xl opacity-80" 
                  : "border-transparent hover:-translate-y-1 hover:shadow-lg"
              }`}
            >
              {/* --- CONTROL REORDER: DRAG HANDLE + ARROWS --- */}
              <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 bg-white/95 p-1 rounded-lg shadow-md backdrop-blur-md border border-gray-100">
                 {/* Tombol Up */}
                 <button onClick={() => moveUp(index)} disabled={index === 0} className="p-1 text-gray-400 hover:text-gold-500 hover:bg-gray-100 rounded disabled:opacity-20 disabled:hover:bg-transparent" title="Move Up">
                    <ArrowUp size={16} />
                 </button>
                 
                 {/* Drag Handle */}
                 <div className="p-1 text-gray-400 cursor-grab active:cursor-grabbing hover:text-gold-500 flex justify-center py-2" title="Drag to reorder">
                    <GripVertical size={18} />
                 </div>

                 {/* Tombol Down */}
                 <button onClick={() => moveDown(index)} disabled={index === orderedRooms.length - 1} className="p-1 text-gray-400 hover:text-gold-500 hover:bg-gray-100 rounded disabled:opacity-20 disabled:hover:bg-transparent" title="Move Down">
                    <ArrowDown size={16} />
                 </button>
              </div>
              
              <RoomCard room={room} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Komponen RoomCard
function RoomCard({ room }: { room: Room }) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: room.name, description: room.description ?? "", capacity: Number(room.capacity), price: Number(room.price || 0), size: Number(room.size || 0), bedType: room.bedType || "", amenities: room.amenities || "", 
    },
  });

  return (
    <div className="rounded-xl border border-navy-100 p-5 shadow-sm h-full flex flex-col">
      <div className="mb-4 pr-12"> 
        <h4 className="text-base font-bold text-navy-900 truncate">{room.name}</h4>
      </div>

      <div className="flex gap-4 text-xs text-gray-500 mb-4 pb-4 border-b">
         <span>📐 {room.size} m²</span>
         <span>👥 {room.capacity} Pax</span>
      </div>

      <div className="mb-4 aspect-[4/3] rounded-lg bg-gray-100 overflow-hidden relative pointer-events-none">
          {room.image ? (
            <img src={room.image} alt={room.name} className="object-cover w-full h-full" />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs">No Image</div>
          )}
      </div>

      <div className="mt-auto pt-4 flex gap-2">
         <button type="button" onClick={() => setIsEditing(!isEditing)} className="flex-1 bg-navy-950 text-white text-xs font-bold py-2 rounded-lg hover:bg-gold-500 transition">
           {isEditing ? "Close Edit" : "Edit Details"}
         </button>
         <button type="button" onClick={() => startTransition(async () => { if (window.confirm("Delete this room?")) await deleteRoom(room.id); })} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition text-xs font-bold">
            Delete
          </button>
      </div>

      {isEditing && (
        <div className="mt-4 pt-4 border-t border-dashed">
          <form className="space-y-3" onSubmit={form.handleSubmit((values) => { startTransition(async () => { await updateRoom(room.id, { ...values, amenities: values.amenities || "" } as any); setIsEditing(false); alert("Updated!"); }); })}>
            <InputField label="Name" {...form.register("name")} />
            <InputField label="Bed Type" {...form.register("bedType")} />
            <div className="grid grid-cols-3 gap-2">
               <InputField type="number" label="Price" {...form.register("price")} />
               <InputField type="number" label="Cap." {...form.register("capacity")} />
               <InputField type="number" label="Size" {...form.register("size")} />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-navy-700">Description</label>
              <textarea rows={2} className="w-full rounded-lg border border-navy-200 px-3 py-2 text-xs focus:border-gold-500 outline-none" {...form.register("description")} />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-navy-700">Amenities</label>
              <textarea rows={2} className="w-full rounded-lg border border-navy-200 px-3 py-2 text-xs focus:border-gold-500 outline-none" {...form.register("amenities")} />
            </div>
            <button type="submit" className="rounded-lg bg-gold-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-gold-600 w-full">
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </form>
          <div className="space-y-2 mt-4 pt-4 border-t">
             <p className="text-[10px] font-bold uppercase text-navy-700">Update Thumbnail</p>
             <ImageUpload label="Upload new image" value={room.image || ""} onChange={(url) => { startTransition(async () => { await updateRoom(room.id, { image: url } as any); }); }} />
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase text-navy-700">{label}</label>
      <input className="w-full rounded-lg border border-navy-200 px-3 py-2 text-xs focus:border-gold-500 outline-none" {...props} />
    </div>
  );
}