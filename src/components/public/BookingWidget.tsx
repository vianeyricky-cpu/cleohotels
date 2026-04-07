"use client";

import { useEffect } from "react";

export function BookingWidget({ defaultHotelSlug }: { defaultHotelSlug?: string }) {
  useEffect(() => {
    // 1. Memuat CSS
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

    // 2. Memuat JS Omnihotelier
    const scriptId = "omnih-booking-script";
    let existingScript = document.getElementById(scriptId);

    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://omnihotelier.id/js/omnih-group-calendar.v.1.js";
    script.async = true;
    document.body.appendChild(script);

    // 3. LOGIKA AUTO-SELECT (BRUTE-FORCE LOCK)
    let targetPropertyId = "296";
    // Tambahkan variasi nama Tunjungan jika slug tidak dikenali
    let targetTexts: string[] = ["tunjungan", "basuki rahmat"]; 

    if (defaultHotelSlug) {
      const s = defaultHotelSlug.toLowerCase();
      if (s.includes("jemursari")) {
        targetPropertyId = "297";
        targetTexts = ["jemursari"];
      } else if (s.includes("walikota") || s.includes("mustajab")) {
        targetPropertyId = "298";
        targetTexts = ["walikota", "mustajab", "balaikota"];
      } else if (s.includes("tunjungan")) {
        targetPropertyId = "296";
        targetTexts = ["tunjungan", "basuki rahmat"];
      }
    }

    let checkInterval: NodeJS.Timeout;
    let forceKeepAlive = 0; // Penghitung untuk menahan pilihan dari reset Vue

    if (defaultHotelSlug) {
      checkInterval = setInterval(() => {
        const selects = document.querySelectorAll('.omnih select');

        if (selects.length > 0) {
          let foundOption = false;

          selects.forEach((select) => {
            const selectElement = select as HTMLSelectElement;
            const options = Array.from(selectElement.options);

            const targetIndex = options.findIndex(opt =>
              opt.value === targetPropertyId ||
              targetTexts.some(text => opt.text.toLowerCase().includes(text))
            );

            if (targetIndex !== -1) {
              foundOption = true;
              const correctValue = options[targetIndex].value;

              // Jika Vue mencoba me-reset nilainya, paksa kembalikan!
              if (selectElement.value !== correctValue) {
                selectElement.value = correctValue;
                selectElement.dispatchEvent(new Event('input', { bubbles: true }));
                selectElement.dispatchEvent(new Event('change', { bubbles: true }));
              }
            }
          });

          if (foundOption) {
            forceKeepAlive++;
            // KUNCI UTAMA: Pertahankan pilihan selama ~2 detik (10 kali interval)
            // agar Vue tidak sempat meresetnya kembali ke Tunjungan
            if (forceKeepAlive >= 10) {
              clearInterval(checkInterval);
            }
          }
        }
      }, 200);

      // Batas maksimal keamanan (matikan total setelah 8 detik)
      setTimeout(() => clearInterval(checkInterval), 8000);
    }

    return () => {
      const s = document.getElementById(scriptId);
      if (s) s.remove();
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [defaultHotelSlug]);

  return (
    <div className="w-full max-w-7xl mx-auto bg-[#1e1e1e] text-white rounded-2xl md:rounded-[2rem] p-4 md:p-6 shadow-2xl border border-[#2a2a2a] relative z-30">
      
      <style dangerouslySetInnerHTML={{ __html: `
        .omnih { font-family: inherit !important; }
        @media (min-width: 1024px) {
          .omnih .row { display: flex !important; flex-wrap: nowrap !important; align-items: flex-end !important; gap: 12px !important; margin: 0 !important; width: 100% !important; }
          .omnih .row > div { padding: 0 !important; flex: 1 1 auto !important; width: auto !important; max-width: none !important; min-width: 0 !important; }
          .omnih .row > div:last-child { flex: 0 0 auto !important; }
        }
        @media (max-width: 1023px) {
          .omnih .row { display: flex !important; flex-wrap: wrap !important; gap: 12px !important; margin: 0 !important; }
          .omnih .row > div { padding: 0 !important; flex: 1 1 calc(50% - 6px) !important; }
          .omnih .row > div:last-child { flex: 1 1 100% !important; margin-top: 8px !important; }
        }
        .omnih .form-control { width: 100% !important; background-color: #2a2a2a !important; border: 1px solid transparent !important; color: #ffffff !important; font-size: 13px !important; border-radius: 0.75rem !important; padding: 0 12px !important; height: 48px !important; box-shadow: none !important; }
        .omnih select.form-control { min-width: 65px !important; appearance: none !important; background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important; background-repeat: no-repeat !important; background-position: right 10px center !important; padding-right: 28px !important; cursor: pointer; }
        .omnih label { display: block !important; font-size: 10px !important; font-weight: 700 !important; color: #9ca3af !important; text-transform: uppercase !important; letter-spacing: 0.05em !important; margin-bottom: 8px !important; white-space: nowrap !important; }
        .omnih .btn-primary { background-color: #2563eb !important; border: none !important; color: white !important; font-size: 12px !important; font-weight: 800 !important; text-transform: uppercase !important; border-radius: 0.75rem !important; height: 48px !important; padding: 0 24px !important; transition: all 0.3s ease !important; }
        .omnih .btn-primary:hover { background-color: #1d4ed8 !important; }
        .omnih .help-block { display: none !important; }
      `}} />

      <div id="app" className="omnih">
        {/* @ts-ignore */}
        <group-calendar-form group="46" group-by-area="yes" isfallbackcalendar="true"></group-calendar-form>
      </div>

    </div>
  );
}