import type { NextRequest } from 'next/server';
import { buildServerServices } from '@/infrastructure/container';
import { requireUserId } from '@/lib/auth';
import { handleApiError, ok } from '@/lib/apiResponse';

export const dynamic = 'force-dynamic';

/** GET /api/cultivos — lista los cultivos del usuario. */
export async function GET() {
  try {
    const { db, cultivos } = buildServerServices();
    const userId = await requireUserId(db);
    return ok(await cultivos.listar(userId));
  } catch (error) {
    return handleApiError(error);
  }
}

/** POST /api/cultivos — crea un cultivo. */
export async function POST(request: NextRequest) {
  try {
    const { db, cultivos } = buildServerServices();
    const userId = await requireUserId(db);
    const body = await request.json();
    return ok(await cultivos.crear(userId, body), 201);
  } catch (error) {
    return handleApiError(error);
  }
}
