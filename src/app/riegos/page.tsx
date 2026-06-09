import Link from 'next/link';
import { buildServerServices } from '@/infrastructure/container';
import { requireUserId } from '@/lib/auth';
import { RiegoList } from '@/components/RiegoList';
import { QuickRiego } from '@/components/QuickRiego';
import { SetupNotice } from '@/components/SetupNotice';

export const dynamic = 'force-dynamic';

/** Pestaña Riegos: registro rápido + historial global del usuario. */
export default async function RiegosPage() {
  let riegos;
  let listaCultivos;
  let nombres: Record<string, string> = {};
  try {
    const { db, cultivos, riegos: riegoSvc } = buildServerServices();
    const userId = await requireUserId(db);
    const [listaRiegos, cultivosUsuario] = await Promise.all([
      riegoSvc.listar(userId),
      cultivos.listar(userId),
    ]);
    riegos = listaRiegos;
    listaCultivos = cultivosUsuario;
    nombres = Object.fromEntries(cultivosUsuario.map((c) => [c.id, c.nombre]));
  } catch (e) {
    return <SetupNotice mensaje={e instanceof Error ? e.message : null} />;
  }

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-bold text-huerto-800">Riegos 💧</h1>

      {listaCultivos.length === 0 ? (
        // Sin cultivos no se puede regar: guía al usuario a crear uno.
        <div className="card space-y-3 text-center">
          <p className="text-sm text-huerto-600">
            Para registrar riegos primero necesitas un cultivo.
          </p>
          <Link href="/cultivos/nuevo" className="btn-primary w-full">
            + Añadir mi primer cultivo
          </Link>
        </div>
      ) : (
        <QuickRiego
          cultivos={listaCultivos.map((c) => ({ id: c.id, nombre: c.nombre }))}
        />
      )}

      <div>
        <h2 className="mb-2 font-semibold text-huerto-800">
          Historial ({riegos.length})
        </h2>
        {riegos.length === 0 ? (
          <div className="card text-center text-sm text-huerto-500">
            Aún no hay riegos. Registra el primero arriba 👆
          </div>
        ) : (
          <div className="card">
            <RiegoList
              riegos={riegos.map((r) => ({
                ...r,
                notas:
                  [nombres[r.cultivoId], r.notas].filter(Boolean).join(' · ') || null,
              }))}
            />
          </div>
        )}
      </div>
    </section>
  );
}
