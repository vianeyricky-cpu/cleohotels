"use client";

import { useMemo, useTransition } from "react";
import type { Hotel, Room } from "@/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoom, deleteRoom, updateRoom } from "@/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";

const roomSchema = z.object({
  name: z.string().min(2),
  size: z.string().min(2),
  capacity: z.string().min(1),
  description: z.string().min(10),
  amenities: z.string().min(2),
});

type RoomFormValues = z.infer<typeof roomSchema>;

export function RoomManager({
  hotels,
  rooms,
}: {
  hotels: Hotel[];
  rooms: Room[];
}) {
  const roomsByHotel = useMemo(() => {
    const grouped: Record<string, Room[]> = {};
    rooms.forEach((room) => {
      grouped[room.hotelId] ??= [];
      grouped[room.hotelId].push(room);
    });
    return grouped;
  }, [rooms]);

  return (
    <div className="space-y-10">
      {hotels.map((hotel) => (
        <RoomSection
          key={hotel.id}
          hotel={hotel}
          rooms={roomsByHotel[hotel.id] ?? []}
        />
      ))}
    </div>
  );
}

function RoomSection({ hotel, rooms }: { hotel: Hotel; rooms: Room[] }) {
  const [isPending, startTransition] = useTransition();
  const createForm = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: "",
      size: "",
      capacity: "",
      description: "",
      amenities: "",
    },
  });

  return (
    <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-navy-900">{hotel.name}</h3>
          <p className="text-xs text-navy-500">Rooms: {rooms.length}</p>
        </div>
        {isPending && <span className="text-xs text-navy-400">Saving...</span>}
      </div>

      <form
        className="mb-8 grid gap-4 md:grid-cols-2"
        onSubmit={createForm.handleSubmit((values) => {
          startTransition(async () => {
            await createRoom({
              hotelId: hotel.id,
              name: values.name,
              size: values.size,
              capacity: values.capacity,
              description: values.description,
              amenities: values.amenities
                .split(",")
                .map((amenity) => amenity.trim())
                .filter(Boolean),
              image: "",
            });
            createForm.reset();
          });
        })}
      >
        <InputField label="Room name" {...createForm.register("name")} />
        <InputField label="Size" {...createForm.register("size")} />
        <InputField label="Capacity" {...createForm.register("capacity")} />
        <InputField label="Amenities (comma separated)" {...createForm.register("amenities")} />
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-medium text-navy-700">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
            {...createForm.register("description")}
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-gold-400 px-4 py-2 text-sm font-medium text-navy-900 transition hover:bg-gold-300"
          >
            Add room
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </section>
  );
}

function RoomCard({ room }: { room: Room }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: room.name,
      size: room.size,
      capacity: room.capacity,
      description: room.description,
      amenities: room.amenities.join(", "),
    },
  });

  return (
    <div className="rounded-xl border border-navy-100 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-base font-semibold text-navy-900">{room.name}</h4>
        <button
          type="button"
          onClick={() =>
            startTransition(async () => {
              await deleteRoom(room.id);
            })
          }
          className="text-xs text-red-500 hover:text-red-400"
        >
          Delete
        </button>
      </div>
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={form.handleSubmit((values) => {
          startTransition(async () => {
            await updateRoom(room.id, {
              name: values.name,
              size: values.size,
              capacity: values.capacity,
              description: values.description,
              amenities: values.amenities
                .split(",")
                .map((amenity) => amenity.trim())
                .filter(Boolean),
            });
          });
        })}
      >
        <InputField label="Room name" {...form.register("name")} />
        <InputField label="Size" {...form.register("size")} />
        <InputField label="Capacity" {...form.register("capacity")} />
        <InputField label="Amenities (comma separated)" {...form.register("amenities")} />
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-medium text-navy-700">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
            {...form.register("description")}
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-navy-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-navy-800"
          >
            Update room
          </button>
        </div>
      </form>
      <div className="mt-6">
        <ImageUpload
          label="Upload room image"
          onUploaded={(url) => {
            startTransition(async () => {
              await updateRoom(room.id, { image: url });
            });
          }}
        />
      </div>
      {isPending && <p className="mt-2 text-xs text-navy-400">Saving...</p>}
    </div>
  );
}

function InputField({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-navy-700">
        {label}
      </label>
      <input
        className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
        {...props}
      />
    </div>
  );
}
