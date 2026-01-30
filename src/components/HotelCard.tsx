import Link from "next/link";
import type { Hotel } from "@/types"; 

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <Link href={`/en/hotels/${hotel.slug}`} className="group block">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
        
        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-navy-800 to-navy-950">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-navy-700 opacity-20 mb-2">CLEO</div>
              <div className="text-xs text-navy-600 opacity-30 uppercase tracking-wider">Premium Hotel</div>
            </div>
          </div>
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Gold accent corner */}
          <div className="absolute top-4 right-4 w-12 h-12 rounded-lg bg-gold-500/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <svg className="w-6 h-6 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </div>

          {/* Rating badge */}
          <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg">
            <svg className="w-4 h-4 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-bold text-navy-950">5.0</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Category badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-50 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-navy-800" />
            <span className="text-xs font-semibold text-navy-800 uppercase tracking-wide">CLEO</span>
          </div>

          {/* Hotel name */}
          <h3 className="text-xl font-bold text-navy-950 mb-2 group-hover:text-gold-600 transition-colors">
            {hotel.name}
          </h3>
          
          {/* Location */}
          <div className="flex items-start gap-2 mb-4">
            <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {hotel.address}
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-sm font-semibold text-gray-500">View Details</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}