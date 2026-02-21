"use client";

import { useEffect } from "react";
import Script from "next/script";

export function SingleBookingWidget({ slug }: { slug: string }) {
  // --- MAPPING ID HOTEL ---
  // Ganti "ID_JEMURSARI", dll dengan ID asli dari dashboard Omni Hotelier Anda
  const omniPropertyIds: Record<string, string> = {
    "jemursari": "297",
    "tunjungan": "296",
    "walikota": "298",
  };

  // Ambil ID sesuai URL saat ini. Jika tidak ketemu, pakai default.
  const propertyId = omniPropertyIds[slug] || "ID_DEFAULT";

  useEffect(() => {
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
    <div className="w-full bg-white rounded-xl shadow-2xl p-4 md:p-6 border border-gray-200">
      <style dangerouslySetInnerHTML={{ __html: `
        .omnih .form-control {
          height: 45px !important;
          border-radius: 8px !important;
          font-size: 14px !important;
        }
        
        /* OVERRIDE WARNA TOMBOL */
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
          padding: 0 16px !important;
          transition: all 0.3s ease !important;
        }

        .omnih .btn:hover, .omnih .btn-primary:hover {
          background-color: #a16207 !important; 
          border-color: #a16207 !important;
        }

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

      {/* Area Widget Single Property */}
      <div id="app" className="omnih text-left text-gray-800">
        {/* Perhatikan perbedaannya: Menggunakan <calendar-form> bukan <group-calendar-form> */}
        {/* @ts-ignore */} 
        <calendar-form property={propertyId} isfallbackcalendar="true" />
      </div>

      {/* Script Load Khusus Single Property */}
      <Script 
        src="https://omnihotelier.id/js/omnih-client.v.1.js" 
        strategy="lazyOnload" 
      />
    </div>
  );
}