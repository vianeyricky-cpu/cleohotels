// --- HOTEL TYPE ---
export type Hotel = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  instagram: string;
  created_at?: string;

  // --- FIELD BARU (Update Homepage & Maps) ---
  // Menggunakan '| null' agar aman jika data database kosong
  image_url?: string | null;       // Foto Hero Utama
  maps_url?: string | null;        // Link Iframe Google Maps
  google_maps_link?: string | null; // Link Tombol ke Google Maps
};

// --- ROOM TYPE ---
export type Room = {
  id: string;
  hotelId: string;
  name: string;
  size: string;
  capacity: string;
  description: string;
  amenities: string[];

  // --- FIELD GAMBAR ---
  image: string | null; // Foto Utama/Thumbnail (Legacy)
  images: string[];     // Galeri Foto (Carousel) - Array of strings
};

// --- FACILITY TYPE ---
export type Facility = {
  id: string;
  hotelId: string;
  name: string;
  type: string;
  description: string;

  // --- FIELD GAMBAR ---
  image: string | null; // Foto Utama/Thumbnail (Legacy)
  images: string[];     // Galeri Foto (Carousel) - Array of strings
};

// --- RELATIONS (Untuk Halaman Detail) ---
export type HotelWithRelations = Hotel & {
  rooms: Room[];
  facilities: Facility[];
};

// --- OPTIONAL (Jika masih dipakai di komponen lama) ---
export type HotelWithImages = Hotel & {
  images?: string[] | null;
};