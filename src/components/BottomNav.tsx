'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', label: 'Inicio', icon: '🏡' },
  { href: '/cultivos', label: 'Cultivos', icon: '🌱' },
  { href: '/riegos', label: 'Riegos', icon: '💧' },
  { href: '/clima', label: 'Clima', icon: '⛅' },
];

/** Barra de navegación inferior, patrón mobile-first. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-huerto-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-md items-stretch justify-around">
        {items.map((item) => {
          const active =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs ${
                active ? 'text-huerto-700' : 'text-huerto-400'
              }`}
            >
              <span className="text-lg" aria-hidden>
                {item.icon}
              </span>
              <span className={active ? 'font-semibold' : ''}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
