import Link from 'next/link';
import { CultivoForm } from '@/components/CultivoForm';

export default function NuevoCultivoPage() {
  return (
    <section className="space-y-4">
      <header className="flex items-center gap-2">
        <Link href="/cultivos" className="text-huerto-500">
          ←
        </Link>
        <h1 className="text-xl font-bold text-huerto-800">Nuevo cultivo</h1>
      </header>
      <CultivoForm />
    </section>
  );
}
