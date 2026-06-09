import type { EstadoCultivo } from '@/core/domain/entities/Cultivo';

const estilos: Record<EstadoCultivo, string> = {
  sembrado: 'bg-tierra-400/20 text-tierra-600',
  germinando: 'bg-lime-100 text-lime-700',
  creciendo: 'bg-huerto-100 text-huerto-700',
  cosechando: 'bg-amber-100 text-amber-700',
  finalizado: 'bg-gray-100 text-gray-500',
};

export function EstadoBadge({ estado }: { estado: EstadoCultivo }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${estilos[estado]}`}
    >
      {estado}
    </span>
  );
}
