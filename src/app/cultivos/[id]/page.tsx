import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildServerServices } from '@/infrastructure/container';
import { requireUserId } from '@/lib/auth';
import { NotFoundError } from '@/core/domain/errors';
import { CultivoForm } from '@/components/CultivoForm';
import { RegistrarRiegoForm } from '@/components/RegistrarRiegoForm';
import { RiegoList } from '@/components/RiegoList';
import { DeleteCultivoButton } from '@/components/DeleteCultivoButton';
import { SetupNotice } from '@/components/SetupNotice';

export const dynamic = 'force-dynamic';

/** Detalle de un cultivo: edición, registro de riego e historial. */
export default async function CultivoDetallePage({ params }: { params: { id: string } }) {
  let cultivo;
  let riegos;
  try {
    const { db, cultivos, riegos: riegoSvc } = buildServerServices();
    const userId = await requireUserId(db);
    [cultivo, riegos] = await Promise.all([
      cultivos.obtener(userId, params.id),
      riegoSvc.listar(userId, params.id),
    ]);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    return <SetupNotice mensaje={e instanceof Error ? e.message : null} />;
  }

  return (
    <section className="space-y-6">
      <header className="flex items-center gap-2">
        <Link href="/cultivos" className="text-huerto-500">
          ←
        </Link>
        <h1 className="text-xl font-bold text-huerto-800">{cultivo.nombre}</h1>
      </header>

      <RegistrarRiegoForm cultivoId={cultivo.id} />

      <div>
        <h2 className="mb-2 font-semibold text-huerto-800">
          Historial de riegos ({riegos.length})
        </h2>
        <div className="card">
          <RiegoList riegos={riegos} />
        </div>
      </div>

      <details className="card">
        <summary className="cursor-pointer font-semibold text-huerto-800">
          Editar cultivo
        </summary>
        <div className="mt-4">
          <CultivoForm cultivo={cultivo} />
        </div>
      </details>

      <DeleteCultivoButton cultivoId={cultivo.id} />
    </section>
  );
}
