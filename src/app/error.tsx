'use client';

import { useEffect } from 'react';

/**
 * Error boundary de las rutas. Muestra un mensaje amable con opción de
 * reintentar en lugar de la pantalla de error genérica de Next.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <span className="text-5xl" aria-hidden>
        🥀
      </span>
      <h1 className="text-xl font-bold text-huerto-800">Algo salió mal</h1>
      <p className="max-w-xs text-sm text-huerto-500">
        Ha ocurrido un error inesperado. Puedes intentarlo de nuevo.
      </p>
      <button type="button" onClick={reset} className="btn-primary">
        Reintentar
      </button>
    </section>
  );
}
