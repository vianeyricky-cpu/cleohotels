import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Building2, ChevronRight } from "lucide-react";

// Server Component: Ambil list hotel
export default async function RoomsIndexPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: hotels } = await supabase.from("Hotel").select("*").order("name");

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-navy-950 mb-2">Rooms Management</h1>
      <p className="text-gray-500 mb-8">Select a hotel to manage its rooms.</p>

      <div className="grid gap-4">
        {hotels?.map((hotel) => (
          <Link 
            key={hotel.id} 
            href={`/admin/rooms/${hotel.slug}`}
            className="group flex items-center justify-between bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gold-500 transition"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-navy-50 text-navy-950 rounded-lg group-hover:bg-gold-500 group-hover:text-white transition">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-950">{hotel.name}</h3>
                <p className="text-sm text-gray-400">{hotel.address}</p>
              </div>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-gold-500" />
          </Link>
        ))}
      </div>
    </div>
  );
}