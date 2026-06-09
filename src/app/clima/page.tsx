'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/apiClient';
import type { Clima } from '@/core/domain/entities/Clima';
import { describirClima } from '@/lib/weatherCodes';

// Ubicación por defecto: Sevilla (se usa si no hay permiso de geolocalización).
const DEFAULT = { lat: 37.3891, lon: -5.9845, nombre: 'Sevilla (por defecto)' };

const diaFmt = new Intl.DateTimeFormat('es-ES', { weekday: 'short' });

type Fuente = 'gps' | 'default';

/** Consulta meteorológica con geolocalización del dispositivo. */
export default function ClimaPage() {
  const [clima, setClima] = useState<Clima | null>(null);
  const [fuente, setFuente] = useState<Fuente>('default');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async (lat: number, lon: number, origen: Fuente) => {
    setCargando(true);
    setError(null);
    try {
      const data = await api.get<Clima>(`/api/clima?lat=${lat}&lon=${lon}`);
      setClima(data);
      setFuente(origen);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo cargar el clima');
    } finally {
      setCargando(false);
    }
  }, []);

  const usarMiUbicacion = useCallback(() => {
    if (!navigator.geolocation) {
      cargar(DEFAULT.lat, DEFAULT.lon, 'default');
      return;
    }
    setCargando(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => cargar(pos.coords.latitude, pos.coords.longitude, 'gps'),
      () => cargar(DEFAULT.lat, DEFAULT.lon, 'default'),
      { timeout: 8000 },
    );
  }, [cargar]);

  useEffect(() => {
    usarMiUbicacion();
  }, [usarMiUbicacion]);

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-bold text-huerto-800">Clima ⛅</h1>

      {cargando && <div className="card text-center text-sm">Cargando…</div>}
      {error && <div className="card text-sm text-red-600">{error}</div>}

      {clima && !cargando && (
        <>
          {/* Ubicación y zona horaria de los datos mostrados. */}
          <div className="card space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-huerto-800">
                  {fuente === 'gps' ? '📍 Tu ubicación' : `📍 ${DEFAULT.nombre}`}
                </p>
                <p className="text-xs text-huerto-400">
                  {clima.ubicacion.latitud.toFixed(2)},{' '}
                  {clima.ubicacion.longitud.toFixed(2)} · {clima.zonaHoraria}
                </p>
              </div>
              <button
                type="button"
                onClick={usarMiUbicacion}
                className="btn-secondary px-3 py-1.5 text-xs"
              >
                Usar mi ubicación
              </button>
            </div>
            {fuente === 'default' && (
              <p className="rounded-lg bg-amber-50 p-2 text-xs text-amber-700">
                Mostrando Sevilla porque no hay permiso de ubicación. Pulsa “Usar mi
                ubicación” y acepta el permiso para ver tu zona.
              </p>
            )}
          </div>

          <div className="card flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold text-huerto-700">
                {Math.round(clima.actual.temperatura)}°
              </p>
              <p className="text-sm text-huerto-500">
                {describirClima(clima.actual.codigo).texto}
              </p>
            </div>
            <span className="text-5xl" aria-hidden>
              {describirClima(clima.actual.codigo).icono}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <Metric label="Humedad" value={`${clima.actual.humedadRelativa}%`} />
            <Metric label="Lluvia" value={`${clima.actual.precipitacion} mm`} />
            <Metric
              label="Viento"
              value={`${Math.round(clima.actual.velocidadViento)} km/h`}
            />
          </div>

          <div>
            <h2 className="mb-2 font-semibold text-huerto-800">Próximos días</h2>
            <div className="card divide-y divide-huerto-100">
              {clima.pronostico.map((d) => (
                <div
                  key={d.fecha}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <span className="w-12 capitalize text-huerto-600">
                    {diaFmt.format(new Date(d.fecha))}
                  </span>
                  <span aria-hidden>{describirClima(d.codigo).icono}</span>
                  <span className="text-huerto-400">{d.probabilidadLluvia}% 💧</span>
                  <span className="font-medium text-huerto-700">
                    {Math.round(d.tempMax)}° / {Math.round(d.tempMin)}°
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <p className="font-semibold text-huerto-700">{value}</p>
      <p className="text-xs text-huerto-400">{label}</p>
    </div>
  );
}
