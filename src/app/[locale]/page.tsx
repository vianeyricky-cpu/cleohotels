import Image from "next/image";
import Link from "next/link";
import { getHotels } from "@/actions/getHotels"; 
import { ArrowRight, Star, ShieldCheck, Heart } from "lucide-react"; 
import { BookingWidget } from "@/components/public/BookingWidget";
import { createClient } from "@supabase/supabase-js"; 
import { PromoModal } from "@/components/PromoModal"; 
export const dynamic = 'force-dynamic';

export default async function HomePage({ params }: { params: { locale: string } }) {
  const hotels = await getHotels();

  // Koneksi Supabase Server-Side
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // 1. Ambil Gambar Hero Dinamis
  const { data: setting } = await supabase.from('settings').select('value').eq('key', 'hero_image').maybeSingle();
  const heroImage = setting?.value || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=3270";

  // 2. Ambil Data Popup Promo yang Aktif
  const { data: promoPopupData } = await supabase
    .from("PromoPopup")
    .select("*")
    .eq("is_active", true)
    .maybeSingle();

  // 3. Ambil 3 Promo/Offers Terbaru untuk Section Card
  const { data: promos } = await supabase.from("promos").select("*").order("created_at", { ascending: false }).limit(3);
  const safePromos = promos || []; 

  return (
    <main className="min-h-screen bg-white text-neutral-900 pt-[60px]">
      
      {/* --- POPUP DIPASANG DI SINI --- */}
      <PromoModal promo={promoPopupData} />

      {/* --- 1. HERO BANNER SECTION --- */}
      <section className="relative h-[65vh] md:h-[80vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden bg-neutral-100">
        <div className="absolute inset-0 z-0">
          <Image 
            src={heroImage} 
            alt="Cleo Hotels Hero Promo" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/10" /> 
        </div>
      </section>

      {/* --- 2. FLOATING DARK BOOKING BAR SECTION --- */}
      <section className="relative z-20 w-full max-w-6xl mx-auto px-4 -mt-20 md:-mt-24 mb-16">
        <BookingWidget />
      </section>

      {/* --- 3. TEKS INTRODUKSI --- */}
      <section className="py-12 px-6 bg-white text-center max-w-4xl mx-auto">
         <h2 className="text-3xl md:text-5xl font-bold mb-6 text-neutral-900">
           Smart Comfort for Every Journey
         </h2>
         <p className="text-base md:text-lg text-neutral-600 mb-6 leading-relaxed">
           Cleo Hotels is made for modern travelers who value efficiency, comfort, and great value. 
           Whether you're in Surabaya for business or leisure, enjoy a simple, convenient stay in a strategic city location.
         </p>
         <p className="text-lg font-bold text-neutral-900 mb-2">Smart choice. Easy stay.</p>
         <p className="text-xl font-extrabold text-blue-700">#EnjoyLife</p>
      </section>

      {/* --- 4. OUR VALUES SECTION (DIKEMBALIKAN / TIDAK DIHAPUS) --- */}
      <section className="py-20 px-6 bg-neutral-50 border-t border-neutral-100">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <span className="text-blue-600 font-bold tracking-widest text-xs uppercase">Our Values</span>
             <h2 className="text-3xl md:text-4xl font-bold mt-2 text-neutral-900">#EnjoyLife with Cleo</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[1.5rem] bg-white border border-neutral-200 shadow-sm hover:shadow-xl hover:border-blue-600/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900">Touching Hearts</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">Our mission is to provide experiences that genuinely touch the hearts of our guests through thoughtful service.</p>
            </div>
            <div className="p-8 rounded-[1.5rem] bg-white border border-neutral-200 shadow-sm hover:shadow-xl hover:border-blue-600/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Star size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900">High Value</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">Smart comfort combined with strategic locations, offering exceptional value for business and transit travelers.</p>
            </div>
            <div className="p-8 rounded-[1.5rem] bg-white border border-neutral-200 shadow-sm hover:shadow-xl hover:border-blue-600/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900">Trusted Management</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">Proudly managed by Tanly Hospitality, affiliated with Vasa Hotel & Solaris, ensuring quality standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. OFFERS & PACKAGES SECTION (DESAIN BARU) --- */}
      <section className="py-20 px-6 bg-white border-t border-neutral-100">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header Offers & Packages */}
          <div className="mb-14 text-left">
             <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-4 tracking-tight">Offers & Packages</h2>
             <p className="text-neutral-500 text-base md:text-lg max-w-3xl">
               Take advantage of our large variety of packages and special offers created by us and designed with your needs in mind.
             </p>
          </div>
          
          {/* Grid Layout Promo (Tanpa Border Card) */}
          <div className="grid md:grid-cols-3 gap-x-10 gap-y-12">
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
              <p className="text-neutral-400 italic col-span-3 py-10">Belum ada promo yang tersedia.</p>
            )}
          </div>
        </div>
      </section>

      {/* --- 6. HOTELS LIST --- */}
      <section id="hotels" className="py-24 px-6 bg-neutral-50 border-t border-neutral-100">
        <div className="w-full max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-neutral-900">Our Locations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <Link href={`/${params.locale}/hotels/${hotel.slug}`} key={hotel.id} className="group relative block h-[420px] overflow-hidden rounded-[2rem] shadow-md hover:shadow-2xl transition-shadow duration-300">
                <Image
                  src={hotel.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000"}
                  alt={hotel.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90" />
                <div className="absolute bottom-0 p-8 w-full">
                  <p className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-2">{hotel.tagline}</p>
                  <h3 className="text-2xl font-bold text-white mb-3">{hotel.name}</h3>
                  <div className="flex items-center text-white/80 text-sm gap-2 font-medium">
                    <span>Explore Hotel</span>
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
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