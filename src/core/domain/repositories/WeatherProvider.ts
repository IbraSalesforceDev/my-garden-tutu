import type { Clima } from '@/core/domain/entities/Clima';

/**
 * Puerto del proveedor meteorológico. Permite cambiar Open-Meteo por otro
 * servicio sin tocar los casos de uso.
 */
export interface WeatherProvider {
  obtener(latitud: number, longitud: number): Promise<Clima>;
}
