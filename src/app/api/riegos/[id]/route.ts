import type { NextRequest } from 'next/server';
import { buildServerServices } from '@/infrastructure/container';
import { requireUserId } from '@/lib/auth';
import { handleApiError, ok } from '@/lib/apiResponse';

export const dynamic = 'force-dynamic';

/** DELETE /api/riegos/:id */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { db, riegos } = buildServerServices();
    const userId = await requireUserId(db);
    await riegos.eliminar(userId, params.id);
    return ok({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
