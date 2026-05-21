import { apiFetch } from './client';
import { AdminUser, setAuthCookie, setToken, setUser, clearToken } from './auth-storage';

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  user: AdminUser;
};

const DEVICE_ID_KEY = 'moviai_admin_device_id';

function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'admin-web-ssr';
  let id = window.localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? `admin-web-${crypto.randomUUID()}`
        : `admin-web-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export async function login(email: string, password: string): Promise<AdminUser> {
  const res = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: {
      email,
      password,
      device_id: getOrCreateDeviceId(),
      device_meta: {
        platform: 'web',
        locale: typeof navigator !== 'undefined' ? navigator.language?.slice(0, 8) : undefined,
      },
    },
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
    await apiFetch('/auth/logout', {
      method: 'POST',
      body: { device_id: getOrCreateDeviceId() },
    });
  } catch {
    // best-effort — clear locally even if the call fails
  }
  clearToken();
}
