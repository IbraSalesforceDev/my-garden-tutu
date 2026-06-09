'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/apiClient';

const metodos = ['manual', 'goteo', 'aspersion', 'lluvia'] as const;

type CultivoOpcion = { id: string; nombre: string };

/**
 * Registro rápido de riego desde la pestaña Riegos: elige cultivo y registra
 * sin tener que entrar al detalle de cada uno.
 */
export function QuickRiego({ cultivos }: { cultivos: CultivoOpcion[] }) {
  const router = useRouter();
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    setOkMsg(null);
    const form = new FormData(e.currentTarget);

    try {
      await api.post('/api/riegos', {
        cultivoId: form.get('cultivoId'),
        fecha: new Date().toISOString(),
        cantidadLitros: form.get('cantidadLitros') || null,
        metodo: form.get('metodo'),
        notas: null,
      });
      const nombre = cultivos.find((c) => c.id === form.get('cultivoId'))?.nombre;
      setOkMsg(`Riego registrado${nombre ? ` para ${nombre}` : ''} ✅`);
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
      <h2 className="font-semibold text-huerto-800">Registrar riego 💧</h2>
      <div>
        <label className="label" htmlFor="cultivoId">
          Cultivo
        </label>
        <select id="cultivoId" name="cultivoId" required className="input">
          {cultivos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="cantidadLitros">
            Litros (opcional)
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

      {error && <p className="text-sm text-red-600">{error}</p>}
      {okMsg && (
        <p className="rounded-lg bg-huerto-50 p-2 text-sm text-huerto-700">{okMsg}</p>
      )}

      <button type="submit" disabled={guardando} className="btn-primary w-full">
        {guardando ? 'Guardando…' : 'Registrar riego'}
      </button>
    </form>
  );
}
