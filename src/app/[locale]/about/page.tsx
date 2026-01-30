import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Award, Users, Heart } from "lucide-react";

export const metadata = {
  title: "About Us - Cleo Hotels",
  description: "Learn more about Cleo Hotels by Tanly Hospitality. Smart comfort for every journey in Surabaya.",
};

export default function AboutPage({ params }: { params: { locale: string } }) {
  return (
    <main className="min-h-screen bg-navy-950 text-white pt-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <div className="container mx-auto px-6 mb-20 text-center">
        <p className="text-gold-500 font-bold tracking-[0.2em] text-xs uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          Managed by Tanly Hospitality
        </p>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Smart Comfort for <br/> <span className="text-gold-400 italic">Every Journey</span>
        </h1>
        <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Cleo Hotels is designed for modern travelers who value efficiency without compromising comfort. 
          Whether you are in Surabaya for business or leisure, we provide a seamless stay experience 
          that touches your heart. #EnjoyLife
        </p>
      </div>

      {/* 2. IMAGE SHOWCASE */}
      <div className="container mx-auto px-6 mb-24">
        <div className="grid md:grid-cols-12 gap-4 h-[500px]">
          {/* Gambar Besar Kiri */}
          <div className="md:col-span-8 relative rounded-2xl overflow-hidden group">
            <Image 
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070" 
              alt="Cleo Hotel Interior" 
              fill 
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent flex items-end p-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Modern Aesthetic</h3>
                <p className="text-gray-300">Stylish interiors designed for your visual comfort.</p>
              </div>
            </div>
          </div>
          
          {/* Kolom Kanan (2 Gambar Kecil) */}
          <div className="md:col-span-4 flex flex-col gap-4">
             <div className="relative flex-1 rounded-2xl overflow-hidden group">
                <Image 
                  src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070" 
                  alt="Cleo Hotel Room" 
                  fill 
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
             </div>
             <div className="relative flex-1 rounded-2xl overflow-hidden group">
                <Image 
                  src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070" 
                  alt="Cleo Hotel Dining" 
                  fill 
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
             </div>
          </div>
        </div>
      </div>

      {/* 3. OUR VALUES (FILOSOFI) */}
      <div className="bg-navy-900 py-20 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Cleo?</h2>
            <div className="h-1 w-20 bg-gold-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
             {/* Value 1 */}
             <div className="text-center group p-6 rounded-2xl transition hover:bg-white/5">
                <div className="mx-auto w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center text-gold-500 mb-6 group-hover:scale-110 transition duration-300 shadow-lg shadow-black/20">
                   <Award size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Excellence in Service</h3>
                <p className="text-gray-400 leading-relaxed">
                   Managed by Tanly Hospitality, we uphold the highest standards of service to ensure every guest feels valued and cared for.
                </p>
             </div>

             {/* Value 2 */}
             <div className="text-center group p-6 rounded-2xl transition hover:bg-white/5">
                <div className="mx-auto w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center text-gold-500 mb-6 group-hover:scale-110 transition duration-300 shadow-lg shadow-black/20">
                   <Users size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Guest-Centric Approach</h3>
                <p className="text-gray-400 leading-relaxed">
                   "Touching guests' hearts" is our motto. We go beyond transactional service to build genuine connections with you.
                </p>
             </div>

             {/* Value 3 */}
             <div className="text-center group p-6 rounded-2xl transition hover:bg-white/5">
                <div className="mx-auto w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center text-gold-500 mb-6 group-hover:scale-110 transition duration-300 shadow-lg shadow-black/20">
                   <Heart size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Strategic Locations</h3>
                <p className="text-gray-400 leading-relaxed">
                   Situated in Surabaya's prime districts—Jemursari, Walikota Mustajab, and Tunjungan—giving you easy access to business and leisure hubs.
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* 4. BRAND STORY / TANLY HOSPITALITY */}
      <div className="container mx-auto px-6 py-24">
         <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
               <div className="relative">
                  <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-gold-500 rounded-tl-3xl z-0"></div>
                  <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                     <Image 
                       src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664" 
                       alt="Tanly Hospitality Team" 
                       width={600} 
                       height={400}
                       className="object-cover"
                     />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-gold-500 rounded-br-3xl z-0"></div>
               </div>
            </div>
            
            <div className="lg:w-1/2">
               <p className="text-gold-500 font-bold tracking-widest text-xs uppercase mb-2">Our Parent Company</p>
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Tanly Hospitality</h2>
               <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
                  <p>
                    Cleo Hotels is proud to be part of <strong>Tanly Hospitality</strong>, a visionary group dedicated to redefining the hospitality landscape in Indonesia.
                  </p>
                  <p>
                    With a diverse portfolio that includes 5-star luxury hotels (Vasa Hotel), 4-star business hotels (Solaris), and our smart-business brand (Cleo), Tanly Hospitality is committed to delivering <span className="text-white font-bold">"Experiences that Touch Your Heart"</span>.
                  </p>
                  <p>
                    We believe that a great hotel is more than just a place to sleep; it's a place where memories are made, business is conducted smoothly, and life is enjoyed to the fullest.
                  </p>
               </div>
               
               <div className="mt-8 flex flex-wrap gap-4">
                  <Badge text="Vasa Hotel Surabaya" />
                  <Badge text="Solaris Hotel" />
                  <Badge text="Cleo Hotels" />
                  <Badge text="Tanly Property" />
               </div>
            </div>
         </div>
      </div>

      {/* 5. CTA SECTION */}
      <div className="container mx-auto px-6 mb-10">
         <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-3xl p-12 text-center border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
            
            <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Ready to Experience Cleo?</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto relative z-10">
               Discover our locations across Surabaya and book your stay with the best rates directly through our website.
            </p>
            <Link 
               href={`/${params.locale}/hotels`}
               className="inline-block rounded-full bg-gold-500 px-10 py-4 text-navy-950 font-bold hover:bg-white transition relative z-10 shadow-lg shadow-gold-500/20"
            >
               Explore Our Hotels
            </Link>
         </div>
      </div>

    </main>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
       <CheckCircle size={14} className="text-gold-500" />
       {text}
    </div>
  )
}