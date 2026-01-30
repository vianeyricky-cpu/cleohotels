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
  image_url?: string | null;
  images?: string[];
  maps_url?: string | null;
  google_maps_link?: string | null;
};

// --- ROOM TYPE (FIXED) ---
export type Room = {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  
  // Pastikan tipe data ini sesuai dengan Actions dan DB
  size: number;      
  capacity: number;  
  price: number;     
  bedType: string;   
  amenities: string | null; // <--- WAJIB STRING (Bukan string[])

  image: string | null;
  images: string[];
  created_at?: string;
};

// --- FACILITY TYPE ---
export type Facility = {
  id: string;
  hotelId: string;
  name: string;
  type: string;
  description: string;
  image: string | null; 
  images: string[];     
  created_at?: string;
};

export type HotelWithRelations = Hotel & {
  rooms: Room[];
  facilities: Facility[];
};

export type HotelWithImages = Hotel & {
  images?: string[] | null;
};