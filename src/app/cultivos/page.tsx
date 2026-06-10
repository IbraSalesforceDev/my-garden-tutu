import Link from 'next/link';
import { buildServerServices } from '@/infrastructure/container';
import { requireUserId } from '@/lib/auth';
import { estadoRiego } from '@/core/usecases/riegoUtils';
import { EstadoBadge } from '@/components/EstadoBadge';
import { RegarButton } from '@/components/RegarButton';
import { SetupNotice } from '@/components/SetupNotice';

export const dynamic = 'force-dynamic';

/** Listado de cultivos con estado de riego y riego de un toque. */
export default async function CultivosPage() {
  let cultivos;
  let ultimos;
  try {
    const { db, cultivos: svc, riegos: riegoSvc } = buildServerServices();
    const userId = await requireUserId(db);
    [cultivos, ultimos] = await Promise.all([
      svc.listar(userId),
      riegoSvc.ultimoPorCultivo(userId),
    ]);
  } catch (e) {
    return <SetupNotice mensaje={e instanceof Error ? e.message : null} />;
  }

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-huerto-800">Cultivos 🌱</h1>
        <Link href="/cultivos/nuevo" className="btn-primary">
          + Nuevo
        </Link>
      </header>

      {cultivos.length === 0 ? (
        <div className="card space-y-3 text-center">
          <p className="text-3xl" aria-hidden>
            🌱
          </p>
          <p className="text-sm text-huerto-600">
            Aún no tienes cultivos. ¡Añade el primero!
          </p>
          <Link href="/cultivos/nuevo" className="btn-primary w-full">
            + Añadir mi primer cultivo
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {cultivos.map((c) => {
            const riego = estadoRiego(c, ultimos[c.id]);
            return (
              <li
                key={c.id}
                className={`card flex items-center gap-3 ${
                  riego.necesita ? 'border-sky-200 bg-sky-50/60' : ''
                }`}
              >
                <Link href={`/cultivos/${c.id}`} className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate font-semibold text-huerto-800">{c.nombre}</h2>
                    <EstadoBadge estado={c.estado} />
                  </div>
                  {c.variedad && (
                    <p className="truncate text-sm text-huerto-500">{c.variedad}</p>
                  )}
                  <p className="mt-1 text-xs text-huerto-400">
                    {c.estado === 'finalizado'
                      ? 'ciclo terminado'
                      : riego.necesita
                        ? riego.nuncaRegado
                          ? '💧 sin riegos aún · toca regar'
                          : `💧 toca regar (hace ${riego.diasDesdeUltimo} días)`
                        : `regado hace ${riego.diasDesdeUltimo} día(s) · próximo en ${riego.diasHastaProximo}`}
                    {c.ubicacion ? ` · ${c.ubicacion}` : ''}
                  </p>
                </Link>
                {c.estado !== 'finalizado' && <RegarButton cultivoId={c.id} size="sm" />}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
