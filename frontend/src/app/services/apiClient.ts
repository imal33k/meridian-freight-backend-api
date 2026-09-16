const API_URL = 'http://localhost:3000/api';

export function delay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(value), ms),
  );
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.message || 'Something went wrong.',
      response.status,
    );
  }

  return data as T;
}