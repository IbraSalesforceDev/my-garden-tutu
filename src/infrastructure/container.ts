import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { SupabaseCultivoRepository } from '@/infrastructure/supabase/SupabaseCultivoRepository';
import { SupabaseRiegoRepository } from '@/infrastructure/supabase/SupabaseRiegoRepository';
import { OpenMeteoProvider } from '@/infrastructure/weather/OpenMeteoProvider';
import { CultivoService } from '@/core/usecases/CultivoService';
import { RiegoService } from '@/core/usecases/RiegoService';
import { ClimaService } from '@/core/usecases/ClimaService';

/**
 * Composition root del lado servidor.
 * Cablea casos de uso con sus adaptadores concretos. Es el único lugar donde
 * el dominio se "encuentra" con la infraestructura; el resto del código
 * depende solo de interfaces.
 */
export function buildServerServices() {
  const db = createSupabaseServerClient();
  const cultivoRepo = new SupabaseCultivoRepository(db);
  const riegoRepo = new SupabaseRiegoRepository(db);

  return {
    db,
    cultivos: new CultivoService(cultivoRepo),
    riegos: new RiegoService(riegoRepo, cultivoRepo),
  };
}

export type ServerServices = ReturnType<typeof buildServerServices>;

/**
 * Servicio de clima aislado. No depende de Supabase ni de cookies, por lo que
 * el endpoint público de meteorología no necesita construir el resto del grafo.
 */
export function buildClimaService() {
  return new ClimaService(new OpenMeteoProvider());
}
