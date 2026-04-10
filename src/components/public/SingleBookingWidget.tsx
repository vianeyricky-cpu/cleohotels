"use client";

import { useEffect } from "react";
import Script from "next/script";

// MENGHILANGKAN ERROR TYPESCRIPT
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
        link.href = href; link.rel = "stylesheet"; document.head.appendChild(link);
      }
    });

    // 2. SCRIPT PEMAKSA VUE (AUTO-SELECT DI BELAKANG LAYAR)
    let targetId = "296"; // Default Tunjungan
    const s = slug.toLowerCase();
    
    if (s.includes("jemursari")) {
      targetId = "297";
    } else if (s.includes("walikota") || s.includes("mustajab") || s.includes("balaikota")) {
      targetId = "298";
    } else if (s.includes("tunjungan")) {
      targetId = "296";
    }

    // Interval super cepat untuk menimpa pilihan default Vue
    const interval = setInterval(() => {
      const select = document.querySelector('.omnih select') as HTMLSelectElement;
      
      if (select && select.options.length > 0) {
        const targetIndex = Array.from(select.options).findIndex(opt => opt.value === targetId);
        
        if (targetIndex !== -1 && select.value !== targetId) {
          select.selectedIndex = targetIndex;
          select.value = targetId;
          
          select.dispatchEvent(new Event('input', { bubbles: true }));
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }, 100);

    setTimeout(() => clearInterval(interval), 3000);

    return () => clearInterval(interval);
  }, [slug]);

  return (
    // UBAH WARNA BACKGROUND LUAR MENJADI HITAM (#1e1e1e) DAN TEKS PUTIH
    <div className="w-full bg-[#1e1e1e] text-white rounded-xl md:rounded-[2rem] shadow-2xl p-4 md:p-6 border border-[#2a2a2a] relative z-20">
      
      <style dangerouslySetInnerHTML={{ __html: `
        .omnih { font-family: inherit !important; }

        /* 1. SEMBUNYIKAN DROPDOWN HOTEL (KOLOM PERTAMA) */
        .omnih .row > div:nth-child(1) { display: none !important; }

        /* 2. MERAPIKAN LABEL (TEMA GELAP) */
        .omnih label { 
          font-size: 10px !important; 
          font-weight: 700 !important; 
          color: #9ca3af !important; /* Abu-abu terang agar terbaca di hitam */
          margin-bottom: 8px !important; 
          text-transform: uppercase !important; 
          letter-spacing: 0.05em !important;
        }

        /* 3. MERAPIKAN INPUT FORM (TEMA GELAP) */
        .omnih .form-control { 
          height: 48px !important; 
          border-radius: 0.75rem !important; 
          font-size: 13px !important; 
          box-shadow: none !important; 
          background-color: #2a2a2a !important; /* Hitam pudar untuk kotak input */
          border: 1px solid transparent !important; 
          color: #ffffff !important; /* Teks di dalam input jadi putih */
          padding: 0 12px !important;
        }

        /* Mengubah ikon kalender bawaan browser menjadi warna putih (invert) */
        .omnih input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
          opacity: 0.7;
        }
        
        /* 4. WARNA TOMBOL (EMAS/GOLD) */
        .omnih .btn, .omnih .btn-primary { 
          background-color: #ca8a04 !important; 
          border: none !important; 
          color: #ffffff !important; 
          height: 48px !important; 
          border-radius: 0.75rem !important; 
          font-weight: 800 !important; 
          font-size: 12px !important; 
          width: 100% !important; 
          display: flex !important; 
          align-items: center !important; 
          justify-content: center !important; 
          transition: all 0.3s ease !important; 
          text-transform: uppercase !important;
        }
        .omnih .btn:hover, .omnih .btn-primary:hover { background-color: #a16207 !important; }
        
        /* 5. MEMAKSA FORM SEJAJAR 1 BARIS (DESKTOP) */
        @media (min-width: 992px) {
          .omnih .row { display: flex !important; flex-wrap: nowrap !important; align-items: flex-end !important; justify-content: space-between !important; gap: 12px !important; margin: 0 !important; }
          .omnih .row > div { flex: 1 1 auto !important; padding: 0 !important; }
          .omnih .row > div:last-child { flex: 0 0 auto !important; min-width: 180px !important; }
          .omnih .form-group { margin-bottom: 0 !important; }
        }
        
        /* 6. LAYOUT UNTUK HP (2 BARIS RAPI) */
        @media (max-width: 991px) {
          .omnih .row { display: flex !important; flex-wrap: wrap !important; gap: 10px !important; margin: 0 !important; }
          .omnih .row > div { flex: 1 1 45% !important; padding: 0 !important; }
          .omnih .row > div:last-child { flex: 1 1 100% !important; margin-top: 8px !important; }
        }
      `}} />

      <div id="app" className="omnih text-left text-white" key={slug}>
        <group-calendar-form group="46" isfallbackcalendar="true"></group-calendar-form>
      </div>

      <Script 
        key={`omni-script-${slug}`}
        src="https://omnihotelier.id/js/omnih-group-calendar.v.1.js" 
        strategy="lazyOnload" 
      />
    </div>
  );
}