'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/infrastructure/supabase/database.types';

/**
 * Cliente Supabase para el navegador (componentes cliente).
 * Usa la clave anon; el acceso a datos está protegido por RLS.
 *
 * IMPORTANTE: las variables `NEXT_PUBLIC_*` deben leerse con clave LITERAL
 * estática (no `process.env[nombre]`), porque Next.js solo las inyecta en el
 * bundle del navegador cuando se acceden de forma estática. Por eso aquí no se
 * usa el helper `env`, que accede dinámicamente y solo es válido en servidor.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
