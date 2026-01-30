import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Twitter, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy-950 text-white border-t border-white/10 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        
        {/* KOLOM 1: BRAND */}
        <div>
          <div className="relative h-12 w-40 mb-6">
            <Image 
              src="/logo.png" 
              alt="Cleo Hotels Logo" 
              fill
              className="object-contain object-left"
            />
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Managed by Tanly Hospitality. Providing experiences that touch guests' hearts with high value. #EnjoyLife
          </p>
          <div className="flex gap-4">
            <a href="https://instagram.com/cleohotels" target="_blank" className="p-2 rounded-full bg-white/5 hover:bg-gold-500 hover:text-navy-950 transition">
              <Instagram size={18} />
            </a>
            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-gold-500 hover:text-navy-950 transition">
              <Facebook size={18} />
            </a>
          </div>
        </div>

        {/* KOLOM 2: CONTACT CENTER */}
        <div>
          <h3 className="text-lg font-bold text-gold-500 mb-6 tracking-widest">CONTACT US</h3>
          <ul className="space-y-4 text-sm text-gray-300">
            <li className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gold-500 shrink-0" />
              <a href="mailto:info@cleohotels.id" className="hover:text-white transition">
                info@cleohotels.id
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gold-500 shrink-0" />
              <span>Surabaya, East Java, Indonesia</span>
            </li>
          </ul>
        </div>

        {/* KOLOM 3: HOTEL CONTACTS (PENTING: NOMOR PER HOTEL) */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-bold text-gold-500 mb-6 tracking-widest">OUR LOCATIONS</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            
            {/* Jemursari */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold-500/30 transition">
              <h4 className="font-bold text-white mb-1">Cleo Jemursari</h4>
              <p className="text-xs text-gray-400 mb-2">Business & Transit Hub</p>
              <a href="tel:+62318483000" className="flex items-center gap-2 text-gold-400 text-sm font-bold hover:underline">
                <Phone size={14} /> +62 31 8483 000
              </a>
            </div>

            {/* Walikota Mustajab */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold-500/30 transition">
              <h4 className="font-bold text-white mb-1">Cleo Walikota</h4>
              <p className="text-xs text-gray-400 mb-2">Heritage & Civic Center</p>
              <a href="tel:+62315489000" className="flex items-center gap-2 text-gold-400 text-sm font-bold hover:underline">
                <Phone size={14} /> +62 31 5489 000
              </a>
            </div>

            {/* Tunjungan */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold-500/30 transition">
              <h4 className="font-bold text-white mb-1">Cleo Tunjungan</h4>
              <p className="text-xs text-gray-400 mb-2">Lifestyle & Shopping</p>
              <a href="tel:+62315323330" className="flex items-center gap-2 text-gold-400 text-sm font-bold hover:underline">
                <Phone size={14} /> +62 31 5323 330
              </a>
            </div>

          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-white/10 pt-8 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Cleo Hotels by Tanly Hospitality. All rights reserved.
      </div>
    </footer>
  );
}