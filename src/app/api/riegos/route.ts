import type { NextRequest } from 'next/server';
import { buildServerServices } from '@/infrastructure/container';
import { requireUserId } from '@/lib/auth';
import { handleApiError, ok } from '@/lib/apiResponse';

export const dynamic = 'force-dynamic';

/** GET /api/riegos?cultivoId=... — historial de riegos. */
export async function GET(request: NextRequest) {
  try {
    const { db, riegos } = buildServerServices();
    const userId = await requireUserId(db);
    const cultivoId = request.nextUrl.searchParams.get('cultivoId') ?? undefined;
    return ok(await riegos.listar(userId, cultivoId));
  } catch (error) {
    return handleApiError(error);
  }
}

/** POST /api/riegos — registra un riego. */
export async function POST(request: NextRequest) {
  try {
    const { db, riegos } = buildServerServices();
    const userId = await requireUserId(db);
    const body = await request.json();
    return ok(await riegos.registrar(userId, body), 201);
  } catch (error) {
    return handleApiError(error);
  }
}
