# 🌿 Mi Huerto

PWA mobile-first para gestionar un huerto doméstico desde el móvil: alta y
edición de cultivos, registro e historial de riegos, consulta meteorológica y
un dashboard con los cultivos pendientes de riego.

Construida con **Next.js (App Router) + TypeScript + Tailwind CSS + Supabase**,
desplegada en **Vercel** y con CI/CD en **GitHub Actions**, siguiendo
**Clean Architecture**.

---

## 🚀 Puesta en marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Variables de entorno
cp .env.example .env.local   # y rellena las claves de Supabase

# 3. Base de datos (con Supabase CLI)
supabase start               # stack local, o usa un proyecto en la nube
supabase db reset            # aplica supabase/migrations

# 4. Arrancar en desarrollo
npm run dev                  # http://localhost:3000
```

> Sin Supabase configurado, la app arranca igualmente y muestra un aviso de
> configuración en lugar de fallar.

### Scripts

| Script                 | Descripción                          |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Servidor de desarrollo               |
| `npm run build`        | Build de producción                  |
| `npm run lint`         | ESLint                               |
| `npm run typecheck`    | Comprobación de tipos (tsc)          |
| `npm test`             | Tests unitarios (Vitest)             |
| `npm run format`       | Formatea con Prettier                |

---

## 🏛️ Arquitectura (Clean Architecture)

El código se organiza en capas con dependencias **hacia adentro**: la UI y la
infraestructura dependen del dominio, nunca al revés.

```
┌─────────────────────────────────────────────────────────┐
│  app/ (Next.js)  →  UI + API Routes (capa de entrega)    │
│        │                                                 │
│        ▼                                                 │
│  core/usecases/  →  Servicios de aplicación              │
│        │              (CultivoService, RiegoService…)    │
│        ▼                                                 │
│  core/domain/    →  Entidades, puertos (interfaces),     │
│                     validación y errores  ← núcleo puro  │
│        ▲                                                 │
│        │ implementa                                      │
│  infrastructure/ →  Supabase, Open-Meteo (adaptadores)   │
└─────────────────────────────────────────────────────────┘
```

- **`core/domain`**: entidades (`Cultivo`, `Riego`, `Clima`), **puertos**
  (`CultivoRepository`, `RiegoRepository`, `WeatherProvider`), validación (Zod)
  y errores de dominio. No importa nada de Next ni de Supabase.
- **`core/usecases`**: orquestan validación + repositorios. Reciben los puertos
  por **inyección de dependencias**, así que son testeables sin Supabase
  (ver `CultivoService.test.ts`).
- **`infrastructure`**: implementaciones concretas de los puertos
  (`SupabaseCultivoRepository`, `OpenMeteoProvider`) y los clientes Supabase.
  El `container.ts` es el **composition root** donde se cablea todo.
- **`app/api`**: API Routes finas que delegan en los casos de uso y traducen
  errores de dominio a HTTP (`lib/apiResponse.ts`).

**Servicios desacoplados**: cambiar de Supabase a otra BD, o de Open-Meteo a otro
proveedor meteorológico, solo requiere una nueva implementación del puerto
correspondiente; los casos de uso y la UI no cambian.

---

## 🗄️ Modelo de datos (Supabase / Postgres)

Definido en `supabase/migrations/0001_init.sql`.

### `cultivos`

| Columna                 | Tipo          | Notas                                   |
| ----------------------- | ------------- | --------------------------------------- |
| `id`                    | uuid (PK)     | `gen_random_uuid()`                     |
| `user_id`               | uuid (FK)     | → `auth.users`, `on delete cascade`     |
| `nombre`                | text          | 1–80 chars                              |
| `variedad`              | text          | opcional                                |
| `estado`                | text          | enum: sembrado…finalizado               |
| `fecha_siembra`         | date          |                                         |
| `frecuencia_riego_dias` | int           | 1–60                                    |
| `ubicacion`             | text          | opcional                                |
| `notas`                 | text          | opcional                                |
| `created_at`/`updated_at` | timestamptz | `updated_at` por trigger                |

### `riegos`

| Columna           | Tipo        | Notas                               |
| ----------------- | ----------- | ----------------------------------- |
| `id`              | uuid (PK)   |                                     |
| `user_id`         | uuid (FK)   | → `auth.users`                      |
| `cultivo_id`      | uuid (FK)   | → `cultivos`, `on delete cascade`   |
| `fecha`           | timestamptz | momento del riego                   |
| `cantidad_litros` | numeric     | opcional                            |
| `metodo`          | text        | manual/goteo/aspersion/lluvia       |
| `notas`           | text        | opcional                            |

**Seguridad de datos**: ambas tablas tienen **Row Level Security (RLS)** con
políticas `auth.uid() = user_id` para SELECT/INSERT/UPDATE/DELETE. Cada usuario
solo ve y modifica sus propias filas, garantizado a nivel de base de datos.

---

## 📁 Estructura de carpetas

```
mi-huerto/
├── .github/workflows/        # CI (lint/test/build) y deploy a Vercel
├── public/
│   ├── manifest.json         # Manifiesto PWA
│   ├── sw.js                 # Service worker (offline)
│   └── icons/                # Iconos PWA
├── supabase/
│   ├── config.toml
│   └── migrations/           # Esquema SQL + RLS
├── src/
│   ├── app/                  # Capa de entrega (App Router)
│   │   ├── layout.tsx, page.tsx (dashboard)
│   │   ├── cultivos/         # listado, nuevo, [id] (detalle/edición)
│   │   ├── riegos/           # historial global
│   │   ├── clima/            # consulta meteorológica
│   │   ├── offline/          # fallback PWA
│   │   └── api/              # Route handlers: cultivos, riegos, clima
│   ├── components/           # UI reutilizable (client/server)
│   ├── core/
│   │   ├── domain/           # entidades, puertos, validación, errores
│   │   └── usecases/         # servicios de aplicación + tests
│   ├── infrastructure/
│   │   ├── supabase/         # clientes, repos, mappers, tipos BD
│   │   ├── weather/          # OpenMeteoProvider
│   │   └── container.ts      # composition root (DI)
│   ├── lib/                  # auth, apiClient, apiResponse, helpers
│   └── middleware.ts         # refresco de sesión Supabase
└── (configs raíz)
```

---

## ☁️ Despliegue en Vercel

1. Importa el repo en Vercel (framework detectado: Next.js).
2. Configura las **variables de entorno** del proyecto (Production + Preview):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (solo si se usa en server; mantener secreta)
   - `WEATHER_API_BASE_URL` (opcional)
3. `vercel.json` fija la región (`cdg1`, Europa) y cabeceras de caché de assets.

Tienes dos opciones de CI/CD:

- **Integración Git nativa de Vercel** (recomendada): deja `deploy.yml`
  desactivado (`vars.ENABLE_VERCEL_DEPLOY` sin definir) y Vercel desplegará en
  cada push/PR automáticamente.
- **GitHub Actions** (`.github/workflows/deploy.yml`): activa la variable de
  repositorio `ENABLE_VERCEL_DEPLOY=true` y añade los secrets `VERCEL_TOKEN`,
  `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

---

## 🔁 CI/CD (GitHub Actions)

- **`ci.yml`**: en cada push/PR a `main` ejecuta lint, typecheck, formato,
  tests y build. Cancela ejecuciones obsoletas con `concurrency`.
- **`deploy.yml`**: despliegue opcional a Vercel vía CLI, protegido por variable.

---

## 🔒 Seguridad y mantenimiento

Ver [`docs/SEGURIDAD.md`](docs/SEGURIDAD.md) y
[`docs/CRECIMIENTO.md`](docs/CRECIMIENTO.md) para el detalle completo. Resumen:

- **RLS** en todas las tablas como primera línea de defensa.
- La **service_role key** nunca se expone al cliente; solo `NEXT_PUBLIC_*` llega
  al navegador.
- Validación de **toda** entrada con Zod en la capa de aplicación.
- `getUser()` (valida el JWT) en lugar de `getSession()` para autorizar.
- Cabeceras de seguridad (`X-Frame-Options`, `nosniff`, `Permissions-Policy`).
- El service worker **nunca** cachea `/api` ni respuestas de Supabase.

---

## 📈 Crecimiento futuro

Detallado en [`docs/CRECIMIENTO.md`](docs/CRECIMIENTO.md): notificaciones push de
riego, fotos de cultivos (Supabase Storage), modo offline con cola de
sincronización, tareas/fertilización, multi-huerto, exportación de datos e
internacionalización.
