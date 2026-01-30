import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // 1. Izin untuk Supabase (Database Anda)
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      // 2. TAMBAHAN BARU: Izin untuk Unsplash (Gambar Placeholder)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);