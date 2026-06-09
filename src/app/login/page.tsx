import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { AuthForm } from '@/components/AuthForm';

export const dynamic = 'force-dynamic';

/** Pantalla de acceso. Si ya hay sesión, redirige al dashboard. */
export default async function LoginPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect('/');

  return (
    <section className="space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-huerto-800">Mi Huerto 🌿</h1>
        <p className="mt-1 text-sm text-huerto-500">
          Gestiona tu huerto doméstico desde el móvil
        </p>
      </header>
      <div className="card">
        <AuthForm />
      </div>
    </section>
  );
}
