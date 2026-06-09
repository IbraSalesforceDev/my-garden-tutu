import { describe, expect, it } from 'vitest';
import { CultivoService } from '@/core/usecases/CultivoService';
import { ValidationError, NotFoundError } from '@/core/domain/errors';
import type { CultivoRepository } from '@/core/domain/repositories/CultivoRepository';
import type {
  Cultivo,
  NuevoCultivo,
  ActualizarCultivo,
} from '@/core/domain/entities/Cultivo';

/** Doble en memoria del repositorio: permite testear el dominio sin Supabase. */
class InMemoryCultivoRepository implements CultivoRepository {
  private items: Cultivo[] = [];
  private seq = 0;

  async listar(userId: string) {
    return this.items.filter((c) => c.userId === userId);
  }
  async obtenerPorId(userId: string, id: string) {
    return this.items.find((c) => c.userId === userId && c.id === id) ?? null;
  }
  async crear(userId: string, datos: NuevoCultivo) {
    const ahora = new Date().toISOString();
    const cultivo: Cultivo = {
      id: `c${++this.seq}`,
      userId,
      createdAt: ahora,
      updatedAt: ahora,
      ...datos,
    };
    this.items.push(cultivo);
    return cultivo;
  }
  async actualizar(userId: string, id: string, datos: ActualizarCultivo) {
    const c = await this.obtenerPorId(userId, id);
    if (!c) throw new NotFoundError('Cultivo');
    Object.assign(c, datos, { updatedAt: new Date().toISOString() });
    return c;
  }
  async eliminar(userId: string, id: string) {
    this.items = this.items.filter((c) => !(c.userId === userId && c.id === id));
  }
}

describe('CultivoService', () => {
  const userId = 'user-1';
  const base = {
    nombre: 'Tomate',
    variedad: null,
    estado: 'sembrado' as const,
    fechaSiembra: '2026-06-01',
    frecuenciaRiegoDias: 3,
    ubicacion: null,
    notas: null,
  };

  it('crea un cultivo válido', async () => {
    const svc = new CultivoService(new InMemoryCultivoRepository());
    const cultivo = await svc.crear(userId, base);
    expect(cultivo.id).toBeTruthy();
    expect(cultivo.nombre).toBe('Tomate');
  });

  it('rechaza un cultivo sin nombre', async () => {
    const svc = new CultivoService(new InMemoryCultivoRepository());
    await expect(svc.crear(userId, { ...base, nombre: '' })).rejects.toBeInstanceOf(
      ValidationError,
    );
  });

  it('lanza NotFoundError al obtener un id inexistente', async () => {
    const svc = new CultivoService(new InMemoryCultivoRepository());
    await expect(svc.obtener(userId, 'no-existe')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('aísla cultivos por usuario', async () => {
    const svc = new CultivoService(new InMemoryCultivoRepository());
    await svc.crear(userId, base);
    expect(await svc.listar('otro-user')).toHaveLength(0);
  });
});
