"use client";

import { useEffect } from "react";
import Script from "next/script";

export function BookingWidget({ defaultHotelSlug }: { defaultHotelSlug?: string }) {
  useEffect(() => {
    // 1. Load CSS Eksternal milik Omnihotelier dan Bootstrap
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
    <div className="w-full bg-[#1c1c1c] text-white rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-black/30 border border-white/5 relative z-30">
      
      {/* --- CUSTOM CSS OVERRIDES UNTUK TEMA DARK MODE CLEO HOTELS --- */}
      {/* Widget asli menggunakan bootstrap putih, kita timpa dengan CSS ini agar sesuai dengan desain UI Anda */}
      <style dangerouslySetInnerHTML={{ __html: `
        .omnih {
          font-family: inherit !important;
        }
        
        /* Merapikan layout row menjadi 1 baris di mode Desktop */
        @media (min-width: 992px) {
          .omnih .row {
            display: flex !important;
            flex-wrap: nowrap !important;
            align-items: flex-end !important;
            margin: 0 -8px !important;
            gap: 12px !important;
          }
          .omnih .row > div {
            padding: 0 !important;
            flex: 1 1 auto !important;
          }
          /* Kolom tombol search jangan ikut melebar berlebihan */
          .omnih .row > div:last-child {
            flex: 0 0 auto !important;
            min-width: 180px !important;
          }
        }

        /* Label Input Form */
        .omnih label {
          display: block !important;
          font-size: 10px !important;
          font-weight: 700 !important;
          color: #9ca3af !important; 
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          margin-bottom: 8px !important;
        }

        /* Input Text & Select & Date */
        .omnih .form-control {
          width: 100% !important;
          background-color: #2a2a2a !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #ffffff !important;
          font-size: 14px !important;
          border-radius: 0.75rem !important; 
          padding: 14px 16px !important; 
          height: 50px !important;
          box-shadow: none !important;
        }
        
        /* Ubah warna icon kalender bawaan browser agar putih (terlihat di dark mode) */
        .omnih input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }

        /* Kustomisasi Dropdown Panah */
        .omnih select.form-control {
          appearance: none !important;
          -webkit-appearance: none !important;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 16px center !important;
          cursor: pointer;
        }

        /* Tombol Check Availability */
        .omnih .btn-primary {
          background-color: #1a56db !important;
          border: none !important;
          color: white !important;
          font-size: 11px !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          padding: 0 32px !important;
          border-radius: 0.75rem !important;
          height: 50px !important;
          width: 100% !important;
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2) !important;
          transition: all 0.3s ease !important;
          white-space: nowrap !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .omnih .btn-primary:hover {
          background-color: #1d4ed8 !important; 
        }

        /* Sembunyikan pesan error bawah input agar form tidak goyang */
        .omnih .help-block {
          display: none !important;
        }
      `}} />

      {/* --- AREA WIDGET OMNIHOTELIER ASLI --- */}
      <div id="app" className="omnih">
        {/* @ts-ignore */}
        <group-calendar-form group="46" group-by-area="yes" isfallbackcalendar="true"></group-calendar-form>
      </div>

      {/* --- SCRIPT LOAD OMNIHOTELIER --- */}
      <Script 
        src="https://omnihotelier.id/js/omnih-group-calendar.v.1.js" 
        strategy="lazyOnload" 
      />
    </div>
  );
}