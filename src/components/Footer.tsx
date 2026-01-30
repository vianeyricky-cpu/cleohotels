import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy-950 text-white border-t border-white/10 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6 grid gap-16 md:grid-cols-2 lg:grid-cols-4">
        
        {/* KOLOM 1: BRAND (LOGO JAUH LEBIH BESAR) */}
        <div>
          {/* Container Logo Besar: Tinggi 128px, Lebar 320px */}
          <div className="relative h-32 w-80 mb-8 -ml-2">
            <Image 
              src="/logo.png" 
              alt="Cleo Hotels Logo" 
              fill
              className="object-contain object-left"
              priority
            />
          </div>
          <p className="text-gray-400 text-base leading-relaxed mb-8 pr-4">
            Managed by Tanly Hospitality. Providing experiences that touch guests' hearts with high value. #EnjoyLife
          </p>
          <div className="flex gap-4">
            <a href="https://instagram.com/cleohotels" target="_blank" className="p-3 rounded-full bg-white/5 hover:bg-gold-500 hover:text-navy-950 transition border border-white/10">
              <Instagram size={20} />
            </a>
            <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-gold-500 hover:text-navy-950 transition border border-white/10">
              <Facebook size={20} />
            </a>
          </div>
        </div>

        {/* KOLOM 2: CONTACT CENTER */}
        <div className="pt-4">
          <h3 className="text-lg font-bold text-gold-500 mb-8 tracking-[0.2em] uppercase">Contact Us</h3>
          <ul className="space-y-6 text-sm text-gray-300">
            <li className="flex items-start gap-4 group">
              <div className="p-2 rounded-lg bg-white/5 text-gold-500 group-hover:bg-gold-500 group-hover:text-navy-950 transition">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                 <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Email Support</span>
                 <a href="mailto:info@cleohotels.id" className="text-base text-white hover:text-gold-400 transition">
                   info@cleohotels.id
                 </a>
              </div>
            </li>
            <li className="flex items-start gap-4 group">
              <div className="p-2 rounded-lg bg-white/5 text-gold-500 group-hover:bg-gold-500 group-hover:text-navy-950 transition">
                 <MapPin className="h-5 w-5" />
              </div>
              <div>
                 <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Head Office</span>
                 <span className="text-base text-white">Surabaya, East Java, Indonesia</span>
              </div>
            </li>
          </ul>
        </div>

        {/* KOLOM 3: HOTEL CONTACTS */}
        <div className="lg:col-span-2 pt-4">
          <h3 className="text-lg font-bold text-gold-500 mb-8 tracking-[0.2em] uppercase">Our Locations</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            
            {/* Jemursari */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-gold-500/30 hover:bg-white/10 transition group">
              <h4 className="text-lg font-bold text-white mb-1 group-hover:text-gold-400 transition">Cleo Jemursari</h4>
              <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Business & Transit Hub</p>
              <a href="tel:+62318483000" className="flex items-center gap-2 text-white font-medium hover:text-gold-400 transition">
                <Phone size={16} className="text-gold-500" /> +62 31 8483 000
              </a>
            </div>

            {/* Walikota Mustajab */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-gold-500/30 hover:bg-white/10 transition group">
              <h4 className="text-lg font-bold text-white mb-1 group-hover:text-gold-400 transition">Cleo Walikota</h4>
              <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Heritage & Civic Center</p>
              <a href="tel:+62315489000" className="flex items-center gap-2 text-white font-medium hover:text-gold-400 transition">
                <Phone size={16} className="text-gold-500" /> +62 31 5489 000
              </a>
            </div>

            {/* Tunjungan */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-gold-500/30 hover:bg-white/10 transition group">
              <h4 className="text-lg font-bold text-white mb-1 group-hover:text-gold-400 transition">Cleo Tunjungan</h4>
              <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Lifestyle & Shopping</p>
              <a href="tel:+62315323330" className="flex items-center gap-2 text-white font-medium hover:text-gold-400 transition">
                <Phone size={16} className="text-gold-500" /> +62 31 5323 330
              </a>
            </div>

          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-white/10 pt-8 text-center">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Cleo Hotels by Tanly Hospitality. All rights reserved. <br className="md:hidden"/> Dev. by Askara Indonesia
        </p>
      </div>
    </footer>
  );
}