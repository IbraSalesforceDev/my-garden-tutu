import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refresca la sesión de Supabase en cada request y la propaga vía cookies.
 * Necesario para que Server Components y API routes vean tokens vigentes.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresca el token si está caducado (valida el JWT).
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Excluye estáticos y assets de la PWA del middleware.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons/|offline).*)',
  ],
};
