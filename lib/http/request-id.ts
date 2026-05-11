// Request-ID propagation.
//
// Middleware (Edge) generates a UUID per request and forwards it on the
// `x-request-id` header. Server-side code reads it from next/headers and
// stashes it in AsyncLocalStorage so logger.ts and Sentry can tag every
// log line with the same id without prop drilling.
//
// AsyncLocalStorage is Node-only — Edge middleware uses generateRequestId()
// and adds the header but never enters the ALS context. Server Components,
// Server Actions, and route handlers (all Node) enter via withRequestId().

import { AsyncLocalStorage } from 'node:async_hooks';

export const REQUEST_ID_HEADER = 'x-request-id';

const store = new AsyncLocalStorage<string>();

export function generateRequestId(): string {
  // crypto.randomUUID is available in both Edge and Node 19+.
  return crypto.randomUUID();
}

export function withRequestId<T>(requestId: string, fn: () => T): T {
  return store.run(requestId, fn);
}

/**
 * Returns the current request ID, or undefined if not inside an ALS context.
 * Prefer this over reading headers directly so the same id appears in logs,
 * Sentry breadcrumbs, and any out-of-band telemetry.
 */
export function getRequestId(): string | undefined {
  return store.getStore();
}
