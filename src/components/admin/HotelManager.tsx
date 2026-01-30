"use client";

import { useState, useTransition } from "react";
import type { HotelWithImages } from "@/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateHotel, updateHotelImages } from "@/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { X } from "lucide-react";

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
  // Ambil array images dari hotel, jika null ganti dengan array kosong
  const [images, setImages] = useState<string[]>(hotel.images ?? []);
  const [isPending, startTransition] = useTransition();

  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      name: hotel.name,
      slug: hotel.slug,
      tagline: hotel.tagline ?? "",
      description: hotel.description ?? "",
      address: hotel.address ?? "",
      phone: hotel.phone ?? "",
      instagram: hotel.instagram ?? "",
    },
  });

  // LOGIKA BARU: Upload Hero Image (Menambah ke urutan pertama array images)
  const handleHeroImageUpload = (url: string) => {
    const newImages = [url, ...images]; // Masukkan gambar baru di paling depan
    setImages(newImages);
    
    startTransition(async () => {
      // Kita pakai updateHotelImages karena updateHotel tidak punya field 'image'
      await updateHotelImages(hotel.id, newImages);
    });
  };

  // Hapus Image dari Gallery
  const handleRemoveImage = (urlToRemove: string) => {
    const nextImages = images.filter((img) => img !== urlToRemove);
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
        {isPending && <span className="text-xs text-navy-400 animate-pulse">Saving...</span>}
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
            className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
            {...form.register("description")}
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-navy-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-navy-800"
          >
            Save changes
          </button>
        </div>
      </form>

      {/* --- IMAGE SECTION --- */}
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        
        {/* Left: Upload Hero (New Image) */}
        <div>
           <p className="text-sm font-medium text-navy-900 mb-3">Add New Image</p>
           <ImageUpload 
             label="Upload Image" 
             onChange={handleHeroImageUpload} 
             // FIX: Gunakan images[0] (gambar pertama) sebagai preview jika ada, atau string kosong
             value={""} 
           />
           <p className="text-[10px] text-gray-400 mt-2">
             * Uploading will add the image to the gallery below.
           </p>
        </div>

        {/* Right: Gallery Management */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-navy-900">Current Gallery ({images.length})</p>
          
          <div className="flex flex-wrap gap-3">
            {images.length === 0 && (
              <span className="text-xs text-navy-400 italic border border-dashed p-4 rounded w-full text-center">No images yet.</span>
            )}
            
            {images.map((url, index) => (
              <div key={url + index} className="relative group w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                 {/* Thumbnail Image */}
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={url} alt="Hotel" className="w-full h-full object-cover" />
                 
                 {/* Remove Button */}
                 <button
                  type="button"
                  onClick={() => handleRemoveImage(url)}
                  className="absolute top-0 right-0 bg-red-500/80 text-white p-1 opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                  title="Remove image"
                >
                  <X size={12} />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] text-center py-0.5">
                    HERO
                  </div>
                )}
              </div>
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
        className="w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
        {...props}
      />
    </div>
  );
}