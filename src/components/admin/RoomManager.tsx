"use client";

import { useState, useTransition, useEffect } from "react";
import type { Room } from "@/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoom, deleteRoom, updateRoom } from "@/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { GripVertical, Save, Loader2 } from "lucide-react";

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
  
  // --- STATE UNTUK DRAG AND DROP ---
  // Urutkan kamar berdasarkan order_index (jika ada) saat pertama kali dimuat
  const sortedRooms = [...rooms].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  const [orderedRooms, setOrderedRooms] = useState<Room[]>(sortedRooms);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [isOrderChanged, setIsOrderChanged] = useState(false);

  // Sync state jika ada perubahan data dari server
  useEffect(() => {
    setOrderedRooms([...rooms].sort((a, b) => (a.order_index || 0) - (b.order_index || 0)));
    setIsOrderChanged(false);
  }, [rooms]);

  const createForm = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: "",
      description: "",
      capacity: 2,
      price: 0,
      size: 20,
      bedType: "",
      amenities: "",
    },
  });

  // --- LOGIKA DRAG & DROP ---
  const handleDragStart = (index: number) => setDraggedIdx(index);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (index: number) => {
    if (draggedIdx === null) return;
    const newOrder = [...orderedRooms];
    const draggedItem = newOrder.splice(draggedIdx, 1)[0];
    newOrder.splice(index, 0, draggedItem);
    
    setOrderedRooms(newOrder);
    setDraggedIdx(null);
    setIsOrderChanged(true);
  };

  // --- FUNGSI SAVE URUTAN KE DATABASE ---
  const handleSaveOrder = async () => {
    setIsSavingOrder(true);
    try {
      // Loop semua kamar yang posisinya berubah dan update 'order_index' di database
      // Kita panggil updateRoom satu per satu
      const updatePromises = orderedRooms.map((room, index) => 
        updateRoom(room.id, { order_index: index } as any)
     );
      
      await Promise.all(updatePromises);
      setIsOrderChanged(false);
      alert("Urutan kamar berhasil disimpan!");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan urutan.");
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

        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={createForm.handleSubmit((values) => {
            startTransition(async () => {
              await createRoom({
                hotelId,
                ...values,
                amenities: values.amenities || "", 
                image: "", 
                order_index: orderedRooms.length 
              } as any);
              createForm.reset();
            });
          })}
        >
          <InputField label="Room Name" {...createForm.register("name")} placeholder="e.g. Deluxe King" />
          <InputField label="Bed Type" {...createForm.register("bedType")} placeholder="e.g. 1 King Bed" />
          
          <div className="grid grid-cols-3 gap-4 md:col-span-2">
             <InputField type="number" label="Price (IDR)" {...createForm.register("price")} />
             <InputField type="number" label="Capacity (Pax)" {...createForm.register("capacity")} />
             <InputField type="number" label="Size (m²)" {...createForm.register("size")} />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-navy-700">Description</label>
            <textarea
              rows={2}
              className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
              {...createForm.register("description")}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-navy-700">Amenities (Separate with comma)</label>
            <input
              className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
              placeholder="WiFi, AC, Breakfast, TV"
              {...createForm.register("amenities")}
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-gold-500 px-6 py-2 text-sm font-bold text-white transition hover:bg-gold-600 shadow-sm disabled:opacity-50"
            >
              {isPending ? "Adding..." : "Add Room"}
            </button>
          </div>
        </form>
      </section>

      {/* LIST ROOMS DENGAN DRAG AND DROP */}
      <section>
        <div className="flex justify-between items-center mb-6">
           <div>
              <h3 className="text-lg font-semibold text-navy-900">Room List</h3>
              <p className="text-xs text-navy-500">Drag to reorder. The top room will appear first.</p>
           </div>
           
           {/* Tombol ini hanya muncul jika Admin mengubah urutan */}
           {isOrderChanged && (
             <button 
               onClick={handleSaveOrder}
               disabled={isSavingOrder}
               className="flex items-center gap-2 bg-navy-950 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gold-500 hover:text-navy-950 transition animate-pulse"
             >
                {isSavingOrder ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                Save New Order
             </button>
           )}
        </div>

        <div className="space-y-6">
          {orderedRooms.map((room, index) => (
            <div 
              key={room.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              className={`relative transition-all duration-300 ${
                draggedIdx === index ? "opacity-40 scale-95" : "opacity-100"
              }`}
            >
              {/* Handle Drag (Area untuk mengklik dan menahan) */}
              <div className="absolute top-4 left-[-16px] md:left-[-32px] p-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gold-500 transition">
                 <GripVertical size={24} />
              </div>
              
              <RoomCard room={room} />
            </div>
          ))}

          {orderedRooms.length === 0 && (
             <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400">
                No rooms added yet.
             </div>
          )}
        </div>
      </section>
    </div>
  );
}

function RoomCard({ room }: { room: Room }) {
  const [isPending, startTransition] = useTransition();
  
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: room.name,
      description: room.description ?? "",
      capacity: Number(room.capacity), 
      price: Number(room.price || 0),
      size: Number(room.size || 0),
      bedType: room.bedType || "",
      amenities: room.amenities || "", 
    },
  });

  return (
    <div className="rounded-xl border border-navy-100 p-5 bg-white shadow-sm hover:shadow-md transition">
      <div className="mb-4 flex items-center justify-between pl-4 md:pl-0">
        <h4 className="text-base font-bold text-navy-900">{room.name}</h4>
        <button
          type="button"
          onClick={() =>
            startTransition(async () => {
              if (window.confirm("Delete this room?")) await deleteRoom(room.id);
            })
          }
          className="text-xs text-red-500 hover:text-red-700 font-medium px-3 py-1 border border-red-100 rounded-full hover:bg-red-50 transition"
        >
          Delete Room
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => {
            startTransition(async () => {
              await updateRoom(room.id, {
                 ...values,
                 amenities: values.amenities || ""
              });
              alert("Room updated!");
            });
          })}
        >
          <div className="grid grid-cols-2 gap-4">
             <InputField label="Name" {...form.register("name")} />
             <InputField label="Bed Type" {...form.register("bedType")} />
          </div>
          <div className="grid grid-cols-3 gap-2">
             <InputField type="number" label="Price" {...form.register("price")} />
             <InputField type="number" label="Cap." {...form.register("capacity")} />
             <InputField type="number" label="Size" {...form.register("size")} />
          </div>
          
          <div>
            <label className="mb-1 block text-xs font-medium text-navy-700">Description</label>
            <textarea
              rows={2}
              className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
              {...form.register("description")}
            />
          </div>

           <div>
            <label className="mb-1 block text-xs font-medium text-navy-700">Amenities</label>
            <textarea
              rows={2}
              className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
              {...form.register("amenities")}
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-navy-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-navy-800 w-full md:w-auto"
          >
            {isPending ? "Saving..." : "Update Details"}
          </button>
        </form>

        <div className="space-y-2">
           <p className="text-xs font-bold text-navy-700">Room Thumbnail</p>
           <ImageUpload
            label="Upload room image"
            value={room.image || ""}
            onChange={(url) => {
              startTransition(async () => {
                await updateRoom(room.id, { image: url });
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}

function InputField({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-navy-700">{label}</label>
      <input
        className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
        {...props}
      />
    </div>
  );
}