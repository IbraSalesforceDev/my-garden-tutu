import Link from 'next/link';
import { buildServerServices } from '@/infrastructure/container';
import { requireUserId } from '@/lib/auth';
import { necesitaRiego } from '@/core/usecases/riegoUtils';
import { SetupNotice } from '@/components/SetupNotice';
import { SignOutButton } from '@/components/SignOutButton';

export const dynamic = 'force-dynamic';

/**
 * Dashboard principal (Server Component). Carga datos directamente desde los
 * casos de uso en el servidor. Si Supabase no está configurado o no hay sesión,
 * muestra un aviso de configuración en lugar de fallar.
 */
export default async function DashboardPage() {
  let datos: Awaited<ReturnType<typeof cargarDashboard>> | null = null;
  let error: string | null = null;

  try {
    datos = await cargarDashboard();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Error desconocido';
  }

  if (!datos) {
    return <SetupNotice mensaje={error} />;
  }

  const { cultivos, ultimos } = datos;
  const pendientes = cultivos.filter((c) => necesitaRiego(c, ultimos[c.id]));

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-huerto-800">Mi Huerto 🌿</h1>
          <p className="text-sm text-huerto-500">
            {cultivos.length} cultivo(s) · {pendientes.length} necesitan riego
          </p>
        </div>
        <SignOutButton />
      </header>

      {cultivos.length === 0 && (
        // Onboarding: primera vez sin cultivos.
        <div className="card space-y-3 border-huerto-200 bg-huerto-50 text-center">
          <p className="text-3xl" aria-hidden>
            🌱
          </p>
          <h2 className="font-semibold text-huerto-800">¡Bienvenido a tu huerto!</h2>
          <p className="text-sm text-huerto-600">
            Empieza añadiendo un cultivo. Luego podrás registrar sus riegos y ver cuándo
            le toca regar.
          </p>
          <Link href="/cultivos/nuevo" className="btn-primary w-full">
            + Añadir mi primer cultivo
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Resumen titulo="Cultivos" valor={cultivos.length} icono="🌱" />
        <Resumen titulo="Riego hoy" valor={pendientes.length} icono="💧" />
      </div>

      {pendientes.length > 0 && (
        <div className="card border-amber-200 bg-amber-50">
          <h2 className="mb-2 font-semibold text-amber-800">Pendientes de riego</h2>
          <ul className="space-y-1 text-sm text-amber-900">
            {pendientes.map((c) => (
              <li key={c.id} className="flex justify-between">
                <span>{c.nombre}</span>
                <Link href={`/cultivos/${c.id}`} className="underline">
                  Regar
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        <Link href="/cultivos/nuevo" className="btn-primary flex-1">
          + Nuevo cultivo
        </Link>
        <Link href="/cultivos" className="btn-secondary flex-1">
          Ver cultivos
        </Link>
      </div>
    </section>
  );
}

async function cargarDashboard() {
  const { db, cultivos: cultivoSvc, riegos: riegoSvc } = buildServerServices();
  const userId = await requireUserId(db);
  const [cultivos, ultimos] = await Promise.all([
    cultivoSvc.listar(userId),
    riegoSvc.ultimoPorCultivo(userId),
  ]);
  return { cultivos, ultimos };
}

function Resumen({
  titulo,
  valor,
  icono,
}: {
  titulo: string;
  valor: number;
  icono: string;
}) {
  return (
    <div className="card flex items-center gap-3">
      <span className="text-2xl" aria-hidden>
        {icono}
      </span>
      <div>
        <p className="text-2xl font-bold text-huerto-700">{valor}</p>
        <p className="text-xs text-huerto-500">{titulo}</p>
      </div>
    </div>
  );
}
