import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/proxy';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  // Refresh Supabase session first
  const { supabaseResponse } = await updateSession(request);

  // Run next-intl locale routing
  const intlResponse = intlMiddleware(request);

  // Merge Supabase cookies into the intl response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value, cookie);
  });

  return intlResponse;
}

export const config = {
  matcher: '/((?!api|trpc|auth|_next|_vercel|.*\\..*).*)',
};
