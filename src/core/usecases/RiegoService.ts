import type { Riego } from '@/core/domain/entities/Riego';
import type { RiegoRepository } from '@/core/domain/repositories/RiegoRepository';
import type { CultivoRepository } from '@/core/domain/repositories/CultivoRepository';
import { NotFoundError, ValidationError } from '@/core/domain/errors';
import { nuevoRiegoSchema } from '@/core/domain/validation';

/**
 * Casos de uso de riegos. Antes de registrar un riego verifica que el
 * cultivo exista y pertenezca al usuario.
 */
export class RiegoService {
  constructor(
    private readonly riegos: RiegoRepository,
    private readonly cultivos: CultivoRepository,
  ) {}

  listar(userId: string, cultivoId?: string): Promise<Riego[]> {
    return this.riegos.listar(userId, cultivoId ? { cultivoId } : undefined);
  }

  ultimoPorCultivo(userId: string): Promise<Record<string, Riego>> {
    return this.riegos.ultimoPorCultivo(userId);
  }

  async registrar(userId: string, input: unknown): Promise<Riego> {
    const parsed = nuevoRiegoSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError(
        'Datos de riego inválidos',
        parsed.error.flatten().fieldErrors,
      );
    }
    const cultivo = await this.cultivos.obtenerPorId(userId, parsed.data.cultivoId);
    if (!cultivo) throw new NotFoundError('Cultivo');
    return this.riegos.crear(userId, parsed.data);
  }

  async eliminar(userId: string, id: string): Promise<void> {
    await this.riegos.eliminar(userId, id);
  }
}
