'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/apiClient';

/** Botón con confirmación para eliminar un cultivo. */
export function DeleteCultivoButton({ cultivoId }: { cultivoId: string }) {
  const router = useRouter();
  const [borrando, setBorrando] = useState(false);

  async function onDelete() {
    if (!confirm('¿Eliminar este cultivo y su historial de riegos?')) return;
    setBorrando(true);
    try {
      await api.delete(`/api/cultivos/${cultivoId}`);
      router.push('/cultivos');
      router.refresh();
    } finally {
      setBorrando(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={borrando}
      className="btn w-full border border-red-200 text-red-600 hover:bg-red-50"
    >
      {borrando ? 'Eliminando…' : 'Eliminar cultivo'}
    </button>
  );
}
