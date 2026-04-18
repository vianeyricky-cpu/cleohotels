import { getHotelBySlug } from "@/actions/getHotels";
import { EditHotelForm } from "@/components/admin/EditHotelForm";
import { notFound } from "next/navigation";

// --- TAMBAHKAN BARIS INI ---
// Memaksa Next.js untuk selalu mengambil data terbaru (bukan dari cache)
export const dynamic = "force-dynamic";

export default async function EditHotelPage({ params }: { params: { slug: string } }) {
  
  // 1. Ambil data hotel berdasarkan slug (Server Action)
  const hotel = await getHotelBySlug(params.slug);

  // 2. Jika data tidak ditemukan di database, tampilkan halaman 404 Not Found
  if (!hotel) {
    return notFound();
  }

  // 3. Siapkan data yang bersih untuk dikirim ke Client Component (Form)
  // PASTIKAN menambahkan "images" agar galeri "The Experience" tidak kosong
  const hotelData = {
    id: hotel.id,
    slug: hotel.slug,
    name: hotel.name,
    description: hotel.description,
    address: hotel.address,
    phone: hotel.phone,
    image_url: hotel.image_url || "",
    maps_url: hotel.maps_url || "",
    google_maps_link: hotel.google_maps_link || "",
    images: hotel.images || [] // <-- Tambahan penting untuk foto gallery
  };

  // 4. Render Form Edit 
  return <EditHotelForm hotel={hotelData} />;
}