import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';

export const dynamic = 'force-dynamic';

/** Cierra la sesión y redirige a la pantalla de acceso. */
export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(`${request.nextUrl.origin}/login`, { status: 303 });
}
