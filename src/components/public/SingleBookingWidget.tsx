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
        // Cari index opsi yang valuenya "298" (Walikota)
        const targetIndex = Array.from(select.options).findIndex(opt => opt.value === targetId);
        
        if (targetIndex !== -1 && select.value !== targetId) {
          // Paksa ubah dropdown yang tersembunyi
          select.selectedIndex = targetIndex;
          select.value = targetId;
          
          // Beri tahu sistem Omnihotelier bahwa kita sudah mengubahnya
          select.dispatchEvent(new Event('input', { bubbles: true }));
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }, 100);

    // Hentikan interval setelah 3 detik (waktu yang cukup untuk menimpa Vue)
    setTimeout(() => clearInterval(interval), 3000);

    return () => clearInterval(interval);
  }, [slug]);

  return (
    <div className="w-full bg-white rounded-xl shadow-2xl p-4 md:p-6 border border-gray-200 relative z-20">
      
      <style dangerouslySetInnerHTML={{ __html: `
        /* 1. SEMBUNYIKAN DROPDOWN HOTEL (KOLOM PERTAMA) */
        .omnih .row > div:nth-child(1) { display: none !important; }

        /* 2. MERAPIKAN LABEL DAN INPUT */
        .omnih label { font-size: 11px !important; font-weight: 700 !important; color: #4b5563 !important; margin-bottom: 4px !important; text-transform: uppercase !important; }
        .omnih .form-control { height: 48px !important; border-radius: 8px !important; font-size: 14px !important; box-shadow: none !important; border: 1px solid #d1d5db !important; }
        
        /* 3. OVERRIDE WARNA TOMBOL MENJADI EMAS */
        .omnih .btn, .omnih .btn-primary { background-color: #ca8a04 !important; border-color: #ca8a04 !important; color: #ffffff !important; height: 48px !important; border-radius: 8px !important; font-weight: 700 !important; font-size: 13px !important; width: 100% !important; display: flex !important; align-items: center !important; justify-content: center !important; transition: all 0.3s ease !important; }
        .omnih .btn:hover, .omnih .btn-primary:hover { background-color: #a16207 !important; }
        
        /* 4. MEMAKSA FORM SEJAJAR 1 BARIS (DESKTOP) */
        @media (min-width: 992px) {
          .omnih .row { display: flex !important; flex-wrap: nowrap !important; align-items: flex-end !important; justify-content: space-between !important; gap: 12px !important; margin: 0 !important; }
          .omnih .row > div { flex: 1 1 auto !important; padding: 0 !important; }
          .omnih .row > div:last-child { flex: 0 0 auto !important; min-width: 180px !important; }
          .omnih .form-group { margin-bottom: 0 !important; }
        }
        
        /* 5. LAYOUT UNTUK HP (2 BARIS RAPI) */
        @media (max-width: 991px) {
          .omnih .row { display: flex !important; flex-wrap: wrap !important; gap: 10px !important; margin: 0 !important; }
          .omnih .row > div { flex: 1 1 45% !important; padding: 0 !important; }
          .omnih .row > div:last-child { flex: 1 1 100% !important; margin-top: 8px !important; }
        }
      `}} />

      <div id="app" className="omnih text-left text-gray-800" key={slug}>
        {/* Panggil form standar, Javascript di atas yang akan memanipulasinya */}
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