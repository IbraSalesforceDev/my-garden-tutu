# 🔒 Seguridad y mantenimiento

Buenas prácticas aplicadas en Mi Huerto y recomendaciones para mantenerlas.

## Autenticación y autorización

- **Supabase Auth** gestiona usuarios y sesiones (cookies httpOnly vía
  `@supabase/ssr`).
- En el servidor se usa **`auth.getUser()`** (valida el JWT contra Supabase),
  no `getSession()` (que solo lee la cookie sin verificar). Ver `lib/auth.ts`.
- El `middleware.ts` refresca el token en cada request para evitar sesiones
  caducadas en Server Components.

## Aislamiento de datos: Row Level Security

- Todas las tablas tienen **RLS habilitado** con políticas
  `auth.uid() = user_id`. Es la **garantía principal**: aunque una query
  olvidara filtrar por usuario, Postgres no devolvería filas ajenas.
- Defensa en profundidad: los repositorios **además** filtran por `user_id`
  explícitamente.
- **Nunca desactivar RLS** ni usar la `service_role` key para operaciones de
  usuario final.

## Gestión de secretos

| Variable                        | Ámbito    | ¿Al navegador? |
| ------------------------------- | --------- | -------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | público   | ✅ (protegido por RLS) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | público   | ✅ (protegido por RLS) |
| `SUPABASE_SERVICE_ROLE_KEY`     | servidor  | ❌ **nunca**   |

- Solo las variables con prefijo `NEXT_PUBLIC_` se incluyen en el bundle cliente.
- La `service_role` key **salta RLS**: úsala únicamente en código de servidor y
  para tareas administrativas concretas. En este MVP no es necesaria.
- `.env.local` está en `.gitignore`. Rota las claves si se filtran.

## Validación de entrada

- **Todo** payload se valida con **Zod** en la capa de aplicación
  (`core/domain/validation.ts`) antes de tocar la base de datos.
- Las API Routes nunca confían en el cliente: re-validan en servidor.
- La BD añade `CHECK` constraints (longitudes, enums, rangos) como última red.

## Cabeceras y superficie de ataque

- `next.config.mjs` añade `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: DENY`, `Referrer-Policy` y `Permissions-Policy`.
- `poweredByHeader: false` oculta la cabecera `X-Powered-By`.
- El **service worker** no intercepta `/api` ni orígenes externos: ningún dato
  sensible se queda en la caché del dispositivo.

## Mantenimiento

- **Dependencias**: habilita Dependabot/Renovate; `npm audit` en CI.
- **Tipos de BD**: regenera `database.types.ts` tras cada migración
  (`supabase gen types`).
- **Migraciones versionadas** en `supabase/migrations`, nunca cambios manuales
  en producción.
- **Tests** en cada PR (CI bloquea merge si fallan).
- **Observabilidad**: usa los logs de Vercel y `get_advisors` de Supabase para
  detectar políticas RLS faltantes o índices recomendados.

## Checklist antes de producción

- [ ] RLS habilitado y políticas probadas para cada tabla.
- [ ] Variables de entorno configuradas en Vercel (sin `service_role` en cliente).
- [ ] Confirmación de email activada en Supabase Auth (`enable_confirmations`).
- [ ] Rate limiting / protección de la API (Vercel Firewall o middleware).
- [ ] Copias de seguridad de la BD habilitadas.
- [ ] Revisar advisors de seguridad de Supabase.
