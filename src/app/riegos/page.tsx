import { buildServerServices } from '@/infrastructure/container';
import { requireUserId } from '@/lib/auth';
import { RiegoList } from '@/components/RiegoList';
import { SetupNotice } from '@/components/SetupNotice';

export const dynamic = 'force-dynamic';

/** Historial global de riegos del usuario. */
export default async function RiegosPage() {
  let riegos;
  let nombres: Record<string, string> = {};
  try {
    const { db, cultivos, riegos: riegoSvc } = buildServerServices();
    const userId = await requireUserId(db);
    const [listaRiegos, listaCultivos] = await Promise.all([
      riegoSvc.listar(userId),
      cultivos.listar(userId),
    ]);
    riegos = listaRiegos;
    nombres = Object.fromEntries(listaCultivos.map((c) => [c.id, c.nombre]));
  } catch (e) {
    return <SetupNotice mensaje={e instanceof Error ? e.message : null} />;
  }

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-bold text-huerto-800">Historial de riegos</h1>
      {riegos.length === 0 ? (
        <div className="card text-center text-sm text-huerto-500">
          Todavía no has registrado riegos.
        </div>
      ) : (
        <div className="card">
          {/* Agrupa visualmente mostrando el nombre del cultivo en las notas. */}
          <RiegoList
            riegos={riegos.map((r) => ({
              ...r,
              notas: [nombres[r.cultivoId], r.notas].filter(Boolean).join(' · ') || null,
            }))}
          />
        </div>
      )}
    </section>
  );
}
