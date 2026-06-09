import Link from 'next/link';
import { buildServerServices } from '@/infrastructure/container';
import { requireUserId } from '@/lib/auth';
import { EstadoBadge } from '@/components/EstadoBadge';
import { SetupNotice } from '@/components/SetupNotice';

export const dynamic = 'force-dynamic';

/** Listado de cultivos del usuario. */
export default async function CultivosPage() {
  let cultivos;
  try {
    const { db, cultivos: svc } = buildServerServices();
    const userId = await requireUserId(db);
    cultivos = await svc.listar(userId);
  } catch (e) {
    return <SetupNotice mensaje={e instanceof Error ? e.message : null} />;
  }

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-huerto-800">Cultivos</h1>
        <Link href="/cultivos/nuevo" className="btn-primary">
          + Nuevo
        </Link>
      </header>

      {cultivos.length === 0 ? (
        <div className="card text-center text-sm text-huerto-500">
          Aún no tienes cultivos. ¡Añade el primero!
        </div>
      ) : (
        <ul className="space-y-3">
          {cultivos.map((c) => (
            <li key={c.id}>
              <Link href={`/cultivos/${c.id}`} className="card block">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-huerto-800">{c.nombre}</h2>
                  <EstadoBadge estado={c.estado} />
                </div>
                {c.variedad && <p className="text-sm text-huerto-500">{c.variedad}</p>}
                <p className="mt-1 text-xs text-huerto-400">
                  Riego cada {c.frecuenciaRiegoDias} día(s)
                  {c.ubicacion ? ` · ${c.ubicacion}` : ''}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
