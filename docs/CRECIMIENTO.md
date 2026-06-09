# 📈 Estrategia de crecimiento

La arquitectura limpia y los servicios desacoplados permiten añadir
funcionalidad sin reescribir el núcleo. Hoja de ruta sugerida por fases.

## Fase 1 — Consolidar el MVP

- **Autenticación UI**: pantallas de login/registro (magic link o OAuth Google).
- **Notificaciones de riego in-app**: ya calculadas en el dashboard
  (`necesitaRiego`); falta el aviso visual destacado.
- **Tests**: ampliar a `RiegoService` y a las API Routes; añadir Playwright
  para E2E del flujo principal.

## Fase 2 — Experiencia PWA completa

- **Push notifications** de riego con Web Push + un cron (Supabase Edge
  Function programada o Vercel Cron) que revise cultivos pendientes.
- **Offline-first con sincronización**: cola de mutaciones (IndexedDB) que se
  reproduce al recuperar conexión. El puerto `RiegoRepository` permite una
  implementación local que sincroniza con Supabase.
- **Fotos de cultivos** con Supabase Storage (seguimiento del crecimiento).

## Fase 3 — Más valor agrícola

- **Tareas y recordatorios**: fertilización, poda, tratamientos.
- **Recomendaciones según clima**: cruzar el pronóstico (`WeatherProvider`) con
  la frecuencia de riego para sugerir "no riegues hoy, lloverá".
- **Catálogo de plantas** con guías de cultivo (nueva tabla `plantas` + seed).
- **Estadísticas**: consumo de agua por mes, rendimiento por cultivo.

## Fase 4 — Escala y comunidad

- **Multi-huerto / parcelas**: entidad `huerto` con cultivos asociados.
- **Compartir huerto** entre varios usuarios (roles y políticas RLS por
  membresía).
- **Exportación** de datos (CSV/JSON) y API pública documentada.
- **Internacionalización** (i18n) — la UI ya está centralizada y es fácil de
  extraer a mensajes.

## Escalabilidad técnica

- **Base de datos**: índices ya creados en `user_id` y `(cultivo_id, fecha)`.
  Para historiales grandes, paginar `listar` (keyset pagination por `fecha`).
- **Caché**: el clima usa `revalidate: 900`. Para datos de usuario, considerar
  React Query/SWR en cliente y `revalidateTag` en server.
- **Cómputo**: las API Routes son stateless → escalan horizontalmente en Vercel.
- **Nuevos proveedores**: añadir un adaptador que implemente el puerto
  (p. ej. otro servicio meteorológico) sin tocar `usecases` ni UI.
- **Background jobs**: Supabase Edge Functions o Vercel Cron para tareas
  programadas (avisos, agregados).

## Principios para crecer sin deuda

1. Toda nueva fuente de datos entra por un **puerto** en `core/domain`.
2. La lógica de negocio vive en **`usecases`**, nunca en componentes ni rutas.
3. Cada cambio de esquema → **migración versionada** + regenerar tipos.
4. Mantener la cobertura de tests del dominio cerca del 100%.
