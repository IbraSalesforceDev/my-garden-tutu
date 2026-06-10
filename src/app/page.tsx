import Link from 'next/link';
import { buildServerServices } from '@/infrastructure/container';
import { requireUserId } from '@/lib/auth';
import { estadoRiego } from '@/core/usecases/riegoUtils';
import { SetupNotice } from '@/components/SetupNotice';
import { SignOutButton } from '@/components/SignOutButton';
import { RegarButton } from '@/components/RegarButton';
import { WeatherMini } from '@/components/WeatherMini';
import { EstadoBadge } from '@/components/EstadoBadge';

export const dynamic = 'force-dynamic';

const fechaFmt = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'Europe/Madrid',
});

function saludo(): string {
  const hora = Number(
    new Intl.DateTimeFormat('es-ES', {
      hour: 'numeric',
      hour12: false,
      timeZone: 'Europe/Madrid',
    }).format(new Date()),
  );
  if (hora >= 6 && hora < 14) return 'Buenos días';
  if (hora >= 14 && hora < 21) return 'Buenas tardes';
  return 'Buenas noches';
}

/**
 * Dashboard principal: el "parte del huerto" del día. Tiempo, qué toca regar
 * (con riego de un toque) y estado de todos los cultivos.
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
  const conEstado = cultivos.map((c) => ({
    cultivo: c,
    riego: estadoRiego(c, ultimos[c.id]),
  }));
  const pendientes = conEstado.filter((x) => x.riego.necesita);
  const alDia = conEstado.filter((x) => !x.riego.necesita);

  return (
    <section className="space-y-5">
      {/* Cabecera tipo hero */}
      <header className="rounded-3xl bg-gradient-to-br from-huerto-600 to-huerto-800 p-5 text-white shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-huerto-100 first-letter:uppercase">
              {fechaFmt.format(new Date())}
            </p>
            <h1 className="mt-0.5 text-2xl font-bold">{saludo()} 🌿</h1>
          </div>
          <SignOutButton />
        </div>
        <p className="mt-3 text-sm text-huerto-100">
          {cultivos.length === 0
            ? 'Tu huerto te espera'
            : pendientes.length === 0
              ? '¡Todo regado! Tu huerto está al día 🎉'
              : `${pendientes.length} cultivo${pendientes.length > 1 ? 's' : ''} esperando agua`}
        </p>
      </header>

      <WeatherMini />

      {cultivos.length === 0 && (
        <div className="card space-y-3 border-huerto-200 bg-huerto-50 text-center">
          <p className="text-3xl" aria-hidden>
            🌱
          </p>
          <h2 className="font-semibold text-huerto-800">¡Bienvenido a tu huerto!</h2>
          <p className="text-sm text-huerto-600">
            Empieza añadiendo un cultivo. Luego podrás regarlo con un toque desde aquí.
          </p>
          <Link href="/cultivos/nuevo" className="btn-primary w-full">
            + Añadir mi primer cultivo
          </Link>
        </div>
      )}

      {/* Pendientes de riego: la acción principal del día, a un toque */}
      {pendientes.length > 0 && (
        <div>
          <h2 className="mb-2 flex items-center gap-1 font-semibold text-huerto-800">
            💧 Toca regar hoy
          </h2>
          <ul className="space-y-2">
            {pendientes.map(({ cultivo, riego }) => (
              <li
                key={cultivo.id}
                className="card flex items-center justify-between border-sky-200 bg-sky-50/60"
              >
                <Link href={`/cultivos/${cultivo.id}`} className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-huerto-800">
                    {cultivo.nombre}
                  </p>
                  <p className="text-xs text-huerto-500">
                    {riego.nuncaRegado
                      ? `sembrado hace ${riego.diasDesdeUltimo} día(s), sin riegos aún`
                      : `último riego hace ${riego.diasDesdeUltimo} día(s)`}
                  </p>
                </Link>
                <RegarButton cultivoId={cultivo.id} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Resto de cultivos, al día */}
      {alDia.length > 0 && (
        <div>
          <h2 className="mb-2 font-semibold text-huerto-800">🌱 Al día</h2>
          <ul className="space-y-2">
            {alDia.map(({ cultivo, riego }) => (
              <li key={cultivo.id} className="card flex items-center justify-between">
                <Link href={`/cultivos/${cultivo.id}`} className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-huerto-800">
                      {cultivo.nombre}
                    </p>
                    <EstadoBadge estado={cultivo.estado} />
                  </div>
                  <p className="text-xs text-huerto-400">
                    {cultivo.estado === 'finalizado'
                      ? 'ciclo terminado'
                      : riego.diasHastaProximo <= 1
                        ? 'próximo riego: mañana'
                        : `próximo riego en ${riego.diasHastaProximo} días`}
                  </p>
                </Link>
                {cultivo.estado !== 'finalizado' && (
                  <RegarButton cultivoId={cultivo.id} size="sm" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {cultivos.length > 0 && (
        <Link href="/cultivos/nuevo" className="btn-secondary w-full">
          + Añadir otro cultivo
        </Link>
      )}
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
