import type { SupabaseClient } from '@supabase/supabase-js';
import { UnauthorizedError } from '@/core/domain/errors';
import type { Database } from '@/infrastructure/supabase/database.types';

/**
 * Devuelve el id del usuario autenticado o lanza UnauthorizedError.
 * Usa getUser() (valida el JWT contra Supabase) en lugar de getSession(),
 * que solo lee la cookie sin verificarla.
 */
export async function requireUserId(db: SupabaseClient<Database>): Promise<string> {
  const {
    data: { user },
    error,
  } = await db.auth.getUser();
  if (error || !user) throw new UnauthorizedError();
  return user.id;
}
