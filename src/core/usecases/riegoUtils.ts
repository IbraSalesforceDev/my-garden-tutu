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

export interface EstadoRiego {
  /** Días desde el último riego (o desde la siembra si nunca se regó). */
  diasDesdeUltimo: number;
  /** Días que faltan para el próximo riego (0 o negativo = toca ya). */
  diasHastaProximo: number;
  necesita: boolean;
  /** True si nunca se ha registrado un riego. */
  nuncaRegado: boolean;
}

/** Resumen del estado de riego de un cultivo para mostrar en la UI. */
export function estadoRiego(cultivo: Cultivo, ultimoRiego?: Riego): EstadoRiego {
  const referencia = ultimoRiego?.fecha ?? cultivo.fechaSiembra;
  const dias = diasDesde(referencia);
  return {
    diasDesdeUltimo: dias,
    diasHastaProximo: cultivo.frecuenciaRiegoDias - dias,
    necesita: necesitaRiego(cultivo, ultimoRiego),
    nuncaRegado: !ultimoRiego,
  };
}
