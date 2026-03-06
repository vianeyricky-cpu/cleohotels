import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware';

// 1. Konfigurasi Bahasa (Sesuaikan locales Anda)
const locales = ["en", "id"]; // Tambahkan "fr" jika memang Anda menggunakannya
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: "en",
  localePrefix: 'always' // Memastikan /en/admin atau /id/admin selalu konsisten
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- LOGIKA A: SUPABASE COOKIE SYNC ---
  // Kita buat response awal agar Supabase bisa menulis cookie
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Ambil user (Lebih aman daripada getSession di middleware)
  const { data: { user } } = await supabase.auth.getUser();

  // --- LOGIKA B: PROTEKSI RUTE ADMIN ---
  // Deteksi apakah path adalah admin (contoh: /admin, /en/admin, /id/admin)
  const isAdminPath = pathname.startsWith('/admin') || 
                     locales.some(loc => pathname.startsWith(`/${loc}/admin`));
  
  const isLoginPath = pathname.startsWith('/login') || 
                     locales.some(loc => pathname.startsWith(`/${loc}/login`));

  // 1. Jika BELUM Login & mencoba masuk ke Admin
  if (!user && isAdminPath) {
    // Redirect ke halaman login (dengan prefix bahasa agar tidak error)
    return NextResponse.redirect(new URL('/en/login', request.url));
  }

  // 2. Jika SUDAH Login & mencoba masuk ke Login lagi
  if (user && isLoginPath) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // --- LOGIKA C: PUBLIC WEBSITE & MULTILANGUAGE ---
  // Jika rute bukan admin/login yang butuh auth, jalankan Intl Middleware
  if (!isAdminPath && !isLoginPath) {
    return intlMiddleware(request);
  }

  return response;
}

export const config = {
  // Matcher yang diperluas untuk menangkap semua kemungkinan rute
  matcher: [
    // Jalankan pada semua rute kecuali file statis (image, favicon, dsb)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};