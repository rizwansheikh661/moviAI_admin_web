/**
 * snake_case <-> camelCase converters.
 *
 * Backend returns snake_case (e.g. `public_id`, `total_fare`); existing page
 * components expect camelCase (e.g. `publicId`, `totalFare`) because that's
 * what the old Mock* types used. We auto-convert on the way in so page code
 * doesn't change.
 *
 * Outbound: most request bodies stay snake_case (matches backend Zod schemas);
 * callers pass already-snake_case keys when posting.
 */

function toCamel(s: string): string {
  return s.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function toSnake(s: string): string {
  return s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

export function camelize<T = unknown>(input: unknown): T {
  if (Array.isArray(input)) return input.map((v) => camelize(v)) as unknown as T;
  if (input === null || typeof input !== 'object') return input as T;
  if (input instanceof Date) return input as T;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    out[toCamel(k)] = camelize(v);
  }
  return out as T;
}

export function snakeize<T = unknown>(input: unknown): T {
  if (Array.isArray(input)) return input.map((v) => snakeize(v)) as unknown as T;
  if (input === null || typeof input !== 'object') return input as T;
  if (input instanceof Date) return input as T;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    out[toSnake(k)] = snakeize(v);
  }
  return out as T;
}
