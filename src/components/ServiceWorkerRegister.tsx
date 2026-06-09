'use client';

import { useEffect } from 'react';

/**
 * Registra el service worker en cliente para habilitar la PWA (offline +
 * instalación). Solo en producción para no interferir con HMR en desarrollo.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) {
      return;
    }
    const onLoad = () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error('Fallo al registrar el service worker:', err);
      });
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return null;
}
