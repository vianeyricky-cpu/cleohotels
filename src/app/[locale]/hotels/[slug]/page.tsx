import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Instagram } from "lucide-react";
import { getHotels } from "@/actions/getHotels"; 
import { createClient } from "@supabase/supabase-js";
import { RoomCarousel } from "@/components/public/RoomCarousel"; 
import { BookingWidget } from "@/components/public/BookingWidget"; 
import { FacilityGallery } from "@/components/public/FacilityGallery"; // <-- IMPORT KOMPONEN BARU

export const dynamic = "force-dynamic";

export default async function HotelDetailPage({ params }: { params: { locale: string, slug: string } }) {
  
  const hotels = await getHotels();
  const hotel = hotels.find((h: any) => h.slug === params.slug);

  if (!hotel) return notFound();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: rooms } = await supabase
    .from("Room")
    .select("*")
    .eq("hotelId", hotel.id)
    .order("order_index", { ascending: true });

  const { data: facilities } = await supabase
    .from("Facility")
    .select("*")
    .eq("hotelId", hotel.id)
    .order("created_at", { ascending: true });

  const displayTagline = hotel.slug.includes("jemursari") 
    ? "Business & Culinary District" 
    : (hotel.tagline || "Smart Comfort Hotel");

  return (
    <main className="min-h-screen bg-white text-neutral-900 pb-24">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex flex-col justify-end pb-32 pt-[120px]">
        <div className="absolute inset-0 z-0 bg-neutral-900">
          <Image src={hotel.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80"} alt={hotel.name} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="inline-block border border-white/20 bg-black/20 backdrop-blur-md rounded-full px-5 py-2 mb-6">
            <span className="text-[#4aa4ff] font-extrabold tracking-widest text-xs md:text-sm uppercase drop-shadow-md">{displayTagline}</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">{hotel.name}</h1>
          <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-base font-medium">
            <div className="flex items-center gap-2"><MapPin size={22} className="text-[#4aa4ff]" /><span className="drop-shadow-md">{hotel.address}</span></div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/50"></div>
            <Link href="#" className="flex items-center gap-2 hover:text-[#4aa4ff] transition drop-shadow-md"><Instagram size={20} />@cleohotels</Link>
          </div>
        </div>
      </section>

      {/* --- FLOATING BOOKING BAR --- */}
      <section className="relative z-20 w-full max-w-7xl mx-auto px-4 -mt-16 md:-mt-24 mb-16">
        <BookingWidget defaultHotelSlug={hotel.slug} />
      </section>

      {/* --- OVERVIEW --- */}
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-12 text-center">
        <h2 className="text-3xl font-bold text-neutral-900 mb-8">Welcome to {hotel.name}</h2>
        <p className="text-lg text-neutral-600 leading-relaxed md:leading-loose">
          {hotel.description || `Experience the best of Surabaya with ${hotel.name}. Enjoy modern amenities, strategic locations, and exceptional service.`}
        </p>
      </section>

      {/* --- ROOMS SLIDER SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-6 mb-20">
        <RoomCarousel rooms={rooms || []} />
      </section>

      {/* --- DYNAMIC FACILITIES SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-neutral-50 rounded-[3rem] p-8 md:p-12 border border-neutral-100 shadow-sm">
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-4">Hotel Facilities</h2>
            <p className="text-neutral-600 text-lg">Enhance your stay with our premium facilities tailored for your needs.</p>
          </div>

          {/* Render Gallery Fasilitas di sini */}
          <FacilityGallery facilities={facilities || []} />

        </div>
      </section>

    </main>
  );
}