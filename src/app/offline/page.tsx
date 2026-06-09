export const metadata = { title: 'Sin conexión · Mi Huerto' };

export default function OfflinePage() {
  return (
    <section className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <span className="text-5xl" aria-hidden>
        🌱
      </span>
      <h1 className="text-xl font-bold text-huerto-800">Sin conexión</h1>
      <p className="max-w-xs text-sm text-huerto-500">
        No hay conexión a internet. Algunas funciones no están disponibles, pero puedes
        seguir consultando lo ya cargado.
      </p>
    </section>
  );
}
