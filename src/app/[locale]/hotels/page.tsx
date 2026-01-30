import { getHotels } from "@/actions"; 
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HotelsIndexPage({ params }: { params: { locale: string } }) {
  const hotels = await getHotels();

  return (
    <main className="min-h-screen bg-navy-950 text-white pb-20 pt-24 relative overflow-hidden">
      
      {/* BACKGROUND DECORATION (Agar tidak terlalu polos) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      {/* HEADER */}
      <div className="container mx-auto px-6 mb-16 text-center relative z-10">
        <p className="text-gold-500 font-bold tracking-[0.2em] text-xs uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          Our Collections
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          Explore Our Hotels
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700">
          Choose the perfect location for your stay in Surabaya. Each Cleo Hotel offers a unique experience, 
          combining <span className="text-gold-400 italic">smart comfort</span> with strategic convenience.
        </p>
      </div>

      {/* LIST HOTELS */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel, index) => (
            <Link 
              key={hotel.id} 
              href={`/${params.locale}/hotels/${hotel.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-navy-900 border border-white/5 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-gold-500/30 hover:-translate-y-2"
            >
              {/* Image Wrapper */}
              <div className="relative h-72 w-full overflow-hidden">
                {hotel.image_url ? (
                  <Image
                    src={hotel.image_url}
                    alt={hotel.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-navy-800 text-gray-500">
                    No Image Available
                  </div>
                )}
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity"></div>
                
                {/* Badge Tagline di atas gambar */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                   <p className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-2">
                      {hotel.tagline || "Business & Leisure"}
                   </p>
                   <h2 className="text-2xl font-bold text-white group-hover:text-gold-200 transition">
                      {hotel.name}
                   </h2>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6 pt-4">
                <div className="flex items-start gap-2 text-gray-400 text-sm mb-4 border-b border-white/5 pb-4">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-gold-500" />
                  <span className="line-clamp-2">{hotel.address}</span>
                </div>
                
                <p className="text-gray-300 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                  {hotel.description}
                </p>
                
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex text-gold-500 gap-0.5">
                     {[...Array(3)].map((_, i) => <Star key={i} size={12} fill="currentColor"/>)}
                  </div>
                  <span className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-gold-400 transition">
                    View Details <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}