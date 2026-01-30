import { Mail, MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Contact Us - Cleo Hotels",
  description: "Get in touch with Cleo Hotels for reservations and inquiries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-navy-950 text-white pt-24 pb-20">
      {/* HEADER SECTION */}
      <div className="container mx-auto px-6 mb-16 text-center">
        <p className="text-gold-500 font-bold tracking-[0.2em] text-xs uppercase mb-4">
          Get In Touch
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          We are here to help you <span className="text-gold-400 italic">#EnjoyLife</span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          Have questions about your stay? Reach out to our team directly.
        </p>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* INFO CARD 1: GENERAL INQUIRIES */}
          <div className="bg-navy-900/50 p-8 rounded-2xl border border-white/5 text-center hover:border-gold-500/30 transition">
            <div className="mx-auto w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center text-gold-500 mb-6">
              <Mail size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Email Us</h3>
            <p className="text-gray-400 text-sm mb-4">General inquiries & support</p>
            <a href="mailto:info@cleohotels.id" className="text-gold-400 hover:text-white font-medium transition">
              info@cleohotels.id
            </a>
          </div>

          {/* INFO CARD 2: HEAD OFFICE */}
          <div className="bg-navy-900/50 p-8 rounded-2xl border border-white/5 text-center hover:border-gold-500/30 transition">
             <div className="mx-auto w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center text-gold-500 mb-6">
              <MapPin size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Head Office</h3>
            <p className="text-gray-400 text-sm mb-4">Visit our main office</p>
            <p className="text-gold-400 font-medium">
              Surabaya, East Java, Indonesia
            </p>
          </div>

          {/* INFO CARD 3: SOCIAL MEDIA */}
          <div className="bg-navy-900/50 p-8 rounded-2xl border border-white/5 text-center hover:border-gold-500/30 transition">
             <div className="mx-auto w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center text-gold-500 mb-6">
              <Instagram size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Follow Us</h3>
            <p className="text-gray-400 text-sm mb-4">Stay updated with latest offers</p>
            <div className="flex justify-center gap-4">
              <a href="https://instagram.com/cleohotels" target="_blank" className="text-gold-400 hover:text-white transition">
                @cleohotels
              </a>
            </div>
          </div>

        </div>

        {/* HOTEL DIRECT CONTACTS */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-10">Hotel Direct Contacts</h2>
          <div className="grid md:grid-cols-3 gap-6">
            
            <HotelContactCard 
              name="Cleo Jemursari"
              type="Business & Transit"
              phone="+62 31 8483 000"
              address="Jl. Raya Jemursari No. 157, Surabaya"
            />
            
            <HotelContactCard 
              name="Cleo Walikota"
              type="Heritage & Civic Center"
              phone="+62 31 5489 000"
              address="Jl. Walikota Mustajab No. 59, Surabaya"
            />

            <HotelContactCard 
              name="Cleo Tunjungan"
              type="Lifestyle & Shopping"
              phone="+62 31 5323 330"
              address="Jl. Tunjungan No. 55, Surabaya"
            />

          </div>
        </div>
      </div>
    </main>
  );
}

function HotelContactCard({ name, type, phone, address }: { name: string, type: string, phone: string, address: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition">
      <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
      <p className="text-xs uppercase tracking-widest text-gold-500 mb-4">{type}</p>
      
      <div className="space-y-3">
        <a href={`tel:${phone.replace(/ /g, '')}`} className="flex items-center gap-3 text-gray-300 hover:text-gold-400 transition">
          <Phone size={16} className="text-gold-500"/>
          {phone}
        </a>
        <div className="flex items-start gap-3 text-gray-300">
          <MapPin size={16} className="text-gold-500 mt-1 shrink-0"/>
          <span className="text-sm">{address}</span>
        </div>
      </div>
    </div>
  )
}