"use client";

import { useEffect } from "react";
import Script from "next/script";

export function SingleBookingWidget({ slug }: { slug: string }) {
  // --- MAPPING ID HOTEL ---
  // Pastikan ID ini ANGKA. Nanti ganti 296 di Jemursari & Walikota dengan ID asli.
  const omniPropertyIds: Record<string, string> = {
    "jemursari": "296", 
    "tunjungan": "296",
    "walikota": "296",  
  };

  const propertyId = omniPropertyIds[slug] || "296";

  useEffect(() => {
    // Memuat CSS eksternal secara dinamis
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
  }, []);

  return (
    <div className="w-full bg-white rounded-xl shadow-2xl p-4 md:p-6 border border-gray-200 relative z-20">
      
      {/* --- CUSTOM CSS OVERRIDES --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Merapikan Label */
        .omnih label {
          font-size: 12px !important;
          font-weight: 600 !important;
          color: #4b5563 !important;
          margin-bottom: 4px !important;
        }

        /* Menyesuaikan tinggi input form */
        .omnih .form-control {
          height: 45px !important;
          border-radius: 8px !important;
          font-size: 14px !important;
          box-shadow: none !important;
        }
        
        /* OVERRIDE WARNA TOMBOL BIRU MENJADI EMAS */
        .omnih .btn, .omnih .btn-primary {
          background-color: #ca8a04 !important;
          border-color: #ca8a04 !important;
          color: #ffffff !important; 
          height: 45px !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          font-size: 13px !important; 
          letter-spacing: 0.5px !important; 
          white-space: nowrap !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 0 20px !important; 
          transition: all 0.3s ease !important;
        }

        .omnih .btn:hover, .omnih .btn-primary:hover {
          background-color: #a16207 !important; 
          border-color: #a16207 !important;
        }

        /* MEMAKSA FORM SEJAJAR 1 BARIS (DESKTOP) */
        @media (min-width: 992px) {
          .omnih .row {
            display: flex !important;
            flex-wrap: nowrap !important; /* Dilarang turun baris */
            align-items: flex-end !important;
            justify-content: space-between !important;
            margin: 0 !important;
          }
          .omnih .row > div {
            flex: 1 1 auto !important;
            padding: 0 5px !important;
          }
          /* Kolom tombol jangan membesar berlebihan */
          .omnih .row > div:last-child {
            flex: 0 0 auto !important;
          }
          .omnih .form-group {
            margin-bottom: 0 !important;
          }
        }
      `}} />

      {/* --- AREA WIDGET --- */}
      {/* Menggunakan tag kalender khusus untuk Single Property (Tanpa Dropdown) */}
      <div id="app" className="omnih text-left text-gray-800" key={propertyId}>
        {/* @ts-ignore */} 
        <calendar-form property={propertyId} isfallbackcalendar="true"></calendar-form>
      </div>

      {/* --- SCRIPT LOAD --- */}
      {/* Menggunakan script khusus Single Property milik Omni */}
      <Script 
        src="https://omnihotelier.id/js/omnih-client.v.1.js" 
        strategy="lazyOnload" 
      />
    </div>
  );
}