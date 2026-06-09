import type {
  ActualizarCultivo,
  Cultivo,
  NuevoCultivo,
} from '@/core/domain/entities/Cultivo';

/**
 * Puerto (interfaz) del repositorio de cultivos.
 * La capa de dominio depende de esta abstracción, no de Supabase.
 * Las implementaciones viven en la capa de infraestructura.
 */
export interface CultivoRepository {
  listar(userId: string): Promise<Cultivo[]>;
  obtenerPorId(userId: string, id: string): Promise<Cultivo | null>;
  crear(userId: string, datos: NuevoCultivo): Promise<Cultivo>;
  actualizar(userId: string, id: string, datos: ActualizarCultivo): Promise<Cultivo>;
  eliminar(userId: string, id: string): Promise<void>;
}
