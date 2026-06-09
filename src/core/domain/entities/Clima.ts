/**
 * Entidad de dominio: Clima.
 * Modelo agnóstico del proveedor meteorológico concreto.
 */

export interface CondicionActual {
  temperatura: number;
  humedadRelativa: number;
  precipitacion: number;
  velocidadViento: number;
  /** Código de condición (mapeado a icono/descripcion en la capa de UI). */
  codigo: number;
  esDeDia: boolean;
}

export interface PronosticoDia {
  fecha: string;
  tempMax: number;
  tempMin: number;
  precipitacion: number;
  probabilidadLluvia: number;
  codigo: number;
}

export interface Clima {
  ubicacion: { latitud: number; longitud: number };
  actual: CondicionActual;
  pronostico: PronosticoDia[];
  obtenidoEn: string;
}
