import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * Callback de Supabase Auth. Intercambia el `code` del enlace de confirmación
 * de email (o magic link) por una sesión y redirige al destino indicado.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');

  // Solo se permite redirigir a rutas internas (evita open redirect).
  const nextParam = searchParams.get('next') ?? '/';
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/';

  if (code) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth', origin));
}
