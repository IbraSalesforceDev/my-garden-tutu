'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/apiClient';
import { ESTADOS_CULTIVO, type Cultivo } from '@/core/domain/entities/Cultivo';

/**
 * Formulario reutilizable para alta y edición de cultivos.
 * Si recibe `cultivo`, opera en modo edición (PATCH); si no, crea (POST).
 */
export function CultivoForm({ cultivo }: { cultivo?: Cultivo }) {
  const router = useRouter();
  const editando = Boolean(cultivo);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGuardando(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      nombre: form.get('nombre'),
      variedad: form.get('variedad'),
      estado: form.get('estado'),
      fechaSiembra: form.get('fechaSiembra'),
      frecuenciaRiegoDias: form.get('frecuenciaRiegoDias'),
      ubicacion: form.get('ubicacion'),
      notas: form.get('notas'),
    };

    try {
      if (editando) {
        await api.patch(`/api/cultivos/${cultivo!.id}`, payload);
      } else {
        await api.post('/api/cultivos', payload);
      }
      router.push('/cultivos');
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo guardar');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="nombre">
          Nombre *
        </label>
        <input
          id="nombre"
          name="nombre"
          required
          maxLength={80}
          defaultValue={cultivo?.nombre}
          className="input"
          placeholder="Tomate"
        />
      </div>

      <div>
        <label className="label" htmlFor="variedad">
          Variedad
        </label>
        <input
          id="variedad"
          name="variedad"
          maxLength={80}
          defaultValue={cultivo?.variedad ?? ''}
          className="input"
          placeholder="Cherry"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="estado">
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            defaultValue={cultivo?.estado ?? 'sembrado'}
            className="input capitalize"
          >
            {ESTADOS_CULTIVO.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="frecuenciaRiegoDias">
            Riego (días)
          </label>
          <input
            id="frecuenciaRiegoDias"
            name="frecuenciaRiegoDias"
            type="number"
            min={1}
            max={60}
            defaultValue={cultivo?.frecuenciaRiegoDias ?? 3}
            className="input"
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="fechaSiembra">
          Fecha de siembra *
        </label>
        <input
          id="fechaSiembra"
          name="fechaSiembra"
          type="date"
          required
          defaultValue={cultivo?.fechaSiembra ?? new Date().toISOString().slice(0, 10)}
          className="input"
        />
      </div>

      <div>
        <label className="label" htmlFor="ubicacion">
          Ubicación
        </label>
        <input
          id="ubicacion"
          name="ubicacion"
          maxLength={120}
          defaultValue={cultivo?.ubicacion ?? ''}
          className="input"
          placeholder="Maceta terraza"
        />
      </div>

      <div>
        <label className="label" htmlFor="notas">
          Notas
        </label>
        <textarea
          id="notas"
          name="notas"
          maxLength={500}
          defaultValue={cultivo?.notas ?? ''}
          className="input min-h-20"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={guardando} className="btn-primary w-full">
        {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear cultivo'}
      </button>
    </form>
  );
}
