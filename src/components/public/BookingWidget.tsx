"use client";

import { useEffect } from "react";

export function BookingWidget({ defaultHotelSlug }: { defaultHotelSlug?: string }) {
  useEffect(() => {
    // 1. Memuat CSS Eksternal
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

    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://omnihotelier.id/js/omnih-group-calendar.v.1.js";
    script.async = true;
    document.body.appendChild(script);

    // 3. LOGIKA AUTO-SELECT BERDASARKAN "ID HOTEL" (DIJAMIN AKURAT)
    let propertyId = "296"; // Default ke Tunjungan
    
    if (defaultHotelSlug) {
      const slug = defaultHotelSlug.toLowerCase();
      if (slug.includes("jemursari")) {
        propertyId = "297";
      } else if (slug.includes("walikota")) {
        propertyId = "298";
      } else if (slug.includes("tunjungan")) {
        propertyId = "296";
      }
    }

    let checkInterval: NodeJS.Timeout;

    if (defaultHotelSlug) {
      checkInterval = setInterval(() => {
        const selects = document.querySelectorAll('.omnih select');
        
        if (selects.length > 0) {
          selects.forEach((select) => {
            const selectElement = select as HTMLSelectElement;
            
            // Cek apakah dropdown ini memiliki opsi dengan ID Hotel kita (296/297/298)
            const hasOurProperty = Array.from(selectElement.options).some(opt => opt.value === propertyId);

            if (hasOurProperty) {
              // Jika dropdown-nya ketemu, paksa ubah nilainya
              if (selectElement.value !== propertyId) {
                selectElement.value = propertyId;
                selectElement.dispatchEvent(new Event('input', { bubbles: true }));
                selectElement.dispatchEvent(new Event('change', { bubbles: true }));
              } else {
                // Jika nilainya SUDAH BENAR menempel di ID yang kita mau, baru matikan intervalnya
                clearInterval(checkInterval);
              }
            }
          });
        }
      }, 200); // Lakukan pengecekan sangat cepat (setiap 200ms)
      
      // Keamanan: Hentikan interval otomatis setelah 10 detik
      setTimeout(() => clearInterval(checkInterval), 10000);
    }

    // 4. Cleanup
    return () => {
      const s = document.getElementById(scriptId);
      if (s) s.remove();
      if (checkInterval) clearInterval(checkInterval); 
    };
  }, [defaultHotelSlug]);

  return (
    <div className="w-full max-w-7xl mx-auto bg-[#1e1e1e] text-white rounded-2xl md:rounded-[2rem] p-4 md:p-6 shadow-2xl border border-[#2a2a2a] relative z-30">
      
      <style dangerouslySetInnerHTML={{ __html: `
        .omnih {
          font-family: inherit !important;
        }

        /* --- 1. PAKSA 1 BARIS DI DESKTOP --- */
        @media (min-width: 1024px) {
          .omnih .row {
            display: flex !important;
            flex-wrap: nowrap !important;
            align-items: flex-end !important;
            gap: 12px !important; 
            margin: 0 !important;
            width: 100% !important;
          }
          .omnih .row > div {
            padding: 0 !important;
            flex: 1 1 auto !important; 
            width: auto !important;
            max-width: none !important;
            min-width: 0 !important; 
          }
          .omnih .row > div:last-child {
            flex: 0 0 auto !important;
          }
        }

        /* --- 2. PERBAIKAN DI MOBILE --- */
        @media (max-width: 1023px) {
          .omnih .row {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 12px !important;
            margin: 0 !important;
          }
          .omnih .row > div {
            padding: 0 !important;
            flex: 1 1 calc(50% - 6px) !important;
          }
          .omnih .row > div:last-child {
            flex: 1 1 100% !important;
            margin-top: 8px !important;
          }
        }

        /* --- 3. KUNCI UKURAN AMAN MASING-MASING INPUT --- */
        .omnih .form-control {
          width: 100% !important;
          background-color: #2a2a2a !important;
          border: 1px solid transparent !important;
          color: #ffffff !important;
          font-size: 13px !important;
          border-radius: 0.75rem !important; 
          padding: 0 12px !important; 
          height: 48px !important;
          box-shadow: none !important;
        }

        .omnih input[type="date"].form-control {
          min-width: 130px !important;
        }

        .omnih input[type="text"].form-control {
          min-width: 100px !important;
        }

        .omnih select.form-control {
          min-width: 65px !important;
          appearance: none !important;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 10px center !important;
          padding-right: 28px !important;
          cursor: pointer;
        }

        /* --- 4. STYLING KECIL LAINNYA --- */
        .omnih label {
          display: block !important;
          font-size: 10px !important;
          font-weight: 700 !important;
          color: #9ca3af !important; 
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          margin-bottom: 8px !important;
          white-space: nowrap !important; 
          overflow: hidden !important;
          text-overflow: ellipsis !important; 
        }

        .omnih input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
          opacity: 0.7;
        }

        .omnih .btn-primary {
          background-color: #2563eb !important;
          border: none !important;
          color: white !important;
          font-size: 12px !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          border-radius: 0.75rem !important;
          height: 48px !important;
          padding: 0 24px !important;
          transition: background-color 0.3s ease !important;
        }
        
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