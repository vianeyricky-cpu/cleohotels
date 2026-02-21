"use client";

import { useEffect, useState } from "react";

export function SingleBookingWidget({ slug }: { slug: string }) {
  const [isMounted, setIsMounted] = useState(false);

  // --- MAPPING ID HOTEL ---
  // SANGAT PENTING: Harus berupa ANGKA. Jika diisi huruf (misal "ID_JEMURSARI"), widget akan BLANK.
  // Sementara saya isi "296" semua agar tidak blank. Nanti silakan ganti angka 296 di Jemursari & Walikota dengan ID asli mereka.
  const omniPropertyIds: Record<string, string> = {
    "jemursari": "296", // <--- GANTI ANGKA INI JIKA SUDAH DAPAT ID JEMURSARI
    "tunjungan": "296",
    "walikota": "296",  // <--- GANTI ANGKA INI JIKA SUDAH DAPAT ID WALIKOTA
  };

  const propertyId = omniPropertyIds[slug] || "296";

  useEffect(() => {
    setIsMounted(true);

    const cssLinks = [
      "https://omnihotelier.id/css/omnih-client.css",
      "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css",
      "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
    ];

    cssLinks.forEach((href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement("link");
        link.href = href;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
    });

    // FORCE RELOAD SINGLE SCRIPT
    const scriptId = "omni-booking-script-single";
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      document.body.removeChild(existingScript);
    }

    const script = document.createElement("script");
    script.id = scriptId;
    // Menggunakan script khusus Single Property
    script.src = `https://omnihotelier.id/js/omnih-client.v.1.js?t=${new Date().getTime()}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [slug]);

  if (!isMounted) return null;

  return (
    <div className="w-full bg-white rounded-xl shadow-2xl p-5 md:p-6 border border-gray-200">
      
      {/* CSS SUPER KETAT UNTUK MEMAKSA LAYOUT SEJAJAR SEPERTI CONTOH */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Reset jarak bawah label */
        .omnih label {
          font-size: 12px !important;
          color: #4b5563 !important;
          margin-bottom: 4px !important;
          font-weight: 600 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
        }

        /* Tinggi input box */
        .omnih .form-control { 
          height: 48px !important; 
          border-radius: 8px !important; 
          font-size: 14px !important; 
          border: 1px solid #d1d5db !important;
        }
        
        /* Tombol Emas */
        .omnih .btn, .omnih .btn-primary {
          background-color: #ca8a04 !important; 
          border-color: #ca8a04 !important; 
          color: #ffffff !important; 
          height: 48px !important; 
          border-radius: 8px !important; 
          font-weight: 700 !important;
          font-size: 13px !important; 
          letter-spacing: 1px !important; 
          white-space: nowrap !important;
          padding: 0 24px !important; 
          transition: all 0.3s ease !important;
          width: 100% !important;
        }
        .omnih .btn:hover, .omnih .btn-primary:hover {
          background-color: #a16207 !important; border-color: #a16207 !important;
        }

        /* MEMAKSA SEJAJAR 1 BARIS (DESKTOP) */
        @media (min-width: 992px) {
          .omnih .row { 
            display: flex !important; 
            flex-wrap: nowrap !important; /* Dilarang turun ke bawah */
            align-items: flex-end !important; 
            gap: 16px !important; 
            margin: 0 !important;
          }
          
          /* Membagi ruang dengan adil untuk input */
          .omnih .row > div { 
            flex: 1 1 0 !important; 
            padding: 0 !important; 
            max-width: 100% !important;
          }

          /* Mencegah kolom tombol ikut mengecil/membesar tak wajar */
          .omnih .row > div:last-child {
            flex: 0 0 auto !important;
          }
          
          .omnih .form-group { margin-bottom: 0 !important; }
        }

        /* LAYOUT UNTUK HP / TABLET (Dibikin 2 Baris) */
        @media (max-width: 991px) {
          .omnih .row {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 12px !important;
            margin: 0 !important;
          }
          .omnih .row > div {
            flex: 1 1 45% !important;
            padding: 0 !important;
          }
          .omnih .row > div:last-child {
            flex: 1 1 100% !important; /* Tombol jadi full width di HP */
            margin-top: 8px !important;
          }
        }
      `}} />

      {/* Area Form dari Omni (Menggunakan tag Single Property, TANPA DROPDOWN) */}
      <div id="app" className="omnih text-left text-gray-800 min-h-[80px]">
        {/* @ts-ignore */} 
        <calendar-form property={propertyId} isfallbackcalendar="true" />
      </div>

    </div>
  );
}