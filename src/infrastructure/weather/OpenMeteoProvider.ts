import type { Clima } from '@/core/domain/entities/Clima';
import type { WeatherProvider } from '@/core/domain/repositories/WeatherProvider';
import { env } from '@/infrastructure/supabase/env';

/**
 * Proveedor meteorológico basado en Open-Meteo (gratuito, sin API key).
 * Adaptador del puerto WeatherProvider.
 */
export class OpenMeteoProvider implements WeatherProvider {
  async obtener(latitud: number, longitud: number): Promise<Clima> {
    const url = new URL(`${env.weatherBaseUrl()}/forecast`);
    url.searchParams.set('latitude', String(latitud));
    url.searchParams.set('longitude', String(longitud));
    url.searchParams.set(
      'current',
      'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code,is_day',
    );
    url.searchParams.set(
      'daily',
      'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code',
    );
    url.searchParams.set('forecast_days', '5');
    url.searchParams.set('timezone', 'auto');

    const res = await fetch(url, { next: { revalidate: 900 } });
    if (!res.ok) {
      throw new Error(`Open-Meteo respondió ${res.status}`);
    }
    const json = await res.json();

    const c = json.current;
    const d = json.daily;

    return {
      ubicacion: { latitud, longitud },
      actual: {
        temperatura: c.temperature_2m,
        humedadRelativa: c.relative_humidity_2m,
        precipitacion: c.precipitation,
        velocidadViento: c.wind_speed_10m,
        codigo: c.weather_code,
        esDeDia: c.is_day === 1,
      },
      pronostico: (d.time as string[]).map((fecha, i) => ({
        fecha,
        tempMax: d.temperature_2m_max[i],
        tempMin: d.temperature_2m_min[i],
        precipitacion: d.precipitation_sum[i],
        probabilidadLluvia: d.precipitation_probability_max[i] ?? 0,
        codigo: d.weather_code[i],
      })),
      obtenidoEn: new Date().toISOString(),
    };
  }
}
