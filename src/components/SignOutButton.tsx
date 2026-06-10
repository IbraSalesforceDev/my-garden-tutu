/**
 * Botón de cierre de sesión. Usa un form POST a la route handler de signout
 * para limpiar las cookies de sesión en el servidor.
 */
export function SignOutButton() {
  return (
    <form action="/auth/signout" method="post">
      <button
        type="submit"
        className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur hover:bg-white/25"
      >
        Salir
      </button>
    </form>
  );
}
