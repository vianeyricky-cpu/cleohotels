import { getHotels } from "@/actions/getHotels"; 
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Star } from "lucide-react";
import { createClient } from "@supabase/supabase-js"; // Tambahkan import supabase

export const dynamic = "force-dynamic";

export default async function HotelsIndexPage({ params }: { params: { locale: string } }) {
  const hotels = await getHotels();

  // Koneksi Supabase untuk mengambil data promo
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Ambil 3 Promo Terbaru
  const { data: promos } = await supabase.from("promos").select("*").order("created_at", { ascending: false }).limit(3);
  const safePromos = promos || []; 

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 pb-20 pt-[120px] relative overflow-hidden">
      
      {/* BACKGROUND DECORATION (Semua bernuansa Biru) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-50/80 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none z-0"></div>

      {/* --- 1. HEADER SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center relative z-10">
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

      {/* --- 2. LIST HOTELS --- */}
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
                
                {/* Footer Kartu */}
                <div className="mt-auto flex items-center justify-between">
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

      {/* --- 3. OFFERS & PACKAGES SECTION (Desain Baru Gambar 3) --- */}
      <section className="py-20 px-6 bg-white relative z-10 mb-16 rounded-[3rem] mx-4 max-w-7xl lg:mx-auto border border-neutral-100 shadow-sm">
        <div className="w-full mx-auto">
          {/* Header Offers & Packages */}
          <div className="mb-14 text-left border-b border-neutral-100 pb-8 px-4">
             <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-4 tracking-tight">Offers & Packages</h2>
             <p className="text-neutral-500 text-base md:text-lg max-w-3xl">
               Take advantage of our large variety of packages and special offers created by us and designed with your needs in mind.
             </p>
          </div>
          
          {/* Grid Layout Promo (Tanpa Border Card) */}
          <div className="grid md:grid-cols-3 gap-x-10 gap-y-12 px-4">
            {safePromos.length > 0 ? (
              safePromos.map((promo) => (
                <div key={promo.id} className="flex flex-col group">
                  {/* Gambar Promo dengan Sudut Lengkung */}
                  <div className="relative h-60 w-full mb-5 overflow-hidden rounded-[1.5rem]">
                    <Image 
                      src={promo.image_url || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80"} 
                      alt={promo.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  </div>
                  
                  {/* Teks Konten */}
                  <h3 className="text-[19px] font-extrabold text-neutral-900 mb-2 uppercase tracking-wide">
                    {promo.title}
                  </h3>
                  <p className="text-neutral-500 text-[15px] mb-6 flex-1 leading-relaxed">
                    {promo.description}
                  </p>
                  
                  {/* Tombol Outline Oval */}
                  <div>
                    <Link 
                      href={promo.action_link || "#"} 
                      className="inline-flex items-center justify-center px-7 py-2.5 border border-neutral-300 rounded-full text-xs font-bold text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-colors uppercase tracking-widest"
                    >
                      {promo.action_text || "SEE MORE"} &rarr;
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-neutral-400 italic col-span-3 py-10 px-4">Belum ada promo yang tersedia.</p>
            )}
          </div>
        </div>
      </section>

      {/* --- 4. READY TO EXPERIENCE CLEO BANNER --- */}
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