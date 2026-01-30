import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Plus, ArrowLeft, Edit } from "lucide-react";
import Image from "next/image";
import DeleteFacilityButton from "@/components/admin/DeleteFacilityButton";

export const dynamic = "force-dynamic";

export default async function HotelFacilitiesPage({ params }: { params: { hotelSlug: string } }) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const { data: hotel } = await supabase.from("Hotel").select("id, name, slug").eq("slug", params.hotelSlug).single();
  if (!hotel) return <div>Not Found</div>;

  const { data: facilities } = await supabase
    .from("Facility")
    .select("*")
    .eq("hotelId", hotel.id)
    .order("created_at", { ascending: true });

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/facilities" className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition"><ArrowLeft size={20}/></Link>
          <div>
            <h1 className="text-2xl font-bold text-navy-950">{hotel.name} Facilities</h1>
            <p className="text-sm text-gray-500">Manage pool, gym, dining, etc.</p>
          </div>
        </div>
        <Link href={`/admin/facilities/${params.hotelSlug}/new`} className="flex items-center gap-2 px-6 py-3 bg-navy-950 text-white rounded-xl hover:bg-gold-500 font-bold">
          <Plus size={18} /> Add Facility
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities?.map((item) => {
          const thumbnail = item.images?.[0] || item.image;
          return (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col">
              <div className="relative h-56 bg-gray-100">
                {thumbnail ? (
                  <Image src={thumbnail} alt={item.name} fill className="object-cover" unoptimized />
                ) : <div className="flex items-center justify-center h-full text-gray-400">No Image</div>}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-navy-950">{item.name}</h3>
                <p className="text-xs font-bold text-gold-500 uppercase tracking-wider mb-2">{item.type}</p>
                <div className="grid grid-cols-2 gap-2 mt-auto">
                    <Link href={`/admin/facilities/${params.hotelSlug}/${item.id}`} className="flex items-center justify-center gap-2 py-2 rounded-lg bg-navy-950 text-white text-sm font-bold hover:bg-gold-500">
                      <Edit size={16} /> Edit
                    </Link>
                    <DeleteFacilityButton facilityId={item.id} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}