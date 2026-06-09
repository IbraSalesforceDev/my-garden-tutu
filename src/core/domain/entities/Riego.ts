/**
 * Entidad de dominio: Riego.
 * Registro de un evento de riego sobre un cultivo.
 */

export type MetodoRiego = 'manual' | 'goteo' | 'aspersion' | 'lluvia';

export interface Riego {
  id: string;
  userId: string;
  cultivoId: string;
  /** Momento del riego en formato ISO 8601. */
  fecha: string;
  /** Cantidad de agua en litros (opcional). */
  cantidadLitros: number | null;
  metodo: MetodoRiego;
  notas: string | null;
  createdAt: string;
}

export type NuevoRiego = Omit<Riego, 'id' | 'userId' | 'createdAt'>;
