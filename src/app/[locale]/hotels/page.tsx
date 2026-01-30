import { getHotels } from "@/actions"; 
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HotelsIndexPage({ params }: { params: { locale: string } }) {
  // Ambil data semua hotel dari database
  const hotels = await getHotels();

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-24">
      {/* HEADER */}
      <div className="container mx-auto px-6 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-navy-950 mb-4">Our Hotels</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose the perfect location for your stay in Surabaya. Each Cleo Hotel offers a unique experience tailored to your needs.
        </p>
      </div>

      {/* LIST HOTELS */}
      <div className="container mx-auto px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <Link 
              key={hotel.id} 
              href={`/${params.locale}/hotels/${hotel.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-xl border border-gray-100"
            >
              {/* Image Wrapper */}
              <div className="relative h-64 w-full overflow-hidden bg-gray-200">
                {hotel.image_url ? (
                  <Image
                    src={hotel.image_url}
                    alt={hotel.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                   <p className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-1">{hotel.tagline || "Premium Hotel"}</p>
                   <h2 className="text-2xl font-bold">{hotel.name}</h2>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start gap-2 text-gray-500 text-sm mb-4">
                  <MapPin size={16} className="mt-1 shrink-0 text-gold-500" />
                  <span className="line-clamp-2">{hotel.address}</span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">
                  {hotel.description}
                </p>
                <div className="mt-auto flex items-center justify-between border-t pt-4">
                  <span className="text-sm font-bold text-navy-900">View Details</span>
                  <div className="h-8 w-8 rounded-full bg-navy-50 flex items-center justify-center text-navy-900 group-hover:bg-gold-500 group-hover:text-white transition">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}