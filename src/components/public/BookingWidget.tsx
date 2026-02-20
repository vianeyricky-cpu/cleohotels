"use client";

import { useEffect } from "react";
import Script from "next/script";

export function BookingWidget() {
  useEffect(() => {
    // Kita perlu memuat CSS Bootstrap & Omni secara manual di komponen ini saja
    // Agar tidak merusak style Tailwind di halaman lain.
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

    return () => {
      // Cleanup (Opsional: Hapus CSS saat pindah halaman agar tidak bentrok)
      // cssLinks.forEach(href => {
      //   const link = document.querySelector(`link[href="${href}"]`);
      //   if (link) document.head.removeChild(link);
      // });
    };
  }, []);

  return (
    <div className="w-full bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
      {/* Area Widget */}
      <div id="app" className="omnih p-4">
        {/* Custom Element dari Omni Hotelier */}
        {/* @ts-ignore */} 
        <group-calendar-form group="46" group-by-area="yes" isfallbackcalendar="true" />
      </div>

      {/* Script Load */}
      <Script 
        src="https://omnihotelier.id/js/omnih-group-calendar.v.1.js" 
        strategy="lazyOnload" 
      />
    </div>
  );
}