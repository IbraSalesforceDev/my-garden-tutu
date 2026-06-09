import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BottomNav } from '@/components/BottomNav';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'Mi Huerto',
  description: 'Gestiona tu huerto doméstico desde el móvil',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mi Huerto',
  },
};

export const viewport: Viewport = {
  themeColor: '#2c6f2c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col">
          <main className="flex-1 px-4 pb-24 pt-6">{children}</main>
          <BottomNav />
        </div>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
