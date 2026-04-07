"use client";

import { useEffect } from "react";
import Script from "next/script";

// === MENGHILANGKAN ERROR TYPESCRIPT ===
// Mengajari TypeScript bahwa <group-calendar-form> adalah tag yang sah
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'group-calendar-form': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        group?: string;
        property?: string;
        isfallbackcalendar?: string;
      };
    }
  }
}

export function SingleBookingWidget({ slug }: { slug: string }) {
  // --- MAPPING ID HOTEL (AKURAT & ROBUST) ---
  let propertyId = "296"; // Default fallback (Tunjungan)
  
  const normalizedSlug = slug.toLowerCase();
  if (normalizedSlug.includes("jemursari")) {
    propertyId = "297";
  } else if (normalizedSlug.includes("walikota") || normalizedSlug.includes("balaikota") || normalizedSlug.includes("mustajab")) {
    propertyId = "298";
  } else if (normalizedSlug.includes("tunjungan")) {
    propertyId = "296";
  }

  useEffect(() => {
    // HANYA LOAD CSS EKSTERNAL
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
        <group-calendar-form 
          group="46" 
          property={propertyId} 
          isfallbackcalendar="true">
        </group-calendar-form>
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