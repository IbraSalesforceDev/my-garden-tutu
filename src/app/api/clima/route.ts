import type { NextRequest } from 'next/server';
import { buildClimaService } from '@/infrastructure/container';
import { handleApiError, ok } from '@/lib/apiResponse';

export const dynamic = 'force-dynamic';

/**
 * GET /api/clima?lat=..&lon=..
 * Endpoint público (no requiere autenticación): solo consulta meteorología.
 */
export async function GET(request: NextRequest) {
  try {
    const clima = buildClimaService();
    const params = request.nextUrl.searchParams;
    const data = await clima.obtener({
      latitud: params.get('lat'),
      longitud: params.get('lon'),
    });
    return ok(data);
  } catch (error) {
    return handleApiError(error);
  }
}
