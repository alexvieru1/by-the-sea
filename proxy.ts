import { type NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

// Routes that require authentication (without locale prefix)
const protectedRoutes = ['/profile'];

// Routes that should redirect authenticated users (without locale prefix)
const authRoutes = ['/login', '/signup'];

export default async function proxy(request: NextRequest) {
  // Step 1: Create Supabase client and refresh session
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Step 2: Check protected routes (strip locale prefix for comparison)
  const pathname = request.nextUrl.pathname;
  const pathnameWithoutLocale = pathname.replace(/^\/(ro|en)/, '') || '/';

  if (
    !user &&
    protectedRoutes.some((route) => pathnameWithoutLocale.startsWith(route))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (
    user &&
    authRoutes.some((route) => pathnameWithoutLocale.startsWith(route))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/profile';
    return NextResponse.redirect(url);
  }

  // Step 3: Run next-intl middleware
  const intlResponse = intlMiddleware(request);

  // Step 4: Copy Supabase auth cookies onto the intl response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: [
    '/',
    '/(ro|en)/:path*',
    '/((?!_next|_vercel|api|auth|.*\\..*).*)'
  ],
};
