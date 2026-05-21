import { apiFetch } from './client';
import { AdminUser, setAuthCookie, setToken, setUser, clearToken } from './auth-storage';

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  user: AdminUser;
};

export async function login(email: string, password: string): Promise<AdminUser> {
  const res = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
    anonymous: true,
  });
  // backend returns { access_token, refresh_token, user }; camelize turns those into camelCase
  setToken(res.data.accessToken);
  setAuthCookie(res.data.accessToken);
  setUser(res.data.user);
  return res.data.user;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } catch {
    // best-effort — clear locally even if the call fails
  }
  clearToken();
}
