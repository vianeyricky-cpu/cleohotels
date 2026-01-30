import Image from "next/image";
import { notFound } from "next/navigation";
import { getHotelBySlug } from "@/actions"; // PERBAIKAN IMPORT: Ambil dari index actions
import { RoomCard } from "@/components/RoomCard"; 
import { 
  MapPin, Instagram, Star, Phone, Quote, CheckCircle
} from "lucide-react";

// Memastikan halaman ini selalu update datanya (tidak cache lama)
export const dynamic = "force-dynamic";

// --- DATA REVIEW DARI PDF (HARDCODED SESUAI SLUG) ---
const REVIEWS_BY_HOTEL: Record<string, { name: string; comment: string }[]> = {
  // Reviews untuk CLEO JEMURSARI
  "cleo-hotel-jemursari": [
    { name: "Budi Santoso", comment: "Pengalaman menginap yang sangat memuaskan dengan lokasi strategis dan akses transportasi yang mudah. Kebersihan kamar terjaga baik." },
    { name: "Siti Aminah", comment: "Hotelnya bagus, bersih, dan layanannya sangat memuaskan. Sangat direkomendasikan jika Anda berkunjung ke Surabaya." },
    { name: "Rahmat Hidayat", comment: "Lokasi strategis, check-in/out cepat. AC dingin dan air mandi hangat. Fasilitas kamar berada di atas standar." }
  ],
  // Reviews untuk CLEO WALIKOTA
  "cleo-hotel-walikota-mustajab": [
    { name: "Andi Wijaya", comment: "Sangat merekomendasikan hotel ini. Tempatnya strategis, nyaman, bersih, dan pelayanan ramah dengan harga terjangkau." },
    { name: "Dewi Sartika", comment: "Staf hotel sangat ramah, kamar sangat bersih, AC dingin, dan water heater bekerja dengan sangat baik." },
    { name: "Joko Susilo", comment: "Top markotop, AC dingin maksimal dan ruangan bersih. Lokasinya sangat strategis di pusat kota." }
  ],
  // Reviews untuk CLEO TUNJUNGAN
  "cleo-hotel-tunjungan": [
    { name: "Michael Tan", comment: "Sangat direkomendasikan. Staf ramah, pelayanan 24 jam, kamar bersih. Lokasi juara di depan mal Tunjungan Plaza." },
    { name: "Linda Kusuma", comment: "Lokasi hotel sangat menyenangkan karena tepat berseberangan dengan Tunjungan Plaza. Pelayanan sangat memuaskan." },
    { name: "Robert Lee", comment: "Benar-benar di depan TP, tinggal menyeberang. Staf sangat membantu bahkan membawakan koper langsung ke kamar." }
  ]
};

export default async function HotelDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  // Ambil data hotel dari database
  const hotel = await getHotelBySlug(params.slug);

  if (!hotel) {
    return notFound();
  }

  // Pilih Review berdasarkan Slug (Fallback ke Jemursari jika tidak ketemu)
  const hotelSlugKey = Object.keys(REVIEWS_BY_HOTEL).find(key => params.slug.includes(key.replace("cleo-hotel-", ""))) || "cleo-hotel-jemursari";
  const selectedReviews = REVIEWS_BY_HOTEL[params.slug] || REVIEWS_BY_HOTEL[hotelSlugKey] || REVIEWS_BY_HOTEL["cleo-hotel-jemursari"];

  // Fallback data jika kosong
  const heroImage = hotel.image_url || "/images/placeholder-hotel.jpg"; // Pastikan ada fallback image lokal atau url valid
  const mapsEmbed = hotel.maps_url;
  const mapsDirectLink = hotel.google_maps_link || `http://googleusercontent.com/maps.google.com/search?q=${encodeURIComponent(hotel.name + " Surabaya")}`;

  // Urutkan kamar dari harga termurah
  const sortedRooms = (hotel.rooms || []).sort((a, b) => (a.price || 0) - (b.price || 0));

  return (
    <main className="min-h-screen bg-navy-950 text-white pb-24 relative">
      
      {/* HERO SECTION */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src={heroImage} 
            alt={hotel.name} 
            fill 
            className="object-cover transition-transform duration-700 hover:scale-105" 
            priority 
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-20 pt-32">
          <div className="mx-auto max-w-7xl">
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <p className="mb-4 inline-block rounded-full border border-gold-400/30 bg-navy-950/30 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-gold-400 backdrop-blur-md">
                {hotel.tagline || "Premium Comfort"}
              </p>
              <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">{hotel.name}</h1>
              <div className="flex flex-col gap-4 text-sm font-medium text-white/80 md:flex-row md:items-center md:gap-8">
                {hotel.address && (
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gold-400" />
                        <span>{hotel.address}</span>
                    </div>
                )}
                <div className="hidden h-1 w-1 rounded-full bg-gold-400 md:block" />
                <a href="https://www.instagram.com/cleohotels/" target="_blank" className="flex items-center gap-2 hover:text-gold-400">
                    <Instagram className="h-4 w-4 text-gold-400" />
                    <span>@cleohotels</span>
                </a>
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
            <h2 className="mt-4 text-3xl font-bold leading-snug md:text-4xl">
                Discover a new level of <br /><span className="text-gold-400 italic">luxury & comfort.</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-300 whitespace-pre-wrap">{hotel.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Tampilkan gambar fasilitas jika ada, jika tidak tampilkan placeholder */}
            <div className="relative h-64 overflow-hidden rounded-2xl bg-navy-800 translate-y-8 border border-white/5 shadow-2xl">
               {hotel.facilities && hotel.facilities[0]?.image ? (
                   <Image src={hotel.facilities[0].image} alt="Fasilitas 1" fill className="object-cover" unoptimized/>
               ) : (
                   <div className="flex h-full items-center justify-center text-gold-500/20"><Star size={48}/></div>
               )}
            </div>
            <div className="relative h-64 overflow-hidden rounded-2xl bg-navy-800 border border-white/5 shadow-2xl">
               {hotel.facilities && hotel.facilities[1]?.image ? (
                   <Image src={hotel.facilities[1].image} alt="Fasilitas 2" fill className="object-cover" unoptimized/>
               ) : (
                   <div className="flex h-full items-center justify-center text-gold-500/20"><Star size={48}/></div>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* ROOMS */}
      <section id="rooms" className="bg-navy-900 py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-500">Accommodations</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Rooms & Suites</h2>
          </div>
          
          {sortedRooms.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {sortedRooms.map((room) => (<RoomCard key={room.id} room={room} />))}
            </div>
          ) : (
             <div className="text-center py-12 border border-dashed border-gray-700 rounded-xl text-gray-500">
                 No rooms available at the moment.
             </div>
          )}
        </div>
      </section>

      {/* FACILITIES */}
      {hotel.facilities && hotel.facilities.length > 0 && (
        <section id="facilities" className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-12 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-500">Amenities</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Hotel Facilities</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {hotel.facilities.map((facility) => (
              <div key={facility.id} className="group flex flex-col items-center rounded-2xl border border-white/5 bg-navy-900/40 p-8 text-center transition hover:border-gold-500/30 hover:bg-navy-900">
                 <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-800 text-gold-400 group-hover:bg-gold-500 group-hover:text-navy-950 transition">
                    {facility.image ? (
                        <div className="relative h-full w-full rounded-full overflow-hidden">
                            <Image src={facility.image} alt={facility.name} fill className="object-cover"/>
                        </div>
                    ) : (
                        <CheckCircle className="h-8 w-8" />
                    )}
                 </div>
                 <h3 className="mb-2 text-lg font-bold text-white">{facility.name}</h3>
                 <p className="text-xs uppercase tracking-widest text-gold-500/70 mb-2">{facility.type || "Facility"}</p>
                 <p className="text-sm text-gray-400 line-clamp-2">{facility.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* REVIEWS SECTION */}
      <section className="bg-navy-950 py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6">
           <div className="text-center mb-16">
              <span className="text-gold-500 font-bold tracking-widest text-xs uppercase">Guest Stories</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">What Our Guests Say</h2>
           </div>
           <div className="grid md:grid-cols-3 gap-8">
              {selectedReviews.map((review, idx) => (
                 <div key={idx} className="bg-navy-900 p-8 rounded-2xl border border-white/5 relative hover:border-gold-500/20 transition group">
                    <Quote className="text-gold-500 mb-4 h-8 w-8 opacity-30 group-hover:opacity-100 transition" />
                    <p className="text-gray-300 italic mb-6 leading-relaxed min-h-[80px]">"{review.comment}"</p>
                    <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                       <div className="h-10 w-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 font-bold">
                          {review.name.charAt(0)}
                       </div>
                       <div>
                          <p className="font-bold text-white text-sm">{review.name}</p>
                          <div className="flex text-gold-400 gap-0.5">
                              {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor"/>)}
                          </div>
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
                <a href={mapsDirectLink} target="_blank" className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-bold text-navy-950 hover:bg-gold-400 transition hover:scale-105">
                    <MapPin className="h-5 w-5" />Get Directions
                </a>
                <a href={`tel:${hotel.phone}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-bold text-white hover:bg-white/10">
                    <Phone className="h-5 w-5" />{hotel.phone}
                </a>
              </div>
            </div>
            <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-gold-500/30 shadow-2xl bg-navy-800">
               {mapsEmbed ? (
                   <iframe src={mapsEmbed} width="100%" height="100%" style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(90%)" }} allowFullScreen loading="lazy" className="absolute inset-0"/>
               ) : (
                   <div className="flex h-full items-center justify-center text-gray-500"><MapPin size={48} className="opacity-50"/></div>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* STICKY BAR (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-navy-950/90 px-6 py-4 backdrop-blur-lg md:hidden">
         <div className="flex items-center justify-between">
            <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Starting from</p>
                <p className="text-lg font-bold text-gold-400">
                    {sortedRooms[0]?.price 
                        ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(sortedRooms[0].price) 
                        : "Best Rate"}
                </p>
            </div>
            <a href="#rooms" className="rounded-full bg-gold-500 px-6 py-2.5 text-sm font-bold text-navy-950">Book Now</a>
         </div>
      </div>
    </main>
  );
}