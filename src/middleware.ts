import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware';

// 1. Konfigurasi Bahasa untuk Website Publik
const locales = ["en", "id"]; 
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: "en",
  localePrefix: 'always' 
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- LOGIKA A: SUPABASE COOKIE SYNC ---
  // Kita buat response awal agar Supabase bisa menulis cookie sesi dengan aman
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

  // Memanggil getUser() di sini akan memperbarui token jika hampir kedaluwarsa
  await supabase.auth.getUser();

  // --- LOGIKA B: PROTEKSI ADMIN (BYPASS KE ADMINAUTHGATE) ---
  // Jika user mengakses /admin atau sub-menunya:
  // KITA LANGSUNG LEWATKAN (return response). 
  // Biarkan komponen AdminAuthGate.tsx yang memunculkan UI Form Login yang baru!
  if (pathname.startsWith('/admin')) {
    return response;
  }

  // --- LOGIKA C: PUBLIC WEBSITE & MULTILANGUAGE ---
  // Jika rute bukan /admin, berarti ini adalah halaman publik web (seperti /, /hotels, /about).
  // Jalankan intlMiddleware agar prefix bahasa (/en atau /id) otomatis ditambahkan.
  return intlMiddleware(request);
}

export const config = {
  // Matcher yang menangkap semua rute, kecuali API dan file statis gambar/aset
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};