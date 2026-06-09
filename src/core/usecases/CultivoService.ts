import type { Cultivo } from '@/core/domain/entities/Cultivo';
import type { CultivoRepository } from '@/core/domain/repositories/CultivoRepository';
import { NotFoundError, ValidationError } from '@/core/domain/errors';
import { actualizarCultivoSchema, nuevoCultivoSchema } from '@/core/domain/validation';

/**
 * Casos de uso de cultivos. Orquesta validación + repositorio.
 * Recibe el repositorio por inyección de dependencias (puerto), de modo que
 * es testeable con un doble en memoria y agnóstico de Supabase.
 */
export class CultivoService {
  constructor(private readonly repo: CultivoRepository) {}

  listar(userId: string): Promise<Cultivo[]> {
    return this.repo.listar(userId);
  }

  async obtener(userId: string, id: string): Promise<Cultivo> {
    const cultivo = await this.repo.obtenerPorId(userId, id);
    if (!cultivo) throw new NotFoundError('Cultivo');
    return cultivo;
  }

  async crear(userId: string, input: unknown): Promise<Cultivo> {
    const parsed = nuevoCultivoSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError(
        'Datos de cultivo inválidos',
        parsed.error.flatten().fieldErrors,
      );
    }
    return this.repo.crear(userId, parsed.data);
  }

  async actualizar(userId: string, id: string, input: unknown): Promise<Cultivo> {
    const parsed = actualizarCultivoSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError(
        'Datos de cultivo inválidos',
        parsed.error.flatten().fieldErrors,
      );
    }
    // Garantiza pertenencia antes de actualizar.
    await this.obtener(userId, id);
    return this.repo.actualizar(userId, id, parsed.data);
  }

  async eliminar(userId: string, id: string): Promise<void> {
    await this.obtener(userId, id);
    await this.repo.eliminar(userId, id);
  }
}
