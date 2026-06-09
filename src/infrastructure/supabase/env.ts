/**
 * Acceso centralizado y validado a las variables de entorno.
 * Falla rápido (al arrancar) si falta alguna variable crítica.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}. Revisa tu .env.local`);
  }
  return value;
}

export const env = {
  supabaseUrl: () => requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: () => requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  // Solo debe leerse en código de servidor.
  supabaseServiceRoleKey: () => requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  weatherBaseUrl: () =>
    process.env.WEATHER_API_BASE_URL ?? 'https://api.open-meteo.com/v1',
};
