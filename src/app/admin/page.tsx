export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-navy-950 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Ringkasan */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Total Hotels</h3>
          <p className="text-4xl font-bold text-navy-950 mt-2">3</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Total Rooms</h3>
          <p className="text-4xl font-bold text-navy-950 mt-2">--</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Messages</h3>
          <p className="text-4xl font-bold text-navy-950 mt-2">0</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Quick Guide</h2>
        <p className="text-gray-600">
          Selamat datang di CMS Cleo Hotels. Gunakan menu di sebelah kiri untuk mengelola konten website.
          <br />
          - **Hotels**: Ubah deskripsi, foto utama, link maps, dan info kontak hotel.
          - **Rooms**: Tambah atau edit tipe kamar dan fotonya.
        </p>
      </div>
    </div>
  );
}