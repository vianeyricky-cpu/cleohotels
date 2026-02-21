"use client";

export function SingleBookingWidget({ slug }: { slug: string }) {
  // --- MAPPING ID HOTEL ---
  // Pastikan ID ini adalah ANGKA (misal: "296"). 
  // Jika diisi huruf, form akan menolak untuk muncul.
  const omniPropertyIds: Record<string, string> = {
    "jemursari": "296", // <--- UPDATE ANGKA INI NANTI
    "tunjungan": "296",
    "walikota": "296",  // <--- UPDATE ANGKA INI NANTI
  };

  const propertyId = omniPropertyIds[slug] || "296";

  // --- KODE HTML ISOLASI UNTUK OMNI ---
  // Kita membuat "website mini" di dalam website utama agar script Omni bisa hidup tenang
  const iframeContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <base target="_top"> <link href="https://omnihotelier.id/css/omnih-client.css" rel="stylesheet">
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
      
      <style>
        /* Reset Body Iframe */
        body { margin: 0; padding: 0; background: transparent; font-family: sans-serif; overflow: hidden; }
        .omnih { padding: 4px; }
        
        /* Desain Label & Input */
        .omnih label { font-size: 11px !important; color: #4b5563 !important; margin-bottom: 4px !important; font-weight: 700 !important; text-transform: uppercase !important; letter-spacing: 0.5px; }
        .omnih .form-control { height: 48px !important; border-radius: 8px !important; font-size: 14px !important; border: 1px solid #d1d5db !important; box-shadow: none !important; }
        
        /* Desain Tombol Emas */
        .omnih .btn { background-color: #ca8a04 !important; border-color: #ca8a04 !important; color: #ffffff !important; height: 48px !important; border-radius: 8px !important; font-weight: 700 !important; font-size: 13px !important; letter-spacing: 1px !important; width: 100% !important; transition: background-color 0.3s; }
        .omnih .btn:hover { background-color: #a16207 !important; border-color: #a16207 !important; cursor: pointer; }

        /* MEMAKSA SEJAJAR 1 BARIS (DESKTOP) */
        @media (min-width: 992px) {
          .omnih .row { display: flex !important; align-items: flex-end !important; gap: 12px !important; margin: 0 !important; }
          .omnih .row > div { flex: 1 1 0 !important; padding: 0 !important; }
          .omnih .row > div:last-child { flex: 0 0 auto !important; min-width: 180px !important; }
          .omnih .form-group { margin-bottom: 0 !important; }
        }

        /* MEMAKSA 2 BARIS RAPI (MOBILE) */
        @media (max-width: 991px) {
          .omnih .row { display: flex !important; flex-wrap: wrap !important; gap: 10px !important; margin: 0 !important; }
          .omnih .row > div { flex: 1 1 45% !important; padding: 0 !important; }
          .omnih .row > div:last-child { flex: 1 1 100% !important; margin-top: 5px !important; }
        }
      </style>
    </head>
    <body>
      <div id="app" class="omnih">
         <calendar-form property="${propertyId}" isfallbackcalendar="true"></calendar-form>
      </div>
      <script src="https://omnihotelier.id/js/omnih-client.v.1.js"></script>
    </body>
    </html>
  `;

  return (
    <div className="w-full bg-white rounded-xl shadow-2xl p-4 md:p-6 border border-gray-200">
      {/* Tinggi Iframe diatur responsif: 
        - Desktop (lg): 80px (karena 1 baris)
        - Mobile/Tablet: 250px (karena numpuk jadi beberapa baris)
      */}
      <div className="w-full h-[250px] lg:h-[80px]">
        <iframe
          srcDoc={iframeContent}
          className="w-full h-full border-0"
          scrolling="no"
          title="Single Booking Widget"
        />
      </div>
    </div>
  );
}