/**
 * Auth token storage — single source of truth for the admin JWT.
 *
 * Kept in localStorage. SSR-safe: `getToken` returns null when `window` is
 * not defined (server render), so module imports don't crash.
 */

const KEY = 'moviai_admin_jwt';
const USER_KEY = 'moviai_admin_user';

export type AdminUser = {
  publicId: string;
  email: string;
  fullName: string | null;
  role: string;
};

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, token);
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(KEY);
  window.localStorage.removeItem(USER_KEY);
  // also nuke the cookie used by middleware
  document.cookie = 'moviai_admin_jwt=; Path=/; Max-Age=0; SameSite=Lax';
}

export function setUser(user: AdminUser): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

/** Mirror the JWT into a cookie so Next middleware (server) can gate routes. */
export function setAuthCookie(token: string): void {
  if (typeof document === 'undefined') return;
  // 12h matches a typical admin session; backend's own expiry remains authoritative.
  document.cookie = `moviai_admin_jwt=${token}; Path=/; Max-Age=${12 * 60 * 60}; SameSite=Lax`;
}
