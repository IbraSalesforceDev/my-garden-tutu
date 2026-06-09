/**
 * Entidad de dominio: Cultivo.
 * Representa una planta/hortaliza del huerto. No depende de Supabase ni de
 * ningún detalle de infraestructura (Clean Architecture: capa más interna).
 */

export const ESTADOS_CULTIVO = [
  'sembrado',
  'germinando',
  'creciendo',
  'cosechando',
  'finalizado',
] as const;

export type EstadoCultivo = (typeof ESTADOS_CULTIVO)[number];

export interface Cultivo {
  id: string;
  /** Propietario del cultivo (auth.users.id). */
  userId: string;
  nombre: string;
  /** Variedad o especie, p. ej. "Tomate cherry". */
  variedad: string | null;
  estado: EstadoCultivo;
  /** Fecha de siembra en formato ISO (YYYY-MM-DD). */
  fechaSiembra: string;
  /** Frecuencia de riego recomendada en días. */
  frecuenciaRiegoDias: number;
  ubicacion: string | null;
  notas: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Datos necesarios para crear un cultivo (sin campos generados). */
export type NuevoCultivo = Omit<Cultivo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

/** Datos editables de un cultivo. */
export type ActualizarCultivo = Partial<NuevoCultivo>;
