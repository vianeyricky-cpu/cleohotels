import { getHotels } from "@/actions/getHotels"; 
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HotelsIndexPage({ params }: { params: { locale: string } }) {
  const hotels = await getHotels();

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 pb-20 pt-[120px] relative overflow-hidden">
      
      {/* BACKGROUND DECORATION (Semua bernuansa Biru) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-50/80 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none z-0"></div>

      {/* --- 1. HEADER SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center relative z-10">
        {/* Warna teks diubah menjadi Biru Logo */}
        <p className="text-[#1a56db] font-bold tracking-[0.2em] text-xs uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          Our Collections
        </p>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Discover Cleo Locations
        </h1>
        
        <p className="text-neutral-600 max-w-2xl mx-auto text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Choose the perfect location for your stay in Surabaya. Each Cleo Hotel offers a unique experience, 
          combining <span className="text-neutral-900 font-semibold italic">smart comfort</span> with strategic convenience.
        </p>
      </div>

      {/* --- 2. LIST HOTELS (Teks & Bintang Biru) --- */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 mb-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel, index) => (
            <Link 
              key={hotel.id} 
              href={`/${params.locale}/hotels/${hotel.slug}`}
              className="group flex flex-col overflow-hidden rounded-[2rem] bg-white border border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-300 hover:shadow-xl hover:border-[#1a56db]/30 hover:-translate-y-2"
            >
              {/* Gambar Hotel */}
              <div className="relative h-60 w-full overflow-hidden bg-neutral-100">
                {hotel.image_url ? (
                  <Image
                    src={hotel.image_url}
                    alt={hotel.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-neutral-400">
                    No Image Available
                  </div>
                )}
              </div>

              {/* Konten Detail Hotel */}
              <div className="flex flex-1 flex-col p-6 md:p-8">
                
                {/* Tagline diubah menjadi Biru */}
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#1a56db] mb-2">
                  {hotel.tagline || "Business & Leisure"}
                </p>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4 group-hover:text-[#1a56db] transition-colors">
                  {hotel.name}
                </h2>

                {/* Lokasi / Address */}
                <div className="flex items-start gap-3 text-neutral-500 text-sm mb-5 border-b border-neutral-100 pb-5">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-neutral-400" />
                  <span className="line-clamp-2 leading-relaxed">{hotel.address}</span>
                </div>
                
                {/* Deskripsi */}
                <p className="text-neutral-600 text-sm line-clamp-3 mb-8 flex-1 leading-relaxed">
                  {hotel.description}
                </p>
                
                {/* Footer Kartu (Bintang Biru & Tombol Biru) */}
                <div className="mt-auto flex items-center justify-between">
                  {/* Warna bintang diubah menjadi Biru */}
                  <div className="flex text-[#1a56db] gap-1">
                     {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" stroke="none" />)}
                  </div>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-[#1a56db] group-hover:text-blue-800 uppercase tracking-widest transition-colors">
                    View Details <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* --- 3. READY TO EXPERIENCE CLEO BANNER --- */}
      <section className="px-6 relative z-10">
        <div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-white to-[#f4f7ff] border border-blue-50/50 rounded-[2.5rem] p-12 md:p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          {/* Efek Cahaya Halus */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl z-0 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl z-0 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-neutral-900 mb-6 tracking-tight">
              Ready to Experience Cleo?
            </h2>
            <p className="text-neutral-600 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Discover our locations across Surabaya and book your stay with the best rates directly through our website.
            </p>
            {/* Tombol Biru Solid */}
            <Link 
              href={`/${params.locale}/hotels`} 
              className="inline-block bg-[#1a56db] text-white font-bold px-10 py-4 rounded-full hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300 uppercase tracking-widest text-sm"
            >
              Explore Our Hotels
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}