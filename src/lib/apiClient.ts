/**
 * Cliente HTTP ligero para que los componentes consuman las API routes.
 * Centraliza el manejo de errores y el parseo JSON.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly issues?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(data?.error ?? `Error ${res.status}`, res.status, data?.issues);
  }
  return data as T;
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(url: string, body: unknown) =>
    request<T>(url, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
};
