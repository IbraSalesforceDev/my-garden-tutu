import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/infrastructure/supabase/database.types';
import { env } from '@/infrastructure/supabase/env';

/**
 * Cliente Supabase para el servidor (API routes, server components, actions).
 * Lee/escribe la sesión desde cookies, respetando RLS bajo la identidad del
 * usuario autenticado.
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(env.supabaseUrl(), env.supabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // `set` falla en Server Components de solo lectura; el middleware
          // se encarga de refrescar la sesión. Es seguro ignorarlo aquí.
        }
      },
    },
  });
}
