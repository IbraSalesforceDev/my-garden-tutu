import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  ActualizarCultivo,
  Cultivo,
  NuevoCultivo,
} from '@/core/domain/entities/Cultivo';
import type { CultivoRepository } from '@/core/domain/repositories/CultivoRepository';
import { NotFoundError } from '@/core/domain/errors';
import type { Database } from '@/infrastructure/supabase/database.types';
import { toCultivo } from '@/infrastructure/supabase/mappers';

/**
 * Implementación del repositorio de cultivos sobre Supabase/Postgres.
 * Adaptador de la capa de infraestructura. RLS garantiza el aislamiento por
 * usuario; el filtro explícito por user_id es defensa en profundidad.
 */
export class SupabaseCultivoRepository implements CultivoRepository {
  constructor(private readonly db: SupabaseClient<Database>) {}

  async listar(userId: string): Promise<Cultivo[]> {
    const { data, error } = await this.db
      .from('cultivos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data.map(toCultivo);
  }

  async obtenerPorId(userId: string, id: string): Promise<Cultivo | null> {
    const { data, error } = await this.db
      .from('cultivos')
      .select('*')
      .eq('user_id', userId)
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? toCultivo(data) : null;
  }

  async crear(userId: string, datos: NuevoCultivo): Promise<Cultivo> {
    const { data, error } = await this.db
      .from('cultivos')
      .insert({
        user_id: userId,
        nombre: datos.nombre,
        variedad: datos.variedad,
        estado: datos.estado,
        fecha_siembra: datos.fechaSiembra,
        frecuencia_riego_dias: datos.frecuenciaRiegoDias,
        ubicacion: datos.ubicacion,
        notas: datos.notas,
      })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return toCultivo(data);
  }

  async actualizar(
    userId: string,
    id: string,
    datos: ActualizarCultivo,
  ): Promise<Cultivo> {
    const { data, error } = await this.db
      .from('cultivos')
      .update({
        nombre: datos.nombre,
        variedad: datos.variedad,
        estado: datos.estado,
        fecha_siembra: datos.fechaSiembra,
        frecuencia_riego_dias: datos.frecuenciaRiegoDias,
        ubicacion: datos.ubicacion,
        notas: datos.notas,
      })
      .eq('user_id', userId)
      .eq('id', id)
      .select('*')
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new NotFoundError('Cultivo');
    return toCultivo(data);
  }

  async eliminar(userId: string, id: string): Promise<void> {
    const { error } = await this.db
      .from('cultivos')
      .delete()
      .eq('user_id', userId)
      .eq('id', id);
    if (error) throw new Error(error.message);
  }
}
