import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware';

// 1. Setup Middleware Intl (Bahasa)
const intlMiddleware = createIntlMiddleware({
  locales: ["en", "fr"],
  defaultLocale: "en",
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // --- LOGIKA 1: AUTHENTICATION (Admin & Login) ---
  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    
    // Setup Response awal
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    // Setup Supabase Client (Versi @supabase/ssr)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: '', ...options })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Cek Session User
    const { data: { session } } = await supabase.auth.getSession()

    // A. Belum Login, mau ke Admin -> Tendang ke Login
    if (!session && pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // B. Sudah Login, mau ke Login -> Tendang ke Admin
    if (session && pathname === '/login') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    return response
  }

  // --- LOGIKA 2: PUBLIC WEBSITE (BAHASA) ---
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/", 
    "/(en|fr)/:path*", 
    "/admin/:path*", 
    "/login"
  ],
};