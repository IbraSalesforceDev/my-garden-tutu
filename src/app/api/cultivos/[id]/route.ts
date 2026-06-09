import type { NextRequest } from 'next/server';
import { buildServerServices } from '@/infrastructure/container';
import { requireUserId } from '@/lib/auth';
import { handleApiError, ok } from '@/lib/apiResponse';

export const dynamic = 'force-dynamic';

type Params = { params: { id: string } };

/** GET /api/cultivos/:id */
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { db, cultivos } = buildServerServices();
    const userId = await requireUserId(db);
    return ok(await cultivos.obtener(userId, params.id));
  } catch (error) {
    return handleApiError(error);
  }
}

/** PATCH /api/cultivos/:id */
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { db, cultivos } = buildServerServices();
    const userId = await requireUserId(db);
    const body = await request.json();
    return ok(await cultivos.actualizar(userId, params.id, body));
  } catch (error) {
    return handleApiError(error);
  }
}

/** DELETE /api/cultivos/:id */
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { db, cultivos } = buildServerServices();
    const userId = await requireUserId(db);
    await cultivos.eliminar(userId, params.id);
    return ok({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
