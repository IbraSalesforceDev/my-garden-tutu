import type { NuevoRiego, Riego } from '@/core/domain/entities/Riego';

/**
 * Puerto del repositorio de riegos.
 */
export interface RiegoRepository {
  /** Historial de riegos del usuario, opcionalmente filtrado por cultivo. */
  listar(userId: string, opciones?: { cultivoId?: string }): Promise<Riego[]>;
  crear(userId: string, datos: NuevoRiego): Promise<Riego>;
  eliminar(userId: string, id: string): Promise<void>;
  /** Último riego registrado por cultivo (para el dashboard). */
  ultimoPorCultivo(userId: string): Promise<Record<string, Riego>>;
}
