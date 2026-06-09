/**
 * Aviso mostrado cuando la app aún no está conectada a Supabase o no hay
 * una sesión activa. Evita una pantalla en blanco al arrancar el proyecto.
 */
export function SetupNotice({ mensaje }: { mensaje?: string | null }) {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-huerto-800">Mi Huerto 🌿</h1>
      <div className="card space-y-3">
        <h2 className="font-semibold">Configuración pendiente</h2>
        <p className="text-sm text-huerto-600">
          Para ver tus datos necesitas configurar Supabase e iniciar sesión:
        </p>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-huerto-600">
          <li>
            Copia <code>.env.example</code> a <code>.env.local</code> y rellena las claves
            de Supabase.
          </li>
          <li>
            Aplica las migraciones de <code>supabase/migrations</code>.
          </li>
          <li>Configura autenticación y vuelve a cargar.</li>
        </ol>
        {mensaje && (
          <p className="rounded-lg bg-huerto-50 p-2 text-xs text-huerto-500">
            Detalle: {mensaje}
          </p>
        )}
      </div>
    </section>
  );
}
