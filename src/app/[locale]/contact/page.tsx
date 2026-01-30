import Image from "next/image";
import { MapPin, Phone, Mail, Instagram, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-navy-950 text-white pb-24">
      
      {/* HERO SECTION */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069" 
            alt="Contact Cleo Hotels" 
            fill 
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-black/40" />
        </div>
        <div className="relative z-10 text-center mt-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Get in Touch</h1>
          [cite_start]<p className="text-xl text-gray-300">We are here to help you #EnjoyLife [cite: 6]</p>
        </div>
      </section>

      {/* GENERAL INFO */}
      <section className="py-12 px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-center gap-8 md:gap-16 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
             <Mail className="text-gold-500 h-6 w-6" />
             <div>
               <p className="text-xs text-gray-400 uppercase tracking-widest">Email Us</p>
               <a href="mailto:info@cleohotels.id" className="text-lg font-bold hover:text-gold-400 transition">info@cleohotels.id</a>
             </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
             <Instagram className="text-gold-500 h-6 w-6" />
             <div>
               <p className="text-xs text-gray-400 uppercase tracking-widest">Follow Us</p>
               <a href="https://instagram.com/cleohotels" target="_blank" className="text-lg font-bold hover:text-gold-400 transition">@cleohotels</a>
             </div>
          </div>
        </div>
      </section>

      {/* HOTEL DIRECT CONTACTS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Our Locations & Contacts</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          
          [cite_start]{/* JEMURSARI [cite: 10, 11] */}
          <div className="bg-navy-900 p-8 rounded-2xl border border-white/5 hover:border-gold-500/30 transition group">
             <h3 className="text-2xl font-bold text-white mb-2">Cleo Jemursari</h3>
             <p className="text-gold-500 text-xs font-bold tracking-widest uppercase mb-6">Business & Transit</p>
             
             <div className="space-y-4 text-gray-300">
                <div className="flex items-start gap-3">
                   <MapPin className="h-5 w-5 text-gold-500 shrink-0 mt-1" />
                   <p className="text-sm">Jl. [cite_start]Raya Jemursari No. 157, Kendangsari, Surabaya [cite: 10]</p>
                </div>
                <div className="flex items-center gap-3">
                   <Phone className="h-5 w-5 text-gold-500 shrink-0" />
                   [cite_start]<a href="tel:+62318483000" className="text-sm font-bold text-white hover:text-gold-400 transition">+62 31 8483 000 [cite: 11]</a>
                </div>
             </div>
          </div>

          [cite_start]{/* WALIKOTA [cite: 33, 34] */}
          <div className="bg-navy-900 p-8 rounded-2xl border border-white/5 hover:border-gold-500/30 transition group">
             <h3 className="text-2xl font-bold text-white mb-2">Cleo Walikota</h3>
             <p className="text-gold-500 text-xs font-bold tracking-widest uppercase mb-6">Heritage Center</p>
             
             <div className="space-y-4 text-gray-300">
                <div className="flex items-start gap-3">
                   <MapPin className="h-5 w-5 text-gold-500 shrink-0 mt-1" />
                   <p className="text-sm">Jl. [cite_start]Walikota Mustajab No. 59, Genteng, Surabaya [cite: 33]</p>
                </div>
                <div className="flex items-center gap-3">
                   <Phone className="h-5 w-5 text-gold-500 shrink-0" />
                   [cite_start]<a href="tel:+62315489000" className="text-sm font-bold text-white hover:text-gold-400 transition">+62 31 5489 000 [cite: 34]</a>
                </div>
             </div>
          </div>

          [cite_start]{/* TUNJUNGAN [cite: 51, 52] */}
          <div className="bg-navy-900 p-8 rounded-2xl border border-white/5 hover:border-gold-500/30 transition group">
             <h3 className="text-2xl font-bold text-white mb-2">Cleo Tunjungan</h3>
             <p className="text-gold-500 text-xs font-bold tracking-widest uppercase mb-6">Lifestyle Hub</p>
             
             <div className="space-y-4 text-gray-300">
                <div className="flex items-start gap-3">
                   <MapPin className="h-5 w-5 text-gold-500 shrink-0 mt-1" />
                   <p className="text-sm">Jl. [cite_start]Basuki Rahmat No. 11, Genteng, Surabaya [cite: 51]</p>
                </div>
                <div className="flex items-center gap-3">
                   <Phone className="h-5 w-5 text-gold-500 shrink-0" />
                   [cite_start]<a href="tel:+62315323330" className="text-sm font-bold text-white hover:text-gold-400 transition">+62 31 5323 330 [cite: 52]</a>
                </div>
             </div>
          </div>

        </div>
      </section>

    </main>
  );
}