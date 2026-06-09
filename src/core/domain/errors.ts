/**
 * Errores de dominio. Permiten que los casos de uso comuniquen fallos
 * de negocio sin acoplarse a HTTP ni a Supabase. La capa de API los traduce
 * a códigos de estado.
 */

export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export class NotFoundError extends DomainError {
  constructor(recurso: string) {
    super(`${recurso} no encontrado`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends DomainError {
  constructor(
    message: string,
    public readonly issues?: Record<string, string[]>,
  ) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = 'No autenticado') {
    super(message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}
