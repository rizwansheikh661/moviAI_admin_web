/**
 * apiFetch — single fetch wrapper for every admin API call.
 *
 * Responsibilities:
 *  - prepend NEXT_PUBLIC_API_BASE_URL
 *  - inject `Authorization: Bearer <jwt>` when a token is present
 *  - serialize bodies as JSON (already-snake_cased by the caller)
 *  - parse the backend `{ data, meta?, error? }` envelope
 *  - convert response payload to camelCase for page consumption
 *  - throw a typed `ApiError` so React Query can route errors to toasts
 *  - on 401, clear the token + redirect to /login
 */

import { camelize } from './mappers';
import { logger } from './logger';
import { clearToken, getToken } from './auth-storage';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api/v1';

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;
  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Translate raw backend errors into messages we'd show in a toast.
 * Backend `error.message` is usually engineer-y; this layer keeps the
 * useful parts (validation messages, conflict reasons) and rewrites
 * generic HTTP failures into something a non-technical admin can act on.
 */
function friendlyMessage(status: number, code: string, backendMsg: string | null): string {
  // Trust backend message for validation / business errors — those are user-facing already.
  if (status === 400 || status === 409 || status === 422) {
    return backendMsg || 'That request looks invalid. Please check the values and try again.';
  }
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return "You don't have permission to do that.";
  if (status === 404) return backendMsg || "We couldn't find what you were looking for.";
  if (status === 429) return 'Too many requests. Please slow down and try again in a few seconds.';
  if (status >= 500) return 'The server ran into a problem. We\u2019re looking into it — please try again shortly.';
  // Fallback: prefer backend message if it exists, otherwise generic.
  return backendMsg || `Something went wrong (error ${status}). Please try again.`;
}

export type ListMeta = {
  total?: number;
  totalKnown?: boolean;
  limit?: number;
  offset?: number;
};

export type ApiResult<T> = {
  data: T;
  meta?: ListMeta & Record<string, unknown>;
};

export type FetchOpts = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown; // already snake_case
  query?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
  /** Skip auth header (e.g. for login). */
  anonymous?: boolean;
};

function buildUrl(path: string, query?: FetchOpts['query']): string {
  const url = new URL(`${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === '') continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

export async function apiFetch<T = unknown>(
  path: string,
  opts: FetchOpts = {},
): Promise<ApiResult<T>> {
  const { method = 'GET', body, query, signal, anonymous = false } = opts;
  const url = buildUrl(path, query);
  const headers: Record<string, string> = { Accept: 'application/json' };

  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (!anonymous) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const started = performance.now();
  logger.debug(`-> ${method} ${path}`, { query, hasBody: body !== undefined });

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
      credentials: 'omit',
    });
  } catch (err) {
    const rawMessage = err instanceof Error ? err.message : String(err);
    logger.error(`x  ${method} ${path} (network)`, { message: rawMessage });
    // "Failed to fetch" / "NetworkError" are leaky browser internals — translate.
    const friendly =
      err instanceof DOMException && err.name === 'AbortError'
        ? 'Request cancelled'
        : "Can't reach the server right now. Please check your internet connection and try again.";
    throw new ApiError(0, 'NETWORK_ERROR', friendly);
  }

  const elapsed = Math.round(performance.now() - started);
  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload: unknown = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const errCode =
      (payload as { error?: { code?: string } } | null)?.error?.code ?? 'HTTP_ERROR';
    const backendMsg =
      (payload as { error?: { message?: string } } | null)?.error?.message ?? null;
    const errMsg = friendlyMessage(res.status, errCode, backendMsg);
    logger.warn(`<- ${method} ${path} ${res.status} ${errCode} (${elapsed}ms)`, {
      message: backendMsg ?? errMsg,
    });
    if (res.status === 401 && !anonymous) {
      clearToken();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    throw new ApiError(res.status, errCode, errMsg, payload);
  }

  logger.debug(`<- ${method} ${path} ${res.status} (${elapsed}ms)`);

  // Envelope: { data, meta? } — camelize the body for page consumers
  const envelope = (payload ?? {}) as { data?: unknown; meta?: Record<string, unknown> };
  return {
    data: camelize<T>(envelope.data ?? envelope),
    meta: envelope.meta ? (camelize(envelope.meta) as ListMeta) : undefined,
  };
}

/** Helper for list endpoints that bundle items + page meta. */
export type PagedResult<T> = {
  items: T[];
  total: number | null;
  limit: number;
  offset: number;
};

export async function apiList<T>(
  path: string,
  opts: FetchOpts = {},
): Promise<PagedResult<T>> {
  const res = await apiFetch<{ items: T[] } | T[]>(path, opts);
  // Backend list shape: data = { items, page: { limit, offset } }, meta = { total, totalKnown }
  const data = res.data as
    | { items: T[]; page?: { limit?: number; offset?: number } }
    | T[];
  const items = Array.isArray(data) ? data : data.items ?? [];
  const page = Array.isArray(data) ? undefined : data.page;
  const meta = res.meta ?? {};
  return {
    items,
    total: typeof meta.total === 'number' ? meta.total : null,
    limit: Number(page?.limit ?? meta.limit ?? items.length),
    offset: Number(page?.offset ?? meta.offset ?? 0),
  };
}
