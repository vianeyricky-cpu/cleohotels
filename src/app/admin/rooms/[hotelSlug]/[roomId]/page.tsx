import { createClient } from "@supabase/supabase-js";
import RoomForm from "@/components/admin/RoomForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditRoomPage({ params }: { params: { hotelSlug: string; roomId: string } }) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  // Ambil Hotel ID dulu
  const { data: hotel } = await supabase.from("Hotel").select("id, name").eq("slug", params.hotelSlug).single();
  
  // Cek apakah mode Create New atau Edit
  let roomData = null;
  const isNew = params.roomId === "new";

  if (!isNew) {
     const { data } = await supabase.from("Room").select("*").eq("id", params.roomId).single();
     roomData = data;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
       <div className="flex items-center gap-4 mb-6">
          <Link href={`/admin/rooms/${params.hotelSlug}`} className="p-2 rounded-full hover:bg-gray-200">
             <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-navy-950">
            {isNew ? `New Room at ${hotel?.name}` : `Edit Room: ${roomData?.name}`}
          </h1>
       </div>

       <RoomForm hotelId={hotel?.id!} room={roomData} isNew={isNew} />
    </div>
  );
}