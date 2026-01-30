import { supabase } from "@/lib/supabase"; // <--- FIX: Pakai path yang benar
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Users, Ruler, Bed, Check } from "lucide-react";
import type { Room } from "@/types"; // Import Type Room

export const dynamic = "force-dynamic";

export default async function HotelRoomsPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  // 1. Ambil Data Hotel
  const { data: hotel } = await supabase
    .from("Hotel")
    .select("id, name, slug")
    .eq("slug", params.slug)
    .single();

  if (!hotel) return notFound();

  // 2. Ambil Data Room
  const { data: rooms } = await supabase
    .from("Room")
    .select("*")
    .eq("hotelId", hotel.id)
    .order("price", { ascending: true });

  // Casting data rooms ke tipe Room[] agar TypeScript tidak bingung
  const typedRooms = (rooms || []) as Room[];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <Link
          href={`/${params.locale}/hotels/${params.slug}`}
          className="rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-gold-500 hover:text-white"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-navy-900">
            {hotel.name} - Rooms
          </h1>
          <p className="text-gray-500">Available room types</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {typedRooms.map((room) => (
          <div
            key={room.id}
            className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"
          >
            <div className="relative h-48 w-full bg-gray-100">
              {room.image ? (
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs font-bold text-white">
                Rp {room.price?.toLocaleString("id-ID") || 0}
                <span className="text-[10px] font-normal"> /night</span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-lg font-bold text-navy-900 mb-2">
                {room.name}
              </h3>

              <div className="mb-4 flex flex-wrap gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Users size={14} className="text-gold-500" />
                  <span>{room.capacity} Pax</span>
                </div>
                <div className="flex items-center gap-1">
                  <Ruler size={14} className="text-gold-500" />
                  <span>{room.size} m²</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bed size={14} className="text-gold-500" />
                  <span>{room.bedType || "King Bed"}</span>
                </div>
              </div>

              <p className="mb-4 line-clamp-2 text-sm text-gray-500">
                {room.description}
              </p>

              <div className="mb-6 mt-auto">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                  Amenities
                </p>
                <div className="flex flex-wrap gap-2">
                  {room.amenities ? (
                    room.amenities.split(",").map((item, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 rounded-full bg-navy-50 px-2 py-1 text-[10px] font-medium text-navy-800 border border-navy-100"
                      >
                        <Check size={10} className="text-gold-500" />
                        {item.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs italic text-gray-400">
                      No amenities
                    </span>
                  )}
                </div>
              </div>

              <button className="mt-2 w-full rounded-lg bg-navy-900 py-3 text-sm font-bold text-white transition hover:bg-gold-500 hover:text-navy-900">
                Book This Room
              </button>
            </div>
          </div>
        ))}
        
        {typedRooms.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No rooms available for this hotel yet.
          </div>
        )}
      </div>
    </div>
  );
}