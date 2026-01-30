"use client";

import { useState, useTransition } from "react";
import type { HotelWithImages } from "@/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateHotel, updateHotelImages } from "@/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";

const hotelSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  tagline: z.string().min(2),
  description: z.string().min(10),
  address: z.string().min(2),
  phone: z.string().min(5),
  instagram: z.string().min(2),
});

type HotelFormValues = z.infer<typeof hotelSchema>;

export function HotelManager({ hotels }: { hotels: HotelWithImages[] }) {
  return (
    <div className="space-y-8">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
}

function HotelCard({ hotel }: { hotel: HotelWithImages }) {
  const [images, setImages] = useState<string[]>(hotel.images ?? []);
  const [isPending, startTransition] = useTransition();

  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      name: hotel.name,
      slug: hotel.slug,
      tagline: hotel.tagline,
      description: hotel.description,
      address: hotel.address,
      phone: hotel.phone,
      instagram: hotel.instagram,
    },
  });

  const handleImageUpload = (url: string) => {
    const nextImages = [...images, url];
    setImages(nextImages);
    startTransition(async () => {
      await updateHotelImages(hotel.id, nextImages);
    });
  };

  return (
    <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-navy-900">{hotel.name}</h3>
          <p className="text-xs text-navy-500">ID: {hotel.id}</p>
        </div>
        {isPending && <span className="text-xs text-navy-400">Saving...</span>}
      </div>
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={form.handleSubmit((values) => {
          startTransition(async () => {
            await updateHotel(hotel.id, values);
          });
        })}
      >
        <InputField label="Name" {...form.register("name")} />
        <InputField label="Slug" {...form.register("slug")} />
        <InputField label="Tagline" {...form.register("tagline")} />
        <InputField label="Instagram" {...form.register("instagram")} />
        <InputField label="Address" {...form.register("address")} />
        <InputField label="Phone" {...form.register("phone")} />
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-medium text-navy-700">
            Description
          </label>
          <textarea
            rows={4}
            className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
            {...form.register("description")}
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-navy-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-navy-800"
          >
            Save changes
          </button>
        </div>
      </form>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <ImageUpload label="Upload hero image" onUploaded={handleImageUpload} />
        <div className="space-y-3">
          <p className="text-sm font-medium text-navy-900">Current images</p>
          <div className="flex flex-wrap gap-2">
            {images.length === 0 && (
              <span className="text-xs text-navy-400">No images yet.</span>
            )}
            {images.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => {
                  const nextImages = images.filter((image) => image !== url);
                  setImages(nextImages);
                  startTransition(async () => {
                    await updateHotelImages(hotel.id, nextImages);
                  });
                }}
                className="rounded-full border border-navy-200 px-3 py-1 text-xs text-navy-600 transition hover:border-red-300 hover:text-red-500"
              >
                {url.split("/").pop()} · Remove
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
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
