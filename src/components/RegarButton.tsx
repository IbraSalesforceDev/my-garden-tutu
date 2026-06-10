'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/apiClient';

type Estado = 'idle' | 'guardando' | 'hecho' | 'error';

/**
 * Riego de UN TOQUE: registra un riego (método manual, ahora mismo) sin
 * abrir formularios. Pensado para usarse en el huerto con una mano.
 */
export function RegarButton({
  cultivoId,
  size = 'md',
}: {
  cultivoId: string;
  size?: 'sm' | 'md';
}) {
  const router = useRouter();
  const [estado, setEstado] = useState<Estado>('idle');

  async function regar() {
    if (estado === 'guardando') return;
    setEstado('guardando');
    try {
      await api.post('/api/riegos', {
        cultivoId,
        fecha: new Date().toISOString(),
        metodo: 'manual',
        cantidadLitros: null,
        notas: null,
      });
      setEstado('hecho');
      router.refresh();
      setTimeout(() => setEstado('idle'), 2500);
    } catch {
      setEstado('error');
      setTimeout(() => setEstado('idle'), 2500);
    }
  }

  const base =
    size === 'sm'
      ? 'rounded-full px-3 py-1.5 text-xs font-semibold'
      : 'rounded-xl px-4 py-2.5 text-sm font-semibold';

  const estilos: Record<Estado, string> = {
    idle: 'bg-sky-500 text-white shadow-sm active:scale-95 hover:bg-sky-600',
    guardando: 'bg-sky-300 text-white',
    hecho: 'bg-huerto-500 text-white',
    error: 'bg-red-500 text-white',
  };

  const textos: Record<Estado, string> = {
    idle: '💧 Regar',
    guardando: '…',
    hecho: '✓ ¡Regado!',
    error: 'Error',
  };

  return (
    <button
      type="button"
      onClick={regar}
      disabled={estado === 'guardando'}
      className={`${base} ${estilos[estado]} transition`}
    >
      {textos[estado]}
    </button>
  );
}
