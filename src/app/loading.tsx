import Image from "next/image";

export default function GlobalLoading() {
  return (
    // Overlay full screen, posisi fixed agar selalu di atas
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm transition-all duration-300">
      
      <div className="relative flex flex-col items-center">
        {/* Render file GIF Anda */}
        <Image 
          src="/loading-cleo.gif" // Sesuaikan dengan nama file GIF di folder public Anda
          alt="Memuat halaman..." 
          width={120} 
          height={120} 
          className="object-contain"
          unoptimized // WAJIB ada agar animasi GIF tidak macet/diubah jadi gambar statis oleh Next.js
        />
        
        {/* Opsional: Teks loading di bawah GIF */}
        <p className="mt-4 text-sm font-bold text-gold-500 uppercase tracking-widest animate-pulse">
          Cleo Hotels
        </p>
      </div>

    </div>
  );
}