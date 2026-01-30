import Image from "next/image";
import { getHotelBySlug } from "@/actions/getHotels";
import { notFound } from "next/navigation";
import { RoomCard } from "@/components/RoomCard"; 
import { 
  MapPin, Instagram, Star, Phone, ArrowRight, Quote
} from "lucide-react";

// --- DATA REVIEW DARI PDF (HARDCODED SESUAI SLUG) ---
const REVIEWS_BY_HOTEL: Record<string, { name: string; comment: string }[]> = {
  // Reviews untuk CLEO JEMURSARI [cite: 20, 22, 25]
  "cleo-hotel-jemursari": [
    { name: "Guest Review", comment: "Pengalaman menginap yang sangat memuaskan dengan lokasi strategis dan akses transportasi yang mudah. Kebersihan kamar terjaga baik." },
    { name: "Guest Review", comment: "Hotelnya bagus, bersih, dan layanannya sangat memuaskan. Sangat direkomendasikan jika Anda berkunjung ke Surabaya." },
    { name: "Guest Review", comment: "Lokasi strategis, check-in/out cepat. AC dingin dan air mandi hangat. Fasilitas kamar berada di atas standar." }
  ],
  // Reviews untuk CLEO WALIKOTA [cite: 43, 44, 45]
  "cleo-hotel-walikota-mustajab": [
    { name: "Guest Review", comment: "Sangat merekomendasikan hotel ini. Tempatnya strategis, nyaman, bersih, dan pelayanan ramah dengan harga terjangkau." },
    { name: "Guest Review", comment: "Staf hotel sangat ramah, kamar sangat bersih, AC dingin, dan water heater bekerja dengan sangat baik." },
    { name: "Guest Review", comment: "Top markotop, AC dingin maksimal dan ruangan bersih. Lokasinya sangat strategis di pusat kota." }
  ],
  // Reviews untuk CLEO TUNJUNGAN [cite: 62, 63, 65]
  "cleo-hotel-tunjungan": [
    { name: "Guest Review", comment: "Sangat direkomendasikan. Staf ramah, pelayanan 24 jam, kamar bersih. Lokasi juara di depan mal Tunjungan Plaza." },
    { name: "Guest Review", comment: "Lokasi hotel sangat menyenangkan karena tepat berseberangan dengan Tunjungan Plaza. Pelayanan sangat memuaskan." },
    { name: "Guest Review", comment: "Benar-benar di depan TP, tinggal menyeberang. Staf sangat membantu bahkan membawakan koper langsung ke kamar." }
  ]
};

export default async function HotelDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const hotel = await getHotelBySlug(params.slug);

  if (!hotel) {
    notFound();
  }

  // Pilih Review berdasarkan Slug (Default ke Jemursari jika slug tidak cocok)
  // Kita pakai "includes" untuk jaga-jaga kalau slug di db agak beda dikit
  const hotelSlugKey = Object.keys(REVIEWS_BY_HOTEL).find(key => params.slug.includes(key.replace("cleo-hotel-", ""))) || "cleo-hotel-jemursari";
  const selectedReviews = REVIEWS_BY_HOTEL[params.slug] || REVIEWS_BY_HOTEL[hotelSlugKey] || REVIEWS_BY_HOTEL["cleo-hotel-jemursari"];

  const heroImage = hotel.image_url || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=3270";
  const mapsEmbed = hotel.maps_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.380728669524!2d112.74868431477543!3d-7.311092994723485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fb91f0450001%3A0x133d354b9c734919!2sCleo%20Hotel%20Jemursari!5e0!3m2!1sen!2sid!4v1625633456789!5m2!1sen!2sid";
  const mapsDirectLink = hotel.google_maps_link || "https://www.google.com/maps";

  return (
    <main className="min-h-screen bg-navy-950 text-white pb-24 relative">
      
      {/* HERO SECTION */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image src={heroImage} alt={hotel.name} fill className="object-cover transition-transform duration-700 hover:scale-105" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-20 pt-32">
          <div className="mx-auto max-w-7xl">
            <div className="animate-fade-in-up">
              <p className="mb-4 inline-block rounded-full border border-gold-400/30 bg-navy-950/30 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-gold-400 backdrop-blur-md">
                {hotel.tagline}
              </p>
              <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl lg:text-8xl">{hotel.name}</h1>
              <div className="flex flex-col gap-4 text-sm font-medium text-white/80 md:flex-row md:items-center md:gap-8">
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold-400" /><span>{hotel.address}</span></div>
                <div className="hidden h-1 w-1 rounded-full bg-gold-400 md:block" />
                <a href="https://www.instagram.com/cleohotels/" target="_blank" className="flex items-center gap-2 hover:text-gold-400"><Instagram className="h-4 w-4 text-gold-400" /><span>@cleohotels</span></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold-500">The Experience</span>
            <h2 className="mt-4 text-3xl font-bold leading-snug md:text-4xl">Discover a new level of <br /><span className="text-gold-400 italic">luxury & comfort.</span></h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-300">{hotel.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-64 overflow-hidden rounded-2xl bg-navy-800 translate-y-8">
               {hotel.facilities[0]?.image ? <Image src={hotel.facilities[0].image} alt="Fasilitas" fill className="object-cover" unoptimized/> : <div className="h-full bg-navy-800"/>}
            </div>
            <div className="relative h-64 overflow-hidden rounded-2xl bg-navy-800">
               {hotel.facilities[1]?.image ? <Image src={hotel.facilities[1].image} alt="Fasilitas" fill className="object-cover" unoptimized/> : <div className="h-full bg-navy-800"/>}
            </div>
          </div>
        </div>
      </section>

      {/* ROOMS */}
      <section id="rooms" className="bg-navy-900 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12"><p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-500">Accommodations</p><h2 className="mt-3 text-3xl font-bold md:text-4xl">Rooms & Suites</h2></div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {hotel.rooms.map((room) => (<RoomCard key={room.id} room={room} />))}
          </div>
        </div>
      </section>

      {/* FACILITIES */}
      <section id="facilities" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 text-center"><p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-500">Amenities</p><h2 className="mt-3 text-3xl font-bold md:text-4xl">Hotel Facilities</h2></div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {hotel.facilities.map((facility) => (
            <div key={facility.id} className="group flex flex-col items-center rounded-2xl border border-white/5 bg-navy-900/40 p-8 text-center transition hover:border-gold-500/30 hover:bg-navy-900">
               <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-800 text-gold-400 group-hover:bg-gold-500 transition"><Star className="h-8 w-8" /></div>
               <h3 className="mb-2 text-lg font-bold text-white">{facility.name}</h3><p className="text-xs uppercase tracking-widest text-gold-500/70 mb-2">{facility.type}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- REVIEWS SECTION (BARU DITAMBAHKAN) --- */}
      <section className="bg-navy-950 py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6">
           <div className="text-center mb-16">
              <span className="text-gold-500 font-bold tracking-widest text-xs uppercase">Guest Stories</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">What Our Guests Say</h2>
           </div>
           <div className="grid md:grid-cols-3 gap-8">
              {selectedReviews.map((review, idx) => (
                 <div key={idx} className="bg-navy-900 p-8 rounded-2xl border border-white/5 relative">
                    <Quote className="text-gold-500 mb-4 h-8 w-8 opacity-50" />
                    <p className="text-gray-300 italic mb-6 leading-relaxed">"{review.comment}"</p>
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 font-bold">
                          {review.name.charAt(0)}
                       </div>
                       <div>
                          <p className="font-bold text-white text-sm">{review.name}</p>
                          <div className="flex text-gold-400"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/></div>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* LOCATION */}
      <section id="location" className="relative bg-navy-900 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-500">Location</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Prime Location in <br/> Surabaya</h2>
              <p className="mt-6 text-lg text-gray-300">{hotel.address}</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a href={mapsDirectLink} target="_blank" className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-bold text-navy-950 hover:bg-gold-400"><MapPin className="h-5 w-5" />Get Directions</a>
                <a href={`tel:${hotel.phone}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-bold text-white hover:bg-white/10"><Phone className="h-5 w-5" />{hotel.phone}</a>
              </div>
            </div>
            <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-gold-500/30 shadow-2xl bg-navy-800">
              <iframe src={mapsEmbed} width="100%" height="100%" style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(90%)" }} allowFullScreen loading="lazy" className="absolute inset-0"/>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-navy-950/90 px-6 py-4 backdrop-blur-lg">
         <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="hidden md:block"><p className="text-xs uppercase tracking-widest text-gray-400">Ready to stay?</p><p className="text-lg font-bold text-white">Book at {hotel.name}</p></div>
            <div className="flex gap-4"><button className="rounded-full bg-gold-500 px-8 py-3 text-sm font-bold text-navy-950">Book Now</button></div>
         </div>
      </div>
    </main>
  );
}