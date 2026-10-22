import { HotelTour } from "@/components/tour/HotelTour";
import { getPublishedTourGroups } from "@/lib/cleo/published-tours";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, Instagram } from "lucide-react";
import { getHotels } from "@/actions/getHotels"; 
import { createClient } from "@supabase/supabase-js";
import { RoomCarousel } from "@/components/public/RoomCarousel"; 
import { SingleBookingWidget } from "@/components/public/SingleBookingWidget";
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
  const tours = await getPublishedTourGroups([hotel], { rooms: rooms || [], facilities: facilities || [] });

  const id = params.locale === "id";

  return (
    <main id="main-content" className="hotel-detail min-h-screen bg-white text-neutral-900 pb-24">
      
      {/* --- HERO SECTION --- */}
      <section className="hotel-detail-hero relative h-[80vh] min-h-[600px] w-full flex flex-col justify-end pb-32 pt-[120px]">
        <div className="absolute inset-0 z-0 bg-neutral-900">
          <Image src={hotel.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80"} alt={hotel.name} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/25" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="hotel-tagline inline-block border border-white/20 bg-black/20 backdrop-blur-md rounded-full px-5 py-2 mb-6">
            <span className="text-[#4aa4ff] font-semibold tracking-widest text-xs md:text-sm uppercase drop-shadow-md">{displayTagline}</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white mb-6 tracking-tight drop-shadow-lg">{hotel.name}</h1>
          <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-base font-medium">
            <div className="flex items-center gap-2"><MapPin size={22} className="text-[#4aa4ff]" /><span className="drop-shadow-md">{hotel.address}</span></div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/50"></div>
            <Link href="https://instagram.com/cleohotels" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#4aa4ff] transition drop-shadow-md"><Instagram size={20} />@cleohotels</Link>
          </div>
        </div>
      </section>

      {/* --- FLOATING BOOKING BAR --- */}
      <section className="booking-strip"><div className="page-width">
      <SingleBookingWidget slug={hotel.slug} />
      </div></section>
      <nav className="hotel-detail-nav" aria-label={id ? "Jelajahi hotel" : "Explore this hotel"}><Link href="#overview">{id ? "Tentang hotel" : "Overview"}</Link><Link href="#rooms">{id ? "Kamar" : "Rooms"}</Link><Link href="#facilities">{id ? "Fasilitas" : "Facilities"}</Link><Link href="#booking">{id ? "Reservasi" : "Book your stay"}</Link></nav>

      {/* --- OVERVIEW --- */}
      <section id="overview" className="hotel-overview max-w-4xl mx-auto px-6 pt-12 pb-12 text-center">
        <h2 className="text-3xl font-bold text-neutral-900 mb-8">Welcome to {hotel.name}</h2>
        <p className="text-lg text-neutral-600 leading-relaxed md:leading-loose">
          {hotel.description || `Experience the best of Surabaya with ${hotel.name}. Enjoy modern amenities, strategic locations, and exceptional service.`}
        </p>
      </section>

      {/* --- ROOMS SLIDER SECTION --- */}
      <section id="rooms" className="page-width py-6 mb-20">
        <RoomCarousel rooms={rooms || []} tours={tours.filter(group => group.placement.type === 'room')} locale={params.locale}/>
        <Link href={`/${params.locale}/hotels/${hotel.slug}/rooms`} className="text-link">{id ? "Lihat semua tipe kamar" : "View all room types"}<ArrowRight size={17}/></Link>
      </section>

      <HotelTour groups={tours} locale={params.locale} />

      {/* --- DYNAMIC FACILITIES SECTION --- */}
      <section id="facilities" className="hotel-facilities page-width mb-12">
        <div className="bg-neutral-50 rounded-2xl p-8 md:p-12 border border-neutral-100 shadow-sm">
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 mb-4">Hotel Facilities</h2>
            <p className="text-neutral-600 text-lg">Enhance your stay with our premium facilities tailored for your needs.</p>
          </div>

          {/* Render Gallery Fasilitas di sini */}
          <FacilityGallery facilities={facilities || []} tours={tours.filter(group => group.placement.type === 'facility')} locale={params.locale}/>

        </div>
      </section>

    </main>
  );
}
