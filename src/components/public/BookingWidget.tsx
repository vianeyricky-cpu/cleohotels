"use client";

import { useEffect } from "react";
import Script from "next/script";

export function BookingWidget({ defaultHotelSlug }: { defaultHotelSlug?: string }) {
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
    <div className="w-full max-w-7xl mx-auto bg-[#1e1e1e] text-white rounded-2xl md:rounded-[2rem] p-4 md:p-6 shadow-2xl border border-[#2a2a2a] relative z-30">
      
      <style dangerouslySetInnerHTML={{ __html: `
        .omnih {
          font-family: inherit !important;
        }
        
        /* 1. RESET FLEXBOX UTAMA (Anti-Tabrak) */
        .omnih .row {
          display: flex !important;
          flex-wrap: wrap !important; /* WAJIB WRAP: Biarkan turun baris jika layar tidak muat */
          align-items: flex-end !important;
          gap: 16px 12px !important; /* Jarak vertikal 16px, horizontal 12px */
          margin: 0 !important;
        }

        /* 2. STYLING KOLOM FLEKSIBEL */
        .omnih .row > div {
          padding: 0 !important;
          flex: 1 1 130px !important; /* Setiap kolom bisa membesar/mengecil dengan ukuran dasar 130px */
          min-width: 0 !important; /* Mencegah kolom meluber keluar dari container */
        }

        /* 3. PROTEKSI LABEL AGAR TIDAK TUMPUK */
        .omnih label {
          display: block !important;
          font-size: 10px !important;
          font-weight: 700 !important;
          color: #9ca3af !important; 
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          margin-bottom: 8px !important;
          white-space: nowrap !important; /* Paksa teks label 1 baris */
          overflow: hidden !important;
          text-overflow: ellipsis !important; /* Beri titik-titik jika label kepanjangan */
        }

        /* 4. STANDARISASI KOTAK INPUT */
        .omnih .form-control {
          width: 100% !important;
          min-width: 60px !important; /* Batas aman terkecil untuk input */
          background-color: #2a2a2a !important;
          border: 1px solid transparent !important;
          color: #ffffff !important;
          font-size: 13px !important;
          border-radius: 0.75rem !important; 
          padding: 0 12px !important; 
          height: 48px !important;
          box-shadow: none !important;
          transition: border-color 0.2s;
        }

        .omnih .form-control:focus {
          border-color: #3b82f6 !important;
          background-color: #333333 !important;
        }

        /* Custom Icon Kalender */
        .omnih input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
          opacity: 0.7;
        }

        /* Custom Icon Dropdown */
        .omnih select.form-control {
          appearance: none !important;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 14px center !important;
          padding-right: 32px !important;
          cursor: pointer;
        }

        /* 5. TOMBOL UTAMA */
        .omnih .btn-primary {
          background-color: #2563eb !important;
          border: none !important;
          color: white !important;
          font-size: 12px !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          border-radius: 0.75rem !important;
          height: 48px !important;
          width: 100% !important;
          min-width: 180px !important;
          transition: all 0.3s ease !important;
        }

        .omnih .btn-primary:hover {
          background-color: #1d4ed8 !important; 
          transform: translateY(-2px) !important;
        }

        /* Sembunyikan error text agar layout tidak goyang */
        .omnih .help-block {
          display: none !important;
        }
      `}} />

      <div id="app" className="omnih">
        {/* @ts-ignore */}
        <group-calendar-form group="46" group-by-area="yes" isfallbackcalendar="true"></group-calendar-form>
      </div>

      <Script 
        src="https://omnihotelier.id/js/omnih-group-calendar.v.1.js" 
        strategy="lazyOnload" 
      />
    </div>
  );
}