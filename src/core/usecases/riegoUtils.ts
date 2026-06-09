import type { Cultivo } from '@/core/domain/entities/Cultivo';
import type { Riego } from '@/core/domain/entities/Riego';

/** Días transcurridos desde una fecha ISO hasta hoy. */
export function diasDesde(fechaIso: string): number {
  const ms = Date.now() - new Date(fechaIso).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

/**
 * Indica si un cultivo necesita riego según su frecuencia y el último riego.
 * Si nunca se ha regado, se toma la fecha de siembra como referencia.
 */
export function necesitaRiego(cultivo: Cultivo, ultimoRiego?: Riego): boolean {
  if (cultivo.estado === 'finalizado') return false;
  const referencia = ultimoRiego?.fecha ?? cultivo.fechaSiembra;
  return diasDesde(referencia) >= cultivo.frecuenciaRiegoDias;
}
