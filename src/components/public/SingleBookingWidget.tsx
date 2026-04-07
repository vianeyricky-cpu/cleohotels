"use client";

import { useEffect } from "react";
import Script from "next/script";

export function SingleBookingWidget({ slug }: { slug: string }) {
  // --- MAPPING ID HOTEL (PERBAIKAN) ---
  // Menggunakan .includes() agar kebal terhadap variasi slug dari database 
  // (misal slug-nya "cleo-hotel-walikota" tetap akan terbaca "walikota")
  let propertyId = "296"; // Default fallback (Tunjungan)
  
  const normalizedSlug = slug.toLowerCase();
  if (normalizedSlug.includes("jemursari")) {
    propertyId = "297";
  } else if (normalizedSlug.includes("walikota")) {
    propertyId = "298";
  } else if (normalizedSlug.includes("tunjungan")) {
    propertyId = "296";
  }

  useEffect(() => {
    // 1. Load CSS Eksternal
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

    // 2. AUTO-SELECT HOTEL HACK (PERBAIKAN EVENT VUE)
    const interval = setInterval(() => {
      const selects = document.querySelectorAll('.omnih select');
      if (selects.length > 0) {
        // Cari dropdown yang memiliki opsi hotel dengan ID kita
        const propertySelect = Array.from(selects).find(select => 
          Array.from((select as HTMLSelectElement).options).some(opt => opt.value === propertyId)
        ) as HTMLSelectElement;

        if (propertySelect) {
          if (propertySelect.value !== propertyId) {
            // Paksa pilih hotel
            propertySelect.value = propertyId;
            
            // PERBAIKAN: Trigger 'input' dan 'change' agar state Vue/OmniHotelier benar-benar terupdate
            propertySelect.dispatchEvent(new Event('input', { bubbles: true }));
            propertySelect.dispatchEvent(new Event('change', { bubbles: true }));
          }
          // Berhenti mencari jika sudah sukses
          clearInterval(interval);
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [propertyId]);

  return (
    <div className="w-full bg-white rounded-xl shadow-2xl p-4 md:p-6 border border-gray-200 relative z-20">
      
      {/* --- CUSTOM CSS OVERRIDES --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* 1. SEMBUNYIKAN DROPDOWN HOTEL (KOLOM PERTAMA) */
        .omnih .row > div:nth-child(1) {
          display: none !important;
        }

        /* 2. MERAPIKAN LABEL DAN INPUT */
        .omnih label {
          font-size: 11px !important;
          font-weight: 700 !important;
          color: #4b5563 !important;
          margin-bottom: 4px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
        }

        .omnih .form-control {
          height: 48px !important;
          border-radius: 8px !important;
          font-size: 14px !important;
          box-shadow: none !important;
          border: 1px solid #d1d5db !important;
        }
        
        /* 3. OVERRIDE WARNA TOMBOL MENJADI EMAS */
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
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 0 24px !important; 
          transition: all 0.3s ease !important;
          width: 100% !important;
        }

        .omnih .btn:hover, .omnih .btn-primary:hover {
          background-color: #a16207 !important; 
          border-color: #a16207 !important;
        }

        /* 4. MEMAKSA FORM SEJAJAR 1 BARIS (DESKTOP) */
        @media (min-width: 992px) {
          .omnih .row {
            display: flex !important;
            flex-wrap: nowrap !important;
            align-items: flex-end !important;
            justify-content: space-between !important;
            gap: 12px !important;
            margin: 0 !important;
          }
          .omnih .row > div {
            flex: 1 1 auto !important;
            padding: 0 !important;
          }
          .omnih .row > div:last-child {
            flex: 0 0 auto !important;
            min-width: 180px !important;
          }
          .omnih .form-group {
            margin-bottom: 0 !important;
          }
        }

        /* 5. LAYOUT UNTUK HP (2 BARIS RAPI) */
        @media (max-width: 991px) {
          .omnih .row {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 10px !important;
            margin: 0 !important;
          }
          .omnih .row > div {
            flex: 1 1 45% !important;
            padding: 0 !important;
          }
          .omnih .row > div:last-child {
            flex: 1 1 100% !important;
            margin-top: 8px !important;
          }
        }
      `}} />

      {/* --- AREA WIDGET --- */}
      <div id="app" className="omnih text-left text-gray-800" key={slug}>
        {/* @ts-ignore */} 
        <group-calendar-form group="46" isfallbackcalendar="true"></group-calendar-form>
      </div>

      {/* --- SCRIPT LOAD --- */}
      <Script 
        key={`omni-script-${slug}`}
        src="https://omnihotelier.id/js/omnih-group-calendar.v.1.js" 
        strategy="lazyOnload" 
      />
    </div>
  );
}