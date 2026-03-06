import { createClient } from "@supabase/supabase-js";
import { Building2, BedDouble, Users, Activity, Sparkles } from "lucide-react";
import DashboardCharts from "@/components/admin/DashboardCharts"; 
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export const dynamic = "force-dynamic";

// Fungsi Helper untuk format tanggal GA (YYYYMMDD -> DD MMM, ex: 12 Okt)
function formatGADate(gaDateStr: string) {
  if (!gaDateStr) return "";
  const year = gaDateStr.substring(0, 4);
  const month = gaDateStr.substring(4, 6);
  const day = gaDateStr.substring(6, 8);
  const date = new Date(`${year}-${month}-${day}`);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

// Fungsi Mengambil Data Lengkap dari Google Analytics
async function getAnalyticsData() {
  const fallback = { totalVisitors: "0", trafficData: [], deviceData: [] };
  
  try {
    if (!process.env.GA_PROPERTY_ID || !process.env.GA_CLIENT_EMAIL || !process.env.GA_PRIVATE_KEY) {
      return fallback;
    }

    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GA_CLIENT_EMAIL,
        private_key: process.env.GA_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });

    const property = `properties/${process.env.GA_PROPERTY_ID}`;

    // 1. Fetch Total Pengunjung (30 Hari)
    const [totalResponse] = await analyticsDataClient.runReport({
      property,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }],
    });
    const totalVisitors = totalResponse.rows?.[0]?.metricValues?.[0]?.value || "0";

    // 2. Fetch Traffic Garis (7 Hari Terakhir)
    const [trafficResponse] = await analyticsDataClient.runReport({
      property,
      dateRanges: [{ startDate: '6daysAgo', endDate: 'today' }], // 7 hari termasuk hari ini
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }] // Urutkan sesuai tanggal
    });
    
    // Parse ke format grafik
    const trafficData = trafficResponse.rows?.map(row => ({
      date: formatGADate(row.dimensionValues?.[0]?.value || ""),
      visitors: parseInt(row.metricValues?.[0]?.value || "0", 10)
    })) || [];

    // 3. Fetch Kategori Perangkat (Desktop vs Mobile)
    const [deviceResponse] = await analyticsDataClient.runReport({
      property,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'activeUsers' }],
    });

    const deviceData = deviceResponse.rows?.map(row => ({
      name: row.dimensionValues?.[0]?.value || "Unknown",
      value: parseInt(row.metricValues?.[0]?.value || "0", 10)
    })) || [];

    return { totalVisitors, trafficData, deviceData };

  } catch (error) {
    console.error("Gagal mengambil data GA:", error);
    return fallback;
  }
}

export default async function AdminDashboardPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 1. Data Supabase
  const { count: totalHotels } = await supabase.from("Hotel").select("*", { count: "exact", head: true });
  const { data: roomsData } = await supabase.from("Room").select("hotelId, Hotel(name)");
  const { count: totalFacilities } = await supabase.from("Facility").select("*", { count: "exact", head: true });

  const totalRooms = roomsData?.length || 0;

  const roomCounts: Record<string, number> = {};
  roomsData?.forEach((room: any) => {
    const hotelName = room.Hotel?.name?.replace("Cleo Hotel ", "") || "Unknown"; 
    roomCounts[hotelName] = (roomCounts[hotelName] || 0) + 1;
  });

  const barChartData = Object.keys(roomCounts).map((key) => ({ name: key, rooms: roomCounts[key] }));

  // 2. Fetch Google Analytics Data Terpadu
  const gaData = await getAnalyticsData();

  // (Optional) Jika GA4 masih kosong (baru dipasang), beri data dummy sementara AGAR GRAFIK TIDAK KOSONG MLOMPONG
  const displayTrafficData = gaData.trafficData.length > 0 ? gaData.trafficData : [
    { date: '10 Mar', visitors: 0 }, { date: '11 Mar', visitors: 0 } // akan terlihat 0
  ];
  const displayDeviceData = gaData.deviceData.length > 0 ? gaData.deviceData : [
    { name: 'Menunggu Data...', value: 1 } // Placeholder sebelum google narik data
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 mb-2">Dashboard Overview</h1>
        <p className="text-neutral-500">Welcome to Cleo Hotels Content Management System.</p>
      </div>

      {/* --- STATISTIC CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-[1.5rem] border border-neutral-100 shadow-sm flex items-center gap-5 hover:shadow-md transition">
          <div className="w-14 h-14 bg-blue-50 text-[#1a56db] rounded-2xl flex items-center justify-center shrink-0">
            <Building2 size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">Total Hotels</p>
            <h2 className="text-3xl font-extrabold text-neutral-900">{totalHotels || 0}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[1.5rem] border border-neutral-100 shadow-sm flex items-center gap-5 hover:shadow-md transition">
          <div className="w-14 h-14 bg-orange-50 text-[#f05136] rounded-2xl flex items-center justify-center shrink-0">
            <BedDouble size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">Total Rooms</p>
            <h2 className="text-3xl font-extrabold text-neutral-900">{totalRooms}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[1.5rem] border border-neutral-100 shadow-sm flex items-center gap-5 hover:shadow-md transition">
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
            <Sparkles size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">Facilities</p>
            <h2 className="text-3xl font-extrabold text-neutral-900">{totalFacilities || 0}</h2>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1a56db] to-blue-800 p-6 rounded-[1.5rem] shadow-lg shadow-blue-600/20 flex items-center gap-5 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 transition duration-700 group-hover:scale-150"></div>
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 relative z-10">
            <Users size={28} />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-blue-100 uppercase tracking-wider mb-1">Active Visitors</p>
            <h2 className="text-3xl font-extrabold text-white">
              {Number(gaData.totalVisitors).toLocaleString("id-ID")}
              <span className="text-sm font-normal text-blue-200 ml-1">/ 30 days</span>
            </h2>
          </div>
        </div>

      </div>

      {/* --- CHARTS SECTION --- */}
      <DashboardCharts 
        roomDistributionData={barChartData} 
        trafficData={displayTrafficData} 
        deviceData={displayDeviceData} 
      />

      {/* --- QUICK GUIDE --- */}
      <div className="mt-8 bg-neutral-50 border border-neutral-200 p-8 rounded-[1.5rem]">
        <div className="flex items-center gap-3 mb-4 text-neutral-800">
          <Activity size={24} className="text-[#1a56db]" />
          <h3 className="text-xl font-bold">Quick Guide</h3>
        </div>
        <div className="space-y-3 text-neutral-600">
          <p>Selamat datang di <strong>CMS Cleo Hotels</strong>. Data pengunjung ditarik secara langsung dari Google Analytics.</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Hotels:</strong> Ubah deskripsi, foto utama, tagline, link maps, dan info kontak hotel.</li>
            <li><strong>Rooms:</strong> Tambah tipe kamar baru, kelola spesifikasi (luas, kasur), dan perbarui galeri foto kamar.</li>
            <li><strong>Facilities:</strong> Tambah fasilitas unggulan beserta foto-fotonya agar tampil di halaman hotel.</li>
          </ul>
        </div>
      </div>

    </div>
  );
}