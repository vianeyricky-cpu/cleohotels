"use client";

import { useEffect } from "react";
import Script from "next/script";

export function BookingWidget() {
  useEffect(() => {
    // Memuat CSS eksternal secara dinamis agar tidak merusak Tailwind global
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
        /* Menyesuaikan tinggi input form */
        .omnih .form-control {
          height: 45px !important;
          border-radius: 8px !important;
          font-size: 14px !important;
        }
        
        /* OVERRIDE WARNA TOMBOL BIRU MENJADI EMAS & SESUAIKAN FONT */
        .omnih .btn, .omnih .btn-primary {
          background-color: #ca8a04 !important; /* Warna Emas */
          border-color: #ca8a04 !important;
          color: #ffffff !important; /* Teks putih */
          height: 45px !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          font-size: 13px !important; /* <--- Font diperkecil agar lega */
          letter-spacing: 0.5px !important; /* <--- Jarak antar huruf */
          white-space: nowrap !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 0 16px !important; /* <--- Padding disesuaikan */
          transition: all 0.3s ease !important;
        }

        /* WARNA TOMBOL SAAT DI-HOVER (Emas Gelap) */
        .omnih .btn:hover, .omnih .btn-primary:hover {
          background-color: #a16207 !important; 
          border-color: #a16207 !important;
        }

        /* Memaksa form menjadi horizontal (sejajar) di layar besar */
        @media (min-width: 992px) {
          .omnih .row {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
          }
          .omnih .col-md-12, .omnih .col-lg-[auto] {
            flex: 1;
            padding: 0 5px;
          }
          .omnih .form-group {
            margin-bottom: 0 !important;
          }
        }
      `}} />

      {/* --- AREA WIDGET --- */}
      <div id="app" className="omnih text-left text-gray-800">
        {/* @ts-ignore */} 
        <group-calendar-form group="46" group-by-area="yes" isfallbackcalendar="true" />
      </div>

      {/* --- SCRIPT LOAD --- */}
      <Script 
        src="https://omnihotelier.id/js/omnih-group-calendar.v.1.js" 
        strategy="lazyOnload" 
      />
    </div>
  );
}