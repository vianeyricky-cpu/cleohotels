"use client";

import { useEffect, useRef } from "react";

export function SingleBookingWidget({ slug }: { slug: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // --- MAPPING ID HOTEL ---
  // Pastikan ID ini adalah ANGKA. Sementara saya isi 296 semua agar form mau muncul.
  // Segera ganti angka 296 di Jemursari & Walikota dengan ID asli dari Omni jika sudah dapat.
  const omniPropertyIds: Record<string, string> = {
    "jemursari": "296", 
    "tunjungan": "296",
    "walikota": "296",  
  };

  const propertyId = omniPropertyIds[slug] || "296";

  useEffect(() => {
    // 1. Load CSS
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

    // 2. INJECT HTML MANUAL (Ini rahasia agar tidak BLANK)
    // Kita buat elemennya manual agar React tidak ikut campur dan Vue bisa jalan
    if (containerRef.current) {
      containerRef.current.innerHTML = `
        <div id="app" class="omnih text-left text-gray-800 min-h-[80px]">
          <calendar-form property="${propertyId}" isfallbackcalendar="true"></calendar-form>
        </div>
      `;
    }

    // 3. LOAD SCRIPT SINGLE PROPERTY OMNI
    const scriptId = "omni-booking-script-single";
    const existingScript = document.getElementById(scriptId);
    
    // Hapus script lama jika user pindah halaman agar me-refresh form
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://omnihotelier.id/js/omnih-client.v.1.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        script.remove();
      }
    };
  }, [slug, propertyId]);

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
          box-shadow: none !important;
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
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
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
            flex: 1 1 48% !important;
            padding: 0 !important;
          }
          .omnih .row > div:last-child {
            flex: 1 1 100% !important; /* Tombol jadi full width di HP */
            margin-top: 8px !important;
          }
        }
      `}} />

      {/* Area yang disediakan untuk diisi oleh React Refs agar Vue bisa bekerja */}
      <div ref={containerRef}></div>

    </div>
  );
}