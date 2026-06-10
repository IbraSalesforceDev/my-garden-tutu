'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/apiClient';
import type { Clima } from '@/core/domain/entities/Clima';
import { describirClima } from '@/lib/weatherCodes';

// Sevilla por defecto si no hay permiso de geolocalización.
const DEFAULT = { lat: 37.3891, lon: -5.9845 };

/**
 * Resumen meteorológico compacto para el dashboard: lo esencial antes de
 * salir al huerto (temperatura, condición y si lloverá hoy).
 */
export function WeatherMini() {
  const [clima, setClima] = useState<Clima | null>(null);

  useEffect(() => {
    const cargar = (lat: number, lon: number) =>
      api.get<Clima>(`/api/clima?lat=${lat}&lon=${lon}`).then(setClima, () => {});

    if (!navigator.geolocation) {
      cargar(DEFAULT.lat, DEFAULT.lon);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => cargar(pos.coords.latitude, pos.coords.longitude),
      () => cargar(DEFAULT.lat, DEFAULT.lon),
      { timeout: 8000 },
    );
  }, []);

  if (!clima) {
    return (
      <div className="card flex h-16 items-center justify-center text-xs text-huerto-400">
        Cargando el tiempo…
      </div>
    );
  }

  const hoy = clima.pronostico[0];
  const desc = describirClima(clima.actual.codigo);
  const lluviaHoy = hoy?.probabilidadLluvia ?? 0;

  return (
    <Link
      href="/clima"
      className="card flex items-center justify-between bg-gradient-to-r from-sky-50 to-huerto-50"
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden>
          {desc.icono}
        </span>
        <div>
          <p className="text-xl font-bold text-huerto-800">
            {Math.round(clima.actual.temperatura)}°
            {hoy && (
              <span className="ml-1 text-xs font-normal text-huerto-400">
                {Math.round(hoy.tempMax)}°/{Math.round(hoy.tempMin)}°
              </span>
            )}
          </p>
          <p className="text-xs text-huerto-500">{desc.texto}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-sky-600">💧 {lluviaHoy}%</p>
        <p className="text-[10px] text-huerto-400">lluvia hoy</p>
        {lluviaHoy >= 60 && (
          <p className="mt-0.5 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-medium text-sky-700">
            quizá no riegues 😉
          </p>
        )}
      </div>
    </Link>
  );
}
