import { NextResponse } from 'next/server';
import {
  DomainError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '@/core/domain/errors';

/**
 * Traduce errores de dominio a respuestas HTTP consistentes.
 * Centraliza el manejo de errores de todas las API routes.
 */
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ValidationError) {
    return NextResponse.json(
      { error: error.message, code: error.code, issues: error.issues },
      { status: 422 },
    );
  }
  if (error instanceof NotFoundError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: 404 });
  }
  if (error instanceof UnauthorizedError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: 401 });
  }
  if (error instanceof DomainError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: 400 });
  }

  // Error inesperado: no filtrar detalles internos al cliente.
  console.error('[api] Error no controlado:', error);
  return NextResponse.json(
    { error: 'Error interno del servidor', code: 'INTERNAL_ERROR' },
    { status: 500 },
  );
}

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}
