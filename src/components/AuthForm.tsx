'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/infrastructure/supabase/client';

type Modo = 'login' | 'registro';

/**
 * Formulario de autenticación con email + contraseña (Supabase Auth).
 * - En "login" inicia sesión.
 * - En "registro" crea la cuenta. Si el proyecto tiene la confirmación de
 *   email desactivada, la sesión se abre al instante; si está activada, se
 *   informa al usuario de que revise su correo.
 */
export function AuthForm() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [modo, setModo] = useState<Modo>('login');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setAviso(null);

    const form = new FormData(e.currentTarget);
    const email = String(form.get('email'));
    const password = String(form.get('password'));

    try {
      if (modo === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/');
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        if (data.session) {
          // Confirmación de email desactivada: sesión inmediata.
          router.push('/');
          router.refresh();
        } else {
          setAviso(
            'Cuenta creada. Revisa tu email para confirmarla y luego inicia sesión.',
          );
          setModo('login');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex rounded-xl bg-huerto-100 p-1 text-sm font-medium">
        <button
          type="button"
          onClick={() => setModo('login')}
          className={`flex-1 rounded-lg py-2 ${modo === 'login' ? 'bg-white text-huerto-700 shadow-sm' : 'text-huerto-500'}`}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          onClick={() => setModo('registro')}
          className={`flex-1 rounded-lg py-2 ${modo === 'registro' ? 'bg-white text-huerto-700 shadow-sm' : 'text-huerto-500'}`}
        >
          Crear cuenta
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="input"
            placeholder="tu@email.com"
          />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
            className="input"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {aviso && (
          <p className="rounded-lg bg-huerto-50 p-2 text-sm text-huerto-700">{aviso}</p>
        )}

        <button type="submit" disabled={cargando} className="btn-primary w-full">
          {cargando ? 'Procesando…' : modo === 'login' ? 'Entrar' : 'Crear cuenta'}
        </button>
      </form>
    </div>
  );
}
