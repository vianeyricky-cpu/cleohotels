import { getHotelBySlug } from "@/actions/getHotels";
import { EditHotelForm } from "@/components/admin/EditHotelForm";
import { notFound } from "next/navigation";

// --- SERVER COMPONENT ---
// Halaman ini berjalan di server. Data diambil SEBELUM halaman dikirim ke browser.
// Keuntungan: Tidak ada loading spinner berputar, data langsung tampil instan.

export default async function EditHotelPage({ params }: { params: { slug: string } }) {
  
  // 1. Ambil data hotel berdasarkan slug (Server Action)
  const hotel = await getHotelBySlug(params.slug);

  // 2. Jika data tidak ditemukan di database, tampilkan halaman 404 Not Found
  if (!hotel) {
    return notFound();
  }

  // 3. Siapkan data yang bersih untuk dikirim ke Client Component (Form)
  // Kita pastikan tidak ada nilai null (ganti dengan string kosong "") agar Form tidak error
  const hotelData = {
    id: hotel.id,
    slug: hotel.slug,
    name: hotel.name,
    description: hotel.description,
    address: hotel.address,
    phone: hotel.phone,
    image_url: hotel.image_url || "",
    maps_url: hotel.maps_url || "",
    google_maps_link: hotel.google_maps_link || ""
  };

  // 4. Render Form Edit (Ini adalah Client Component yang kita buat sebelumnya)
  return <EditHotelForm hotel={hotelData} />;
}