import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Check } from "lucide-react"; 

export default async function AboutPage({ params }: { params: { locale: string } }) {
  // Koneksi Supabase untuk mengambil data promo
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Ambil 3 Promo Terbaru
  const { data: promos } = await supabase.from("promos").select("*").order("created_at", { ascending: false }).limit(3);
  const safePromos = promos || []; 

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      
      {/* --- 1. TANLY HOSPITALITY SECTION (DARK THEME / PREMIUM LOOK) --- */}
      <section className="relative pt-[140px] pb-24 px-6 bg-[#0f172a] overflow-hidden">
        {/* Efek Cahaya (Glow) di Background agar tidak terlalu flat */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-blue-400 tracking-widest uppercase mb-4">
              Our Parent Company
            </h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Part of Tanly Hospitality
            </h3>
            <p className="text-gray-300 leading-relaxed text-base md:text-lg">
              Cleo Hotels is managed by <strong className="text-white">Tanly Hospitality</strong>, an Indonesian hotel management company operating a growing portfolio of hotels and resorts across the country. Tanly Hospitality manages multiple brands serving different travel needs:
            </p>
          </div>

          {/* Grid Brands Tanly Hospitality (Dark Cards) */}
          <div className="grid sm:grid-cols-2 gap-6 mb-16">
            {/* Brand 1 */}
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-[1.5rem] border border-white/10 shadow-lg hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-500/20 p-2 rounded-full text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Check size={20} strokeWidth={3} />
                </div>
                <h4 className="text-xl font-bold text-white">Vasa Hotels</h4>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm">
                A 5-star lifestyle luxury hotel brand offering premium facilities and elevated hospitality experiences in key destinations.
              </p>
            </div>

            {/* Brand 2 */}
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-[1.5rem] border border-white/10 shadow-lg hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-500/20 p-2 rounded-full text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Check size={20} strokeWidth={3} />
                </div>
                <h4 className="text-xl font-bold text-white">Taman Dayu Golf & Resort</h4>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm">
                A renowned golf and resort destination combining leisure, nature, and championship golf experiences in East Java.
              </p>
            </div>

            {/* Brand 3 */}
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-[1.5rem] border border-white/10 shadow-lg hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-500/20 p-2 rounded-full text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Check size={20} strokeWidth={3} />
                </div>
                <h4 className="text-xl font-bold text-white">Solaris Hotels</h4>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm">
                A 3-star hotel brand providing comfortable and affordable stays for business and leisure travelers.
              </p>
            </div>

            {/* Brand 4 */}
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-[1.5rem] border border-white/10 shadow-lg hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-500/20 p-2 rounded-full text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Check size={20} strokeWidth={3} />
                </div>
                <h4 className="text-xl font-bold text-white">Cleo Hotels</h4>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm">
                A smart and affordable 2-star hotel brand designed for modern travelers seeking minimalist rooms, strategic city locations, and great value for money.
              </p>
            </div>
          </div>

          <div className="text-center max-w-4xl mx-auto space-y-4 text-gray-300 text-base md:text-lg">
            <p>
              With properties across Surabaya, Malang, Bali, and upcoming destinations such as Ubud, Canggu, Bromo, and Manado, Tanly Hospitality continues to expand its presence in Indonesia’s hospitality and resort industry.
            </p>
            <p className="font-medium text-white">
              From luxury hotels and golf resorts to smart city stays, Tanly Hospitality delivers reliable hospitality for every journey.
            </p>
          </div>
        </div>
      </section>

      {/* --- 2. PHOTO GRID (Galeri) --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto bg-white">
        <div className="grid md:grid-cols-2 gap-4 h-[500px] md:h-[600px]">
           {/* Kiri - Gambar Besar */}
           <div className="relative h-full rounded-[2rem] overflow-hidden group shadow-md">
              <Image 
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80" 
                alt="Modern Aesthetic Resort" 
                fill 
                className="object-cover transition duration-1000 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
              <div className="absolute bottom-10 left-10 right-10">
                 <h4 className="text-3xl md:text-4xl font-bold text-white mb-3">Modern Aesthetic</h4>
                 <p className="text-white/80 text-base md:text-lg">Stylish interiors designed for your visual comfort.</p>
              </div>
           </div>
           {/* Kanan - 2 Gambar Tumpuk */}
           <div className="grid grid-rows-2 gap-4">
              <div className="relative h-full rounded-[2rem] overflow-hidden group shadow-md">
                 <Image 
                   src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80" 
                   alt="Pool View" 
                   fill 
                   className="object-cover transition duration-1000 group-hover:scale-105" 
                 />
              </div>
              <div className="relative h-full rounded-[2rem] overflow-hidden group shadow-md">
                 <Image 
                   src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80" 
                   alt="Lounge Area" 
                   fill 
                   className="object-cover transition duration-1000 group-hover:scale-105" 
                 />
              </div>
           </div>
        </div>
      </section>

      {/* --- 3. OFFERS & PACKAGES SECTION (Desain Baru Gambar 3) --- */}
      <section className="py-20 px-6 bg-white border-y border-neutral-100">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header Offers & Packages */}
          <div className="mb-14 text-left border-b border-neutral-100 pb-8">
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

      {/* --- 4. REVISI: DISCOVER CLEO SECTION --- */}
      <section className="py-24 px-6 bg-white">
        <div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-white to-[#f8faff] border border-blue-50/50 rounded-[2.5rem] p-12 md:p-20 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          {/* Subtle Glow Background */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl z-0 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl z-0 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-6 tracking-tight">
              Best Affordable Hotel in Surabaya Starts Here.
            </h2>
            <p className="text-neutral-600 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Explore Cleo Hotels and book direct for the best price.
            </p>
            <Link 
              href={`/${params.locale}/hotels`} 
              className="inline-block bg-[#1a56db] text-white font-bold px-12 py-4 rounded-full hover:bg-blue-800 hover:shadow-lg transition-all duration-300 uppercase tracking-widest text-sm"
            >
              Discover Now
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}