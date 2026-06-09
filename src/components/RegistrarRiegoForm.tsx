'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/apiClient';

const metodos = ['manual', 'goteo', 'aspersion', 'lluvia'] as const;

/** Formulario rápido para registrar un riego sobre un cultivo. */
export function RegistrarRiegoForm({ cultivoId }: { cultivoId: string }) {
  const router = useRouter();
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    try {
      await api.post('/api/riegos', {
        cultivoId,
        fecha: new Date().toISOString(),
        cantidadLitros: form.get('cantidadLitros') || null,
        metodo: form.get('metodo'),
        notas: form.get('notas'),
      });
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo registrar');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-3">
      <h3 className="font-semibold text-huerto-800">Registrar riego 💧</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="cantidadLitros">
            Litros
          </label>
          <input
            id="cantidadLitros"
            name="cantidadLitros"
            type="number"
            step="0.1"
            min={0}
            className="input"
            placeholder="2.5"
          />
        </div>
        <div>
          <label className="label" htmlFor="metodo">
            Método
          </label>
          <select id="metodo" name="metodo" className="input capitalize">
            {metodos.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>
      <input
        name="notas"
        className="input"
        placeholder="Notas (opcional)"
        maxLength={300}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={guardando} className="btn-primary w-full">
        {guardando ? 'Guardando…' : 'Registrar'}
      </button>
    </form>
  );
}
