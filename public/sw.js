/* Mi Huerto - Service Worker
 * Estrategia:
 *  - App shell con precache de rutas básicas.
 *  - Network-first para navegación (HTML) con fallback a cache offline.
 *  - Stale-while-revalidate para estáticos.
 *  - Nunca cachea respuestas de /api ni de Supabase (datos dinámicos/sensibles).
 */
const VERSION = 'v1';
const APP_SHELL = `mi-huerto-shell-${VERSION}`;
const RUNTIME = `mi-huerto-runtime-${VERSION}`;
const OFFLINE_URL = '/offline';

const PRECACHE_URLS = ['/', '/offline', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![APP_SHELL, RUNTIME].includes(key))
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Nunca interceptar API ni orígenes externos (Supabase, meteo).
  if (url.pathname.startsWith('/api') || url.origin !== self.location.origin) {
    return;
  }

  // Navegación: network-first con fallback offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match(OFFLINE_URL))),
    );
    return;
  }

  // Estáticos: stale-while-revalidate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
