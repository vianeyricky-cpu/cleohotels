import Image from "next/image";
import Link from "next/link";
import { getHotels } from "@/actions/getHotels"; 
import { ArrowRight, Star, ShieldCheck, Heart } from "lucide-react";

export default async function HomePage({ params }: { params: { locale: string } }) {
  const hotels = await getHotels();

  return (
    <main className="min-h-screen bg-navy-950 text-white">
      
      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=3270" 
            alt="Cleo Hotels Hero" 
            fill 
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-black/30" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <p className="text-gold-400 font-bold tracking-[0.3em] uppercase mb-4 text-sm animate-fade-in-up">
            Managed by Tanly Hospitality
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up delay-100">
            Smart Comfort for <br/> <span className="text-gold-500 italic">Every Journey</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Providing experiences that touch guests' hearts. Whether for business or leisure, discover your perfect stay in Surabaya.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Link href="#hotels" className="px-8 py-4 bg-gold-500 text-navy-950 font-bold rounded-full hover:bg-gold-400 transition transform hover:scale-105">
              Explore Our Hotels
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US (DATA DARI PDF) */}
      <section className="py-24 px-6 bg-navy-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <span className="text-gold-500 font-bold tracking-widest text-xs uppercase">Our Values</span>
             <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">#EnjoyLife with Cleo</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-navy-950 border border-white/5 hover:border-gold-500/30 transition group">
              <div className="w-14 h-14 bg-navy-800 rounded-full flex items-center justify-center mb-6 text-gold-500 group-hover:bg-gold-500 group-hover:text-navy-950 transition">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Touching Hearts</h3>
              <p className="text-gray-400 text-sm">Our mission is to provide experiences that genuinely touch the hearts of our guests through thoughtful service.</p>
            </div>
            <div className="p-8 rounded-2xl bg-navy-950 border border-white/5 hover:border-gold-500/30 transition group">
              <div className="w-14 h-14 bg-navy-800 rounded-full flex items-center justify-center mb-6 text-gold-500 group-hover:bg-gold-500 group-hover:text-navy-950 transition">
                <Star size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">High Value</h3>
              <p className="text-gray-400 text-sm">Smart comfort combined with strategic locations, offering exceptional value for business and transit travelers.</p>
            </div>
            <div className="p-8 rounded-2xl bg-navy-950 border border-white/5 hover:border-gold-500/30 transition group">
              <div className="w-14 h-14 bg-navy-800 rounded-full flex items-center justify-center mb-6 text-gold-500 group-hover:bg-gold-500 group-hover:text-navy-950 transition">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Trusted Management</h3>
              <p className="text-gray-400 text-sm">Proudly managed by Tanly Hospitality, affiliated with Vasa Hotel & Solaris, ensuring quality standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOTELS LIST */}
      <section id="hotels" className="py-24 px-6 bg-navy-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Locations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <Link href={`/en/hotels/${hotel.slug}`} key={hotel.id} className="group relative block h-[400px] overflow-hidden rounded-2xl">
                <Image
                  src={hotel.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000"}
                  alt={hotel.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-0 p-8 w-full">
                  <p className="text-gold-400 text-xs font-bold tracking-widest uppercase mb-2">{hotel.tagline}</p>
                  <h3 className="text-2xl font-bold text-white mb-2">{hotel.name}</h3>
                  <div className="flex items-center text-white/80 text-sm gap-2">
                    <span>Explore Hotel</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}