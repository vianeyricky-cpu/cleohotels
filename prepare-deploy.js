const fs = require('fs');
const path = require('path');

console.log('Memulai persiapan deploy...');

const serverPath = path.join(__dirname, '.next', 'standalone', 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// Matikan Satpam (Anti 400 Bad Request)
serverContent = serverContent.replace(/hostname,/g, 'hostname: undefined,');

// Suntik Filter HTTPS & Security Headers Paksa
const httpsAndSecurityFilter = `// --- 1. FILTER HTTPS & SECURITY HEADERS (VERSI PAMUNGKAS) ---
const http = require('http');
const originalEmit = http.Server.prototype.emit;
http.Server.prototype.emit = function (event, ...args) {
  if (event === 'request') {
    const req = args[0];
    const res = args[1]; // Kita tangkap juga response-nya!

    // A. Filter HTTPS
    if (req && typeof req.url === 'string') {
      if (req.url.includes('://')) {
        const parts = req.url.split('/');
        req.url = parts.length > 3 ? '/' + parts.slice(3).join('/') : '/';
      }
      if (req.headers) {
        req.headers.host = 'cleohotels.id';
        req.headers['x-forwarded-host'] = 'cleohotels.id';
        req.headers['x-forwarded-proto'] = 'https';
      }
    }

    // B. Paksa Tulis Security Headers (Ubah F jadi A)
    if (res && typeof res.setHeader === 'function') {
      try {
        res.setHeader('X-DNS-Prefetch-Control', 'on');
        res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Referrer-Policy', 'origin-when-cross-origin');
        res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://*.omnihotelier.id https://omnihotelier.id https://*.reserveonline.id https://reserveonline.id; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.omnihotelier.id https://omnihotelier.id https://stackpath.bootstrapcdn.com; img-src 'self' blob: data: https://*.supabase.co https://images.unsplash.com https://www.google-analytics.com https://*.omnihotelier.id https://omnihotelier.id https://*.reserveonline.id https://reserveonline.id; font-src 'self' data: https://fonts.gstatic.com https://stackpath.bootstrapcdn.com https://*.omnihotelier.id https://omnihotelier.id; connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://analytics.google.com https://*.omnihotelier.id https://omnihotelier.id https://*.reserveonline.id https://reserveonline.id; frame-src 'self' https://*.omnihotelier.id https://omnihotelier.id https://*.reserveonline.id https://reserveonline.id;");
      } catch (e) {}
    }
  }
  return originalEmit.apply(this, [event, ...args]);
};
// --- AKHIR FILTER ---

`;

// Pastikan filter tidak ganda
if (!serverContent.includes('SECURITY HEADERS (VERSI PAMUNGKAS)')) {
  serverContent = serverContent.replace(/\/\/ --- 1\. FILTER HTTPS.*?AKHIR FILTER ---/s, ''); // Hapus filter lama jika ada
  serverContent = httpsAndSecurityFilter + serverContent;
}

fs.writeFileSync(serverPath, serverContent);
console.log('✅ server.js berhasil di-patch (Filter HTTPS & Security Headers Aktif)!');

// Gabungkan public & static
const standalonePath = path.join(__dirname, '.next', 'standalone');
fs.cpSync(path.join(__dirname, 'public'), path.join(standalonePath, 'public'), { recursive: true });
fs.cpSync(path.join(__dirname, '.next', 'static'), path.join(standalonePath, '.next', 'static'), { recursive: true });
console.log('✅ Folder public & static berhasil digabungkan!');

console.log('🚀 SELESAI! Folder .next/standalone siap di-upload ke cPanel!');