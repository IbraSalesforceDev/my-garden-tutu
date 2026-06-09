import type { Cultivo, EstadoCultivo } from '@/core/domain/entities/Cultivo';
import type { MetodoRiego, Riego } from '@/core/domain/entities/Riego';
import type { Database } from '@/infrastructure/supabase/database.types';

type CultivoRow = Database['public']['Tables']['cultivos']['Row'];
type RiegoRow = Database['public']['Tables']['riegos']['Row'];

/**
 * Mappers entre filas de Supabase (snake_case) y entidades de dominio
 * (camelCase). Aíslan el dominio del esquema físico de la BD.
 */
export function toCultivo(row: CultivoRow): Cultivo {
  return {
    id: row.id,
    userId: row.user_id,
    nombre: row.nombre,
    variedad: row.variedad,
    estado: row.estado as EstadoCultivo,
    fechaSiembra: row.fecha_siembra,
    frecuenciaRiegoDias: row.frecuencia_riego_dias,
    ubicacion: row.ubicacion,
    notas: row.notas,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toRiego(row: RiegoRow): Riego {
  return {
    id: row.id,
    userId: row.user_id,
    cultivoId: row.cultivo_id,
    fecha: row.fecha,
    cantidadLitros: row.cantidad_litros,
    metodo: row.metodo as MetodoRiego,
    notas: row.notas,
    createdAt: row.created_at,
  };
}
