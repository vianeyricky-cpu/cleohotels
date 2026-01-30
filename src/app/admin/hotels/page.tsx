import Link from "next/link";
import Image from "next/image";
import { getHotels } from "@/actions/getHotels"; // Kita pakai action yang sudah ada
import { Edit, ExternalLink } from "lucide-react";

// Supaya data selalu fresh saat admin buka (No Cache)
export const dynamic = "force-dynamic";

export default async function AdminHotelsPage() {
  const hotels = await getHotels();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-navy-950">Manage Hotels</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">Image</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Hotel Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Phone</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {hotels.map((hotel) => (
              <tr key={hotel.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="relative h-12 w-20 rounded-md overflow-hidden bg-gray-200">
                    {hotel.image_url && (
                      <Image src={hotel.image_url} alt={hotel.name} fill className="object-cover" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-navy-900">{hotel.name}</td>
                <td className="px-6 py-4 text-gray-500">{hotel.phone}</td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    href={`/admin/hotels/${hotel.slug}`} 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-navy-950 text-white rounded-lg hover:bg-gold-500 hover:text-navy-950 transition text-xs font-bold"
                  >
                    <Edit size={14} /> Edit Content
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}