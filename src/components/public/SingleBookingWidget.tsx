"use client";

import { useEffect, useState } from "react";

export function SingleBookingWidget({ slug }: { slug: string }) {
  const [isMounted, setIsMounted] = useState(false);

  // --- MAPPING ID HOTEL ---
  const omniPropertyIds: Record<string, string> = {
    "jemursari": "ID_JEMURSARI", // Nanti isi dengan ID Jemursari
    "tunjungan": "296",
    "walikota": "ID_WALIKOTA",   // Nanti isi dengan ID Walikota
  };

  const propertyId = omniPropertyIds[slug] || "296";

  useEffect(() => {
    setIsMounted(true);

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

    // FORCE RELOAD SCRIPT (Solusi Kotak Putih/Blank)
    // Menambahkan timestamp agar browser dipaksa mengeksekusi ulang script Omni
    const scriptId = "omni-booking-script-single";
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      document.body.removeChild(existingScript);
    }

    const script = document.createElement("script");
    script.id = scriptId;
    // Kita gunakan script Group yang sudah PASTI JALAN di website Anda
    script.src = `https://omnihotelier.id/js/omnih-group-calendar.v.1.js?t=${new Date().getTime()}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [slug]);

  if (!isMounted) return null;

  return (
    <div className="w-full bg-white rounded-xl shadow-2xl p-4 md:p-6 border border-gray-200">
      
      {/* CSS untuk Tombol Warna Emas dan Rapikan Form */}
      <style dangerouslySetInnerHTML={{ __html: `
        .omnih .form-control { height: 45px !important; border-radius: 8px !important; font-size: 14px !important; }
        .omnih .btn, .omnih .btn-primary {
          background-color: #ca8a04 !important; border-color: #ca8a04 !important; color: #ffffff !important; 
          height: 45px !important; border-radius: 8px !important; font-weight: 600 !important;
          font-size: 13px !important; letter-spacing: 0.5px !important; white-space: nowrap !important;
          display: flex !important; align-items: center !important; justify-content: center !important;
          padding: 0 16px !important; transition: all 0.3s ease !important;
        }
        .omnih .btn:hover, .omnih .btn-primary:hover {
          background-color: #a16207 !important; border-color: #a16207 !important;
        }
        @media (min-width: 992px) {
          .omnih .row { display: flex; align-items: flex-end; justify-content: space-between; }
          .omnih .col-md-12, .omnih .col-lg-[auto] { flex: 1; padding: 0 5px; }
          .omnih .form-group { margin-bottom: 0 !important; }
        }
      `}} />

      {/* Area Form dari Omni */}
      <div id="app" className="omnih text-left text-gray-800 min-h-[80px]">
        {/* Menggunakan tag form yang terbukti jalan, tapi diselipkan property ID */}
        {/* @ts-ignore */} 
        <group-calendar-form group="46" property={propertyId} group-by-area="yes" isfallbackcalendar="true" />
      </div>

    </div>
  );
}