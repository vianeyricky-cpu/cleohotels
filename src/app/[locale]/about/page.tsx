import Image from "next/image";
import { ShieldCheck, Heart, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-navy-950 text-white pb-24">
      
      {/* HERO SECTION */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070" 
            alt="About Cleo Hotels" 
            fill 
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-black/40" />
        </div>
        <div className="relative z-10 text-center max-w-4xl px-6 mt-16">
          <span className="text-gold-400 font-bold tracking-[0.3em] uppercase mb-4 block animate-fade-in-up">
            Our Story
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up delay-100">
            Managed by <br/><span className="text-gold-500 italic">Tanly Hospitality</span>
          </h1>
        </div>
      </section>

      {/* BRAND PROFILE & VISION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Touching Guests' Hearts</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              [cite_start]Cleo Hotels is a proud part of <strong>Tanly Hospitality</strong>, a prestigious management group affiliated with 5-star properties like Vasa Hotel and Solaris Hotel[cite: 4].
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              [cite_start]Our vision is simple yet profound: to provide experiences that touch the hearts of our guests while delivering high value to our partners[cite: 5]. We believe in smart comfort for every journey.
            </p>
            
            <div className="flex items-center gap-4">
              <div className="px-6 py-3 border border-gold-500 rounded-full text-gold-400 font-bold tracking-widest uppercase text-sm">
                [cite_start]#EnjoyLife [cite: 6]
              </div>
            </div>
          </div>
          
          <div className="relative h-[400px] rounded-2xl overflow-hidden border border-white/10">
             <Image 
               src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000" 
               alt="Tanly Hospitality" 
               fill 
               className="object-cover"
             />
          </div>
        </div>
      </section>

      {/* OUR HOTELS SUMMARY */}
      <section className="bg-navy-900 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Unique Collections</h2>
            <p className="text-gray-400">Each Cleo Hotel offers a distinct experience tailored to your needs.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Jemursari */}
            <div className="bg-navy-950 p-8 rounded-2xl border border-white/5 hover:border-gold-500/30 transition">
              <Sparkles className="text-gold-500 mb-6 h-10 w-10" />
              <h3 className="text-2xl font-bold mb-2">Cleo Jemursari</h3>
              [cite_start]<p className="text-gold-400 text-xs font-bold tracking-widest uppercase mb-4">Business & Transit Hub [cite: 8]</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Designed for maximum efficiency with 112 rooms. [cite_start]Ideal for business travelers and airport transit due to its strategic location[cite: 9, 12].
              </p>
            </div>

            {/* Walikota */}
            <div className="bg-navy-950 p-8 rounded-2xl border border-white/5 hover:border-gold-500/30 transition">
              <ShieldCheck className="text-gold-500 mb-6 h-10 w-10" />
              <h3 className="text-2xl font-bold mb-2">Cleo Walikota</h3>
              [cite_start]<p className="text-gold-400 text-xs font-bold tracking-widest uppercase mb-4">Heritage & Civic Center [cite: 29]</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Located in the government and culinary center of Surabaya. [cite_start]Perfect for official visits and enjoying legendary local cuisine[cite: 31].
              </p>
            </div>

            {/* Tunjungan */}
            <div className="bg-navy-950 p-8 rounded-2xl border border-white/5 hover:border-gold-500/30 transition">
              <Heart className="text-gold-500 mb-6 h-10 w-10" />
              <h3 className="text-2xl font-bold mb-2">Cleo Tunjungan</h3>
              [cite_start]<p className="text-gold-400 text-xs font-bold tracking-widest uppercase mb-4">Lifestyle & Shopping [cite: 48]</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                An urban lifestyle hotel located right across Tunjungan Plaza. [cite_start]The ultimate choice for shopping and city leisure[cite: 49].
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}