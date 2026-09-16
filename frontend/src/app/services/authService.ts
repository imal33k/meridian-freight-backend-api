import type { UserProfile } from '../types';
import { apiRequest, ApiError } from './apiClient';

const ACCESS_TOKEN_KEY = 'meridian_access_token';

interface LoginResponse {
  message: string;
  user: {
    company: string;
    country: string;
    id: string;
    supabaseId: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    role: 'CUSTOMER' | 'STAFF' | 'ADMIN';
    createdAt: string;
    updatedAt: string;
  };
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at: number;
  } | null;
}

function saveToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

function getToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function removeToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

function mapUser(user: LoginResponse['user']): UserProfile {
  return {
     id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone ?? '',
    role: user.role.toLowerCase() as UserProfile['role'],
    createdAt: user.createdAt,
    emailVerified: true,
    company: user.company ?? '',
    country: user.country ?? '',
};
}

export async function login(
  email: string,
  password: string,
): Promise<UserProfile> {
  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.session?.access_token) {
    throw new ApiError(
      'Login succeeded, but no access token was returned.',
      401,
    );
  }

  saveToken(response.session.access_token);

  return mapUser(response.user);
}

export async function logout(): Promise<void> {
  removeToken();
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const response = await apiRequest<LoginResponse['user']>('/users/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return mapUser(response);
  } catch {
    removeToken();
    return null;
  }
}

export async function register(payload: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  password: string;
}): Promise<{ userId: string }> {
  const response = await apiRequest<{
    user: {
      id: string;
    };
  }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: payload.password,
    }),
  });

  return {
    userId: response.user.id,
  };
}

export async function forgotPassword(
  email: string,
): Promise<{ sent: boolean }> {
  await apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

  return { sent: true };
}