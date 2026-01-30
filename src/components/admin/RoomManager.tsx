"use client";

import { useState, useTransition } from "react";
import type { Room } from "@/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoom, deleteRoom, updateRoom } from "@/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";

// SCHEMA VALIDASI
const roomSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description too short"),
  capacity: z.coerce.number().min(1),
  price: z.coerce.number().min(0),
  size: z.coerce.number().min(0),
  bedType: z.string().min(2, "Bed type is required"),
  amenities: z.string().optional(), // String, bukan array
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
              // Panggil server action
              await createRoom({
                hotelId,
                ...values,
                // --- PERBAIKAN UTAMA DI SINI ---
                // Jangan pakai [], tapi pakai string kosong ""
                amenities: values.amenities || "", 
                image: "", 
              });
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

      {/* LIST ROOMS */}
      <div className="space-y-6">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
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
    <div className="rounded-xl border border-navy-100 p-5 bg-white shadow-sm">
      <div className="mb-4 flex items-center justify-between">
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