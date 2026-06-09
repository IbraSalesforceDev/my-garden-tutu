'use client';

/**
 * Error boundary de último recurso (envuelve incluso al layout raíz).
 * Debe renderizar sus propios <html>/<body>.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          textAlign: 'center',
          padding: '24px',
          color: '#1a3b1a',
        }}
      >
        <span style={{ fontSize: '48px' }}>🥀</span>
        <h1 style={{ fontSize: '20px', fontWeight: 700 }}>Algo salió mal</h1>
        <p style={{ fontSize: '14px', color: '#3a8c3a' }}>
          Ha ocurrido un error inesperado.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            background: '#2c6f2c',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 16px',
            fontSize: '14px',
          }}
        >
          Reintentar
        </button>
      </body>
    </html>
  );
}
