'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/infrastructure/supabase/database.types';
import { env } from '@/infrastructure/supabase/env';

/**
 * Cliente Supabase para el navegador (componentes cliente).
 * Usa la clave anon; el acceso a datos está protegido por RLS.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(env.supabaseUrl(), env.supabaseAnonKey());
}
