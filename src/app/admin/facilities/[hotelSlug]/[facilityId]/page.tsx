import { createClient } from "@supabase/supabase-js";
import FacilityForm from "@/components/admin/FacilityForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditFacilityPage({ params }: { params: { hotelSlug: string; facilityId: string } }) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const { data: hotel } = await supabase.from("Hotel").select("id, name").eq("slug", params.hotelSlug).single();
  
  let facilityData = null;
  const isNew = params.facilityId === "new";

  if (!isNew) {
     const { data } = await supabase.from("Facility").select("*").eq("id", params.facilityId).single();
     facilityData = data;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
       <div className="flex items-center gap-4 mb-6">
          <Link href={`/admin/facilities/${params.hotelSlug}`} className="p-2 rounded-full hover:bg-gray-200">
             <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-navy-950">
            {isNew ? `New Facility at ${hotel?.name}` : `Edit: ${facilityData?.name}`}
          </h1>
       </div>
       <FacilityForm hotelId={hotel?.id!} facility={facilityData} isNew={isNew} />
    </div>
  );
}