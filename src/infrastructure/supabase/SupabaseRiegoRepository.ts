import type { SupabaseClient } from '@supabase/supabase-js';
import type { NuevoRiego, Riego } from '@/core/domain/entities/Riego';
import type { RiegoRepository } from '@/core/domain/repositories/RiegoRepository';
import type { Database } from '@/infrastructure/supabase/database.types';
import { toRiego } from '@/infrastructure/supabase/mappers';

/**
 * Implementación del repositorio de riegos sobre Supabase/Postgres.
 */
export class SupabaseRiegoRepository implements RiegoRepository {
  constructor(private readonly db: SupabaseClient<Database>) {}

  async listar(userId: string, opciones?: { cultivoId?: string }): Promise<Riego[]> {
    let query = this.db
      .from('riegos')
      .select('*')
      .eq('user_id', userId)
      .order('fecha', { ascending: false });

    if (opciones?.cultivoId) {
      query = query.eq('cultivo_id', opciones.cultivoId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data.map(toRiego);
  }

  async crear(userId: string, datos: NuevoRiego): Promise<Riego> {
    const { data, error } = await this.db
      .from('riegos')
      .insert({
        user_id: userId,
        cultivo_id: datos.cultivoId,
        fecha: datos.fecha,
        cantidad_litros: datos.cantidadLitros,
        metodo: datos.metodo,
        notas: datos.notas,
      })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return toRiego(data);
  }

  async eliminar(userId: string, id: string): Promise<void> {
    const { error } = await this.db
      .from('riegos')
      .delete()
      .eq('user_id', userId)
      .eq('id', id);
    if (error) throw new Error(error.message);
  }

  async ultimoPorCultivo(userId: string): Promise<Record<string, Riego>> {
    // Trae los riegos ordenados por fecha desc y conserva el primero por cultivo.
    const { data, error } = await this.db
      .from('riegos')
      .select('*')
      .eq('user_id', userId)
      .order('fecha', { ascending: false });
    if (error) throw new Error(error.message);

    const resultado: Record<string, Riego> = {};
    for (const row of data) {
      if (!resultado[row.cultivo_id]) {
        resultado[row.cultivo_id] = toRiego(row);
      }
    }
    return resultado;
  }
}
