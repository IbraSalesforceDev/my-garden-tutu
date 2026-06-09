/**
 * Botón de cierre de sesión. Usa un form POST a la route handler de signout
 * para limpiar las cookies de sesión en el servidor.
 */
export function SignOutButton() {
  return (
    <form action="/auth/signout" method="post">
      <button
        type="submit"
        className="text-sm font-medium text-huerto-500 underline-offset-2 hover:underline"
      >
        Salir
      </button>
    </form>
  );
}
