import type { Riego } from '@/core/domain/entities/Riego';

const formatter = new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

/** Lista de riegos reutilizable (historial). */
export function RiegoList({ riegos }: { riegos: Riego[] }) {
  if (riegos.length === 0) {
    return <p className="text-sm text-huerto-400">Sin riegos registrados todavía.</p>;
  }

  return (
    <ul className="divide-y divide-huerto-100">
      {riegos.map((r) => (
        <li key={r.id} className="flex items-center justify-between py-2 text-sm">
          <div>
            <p className="font-medium text-huerto-700">
              {formatter.format(new Date(r.fecha))}
            </p>
            <p className="text-xs capitalize text-huerto-400">
              {r.metodo}
              {r.cantidadLitros != null ? ` · ${r.cantidadLitros} L` : ''}
              {r.notas ? ` · ${r.notas}` : ''}
            </p>
          </div>
          <span aria-hidden>💧</span>
        </li>
      ))}
    </ul>
  );
}
