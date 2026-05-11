// Exponential backoff with jitter. Retries on network errors and 429/5xx.

import { sleep } from './rate-limiter';

export interface RetryOptions {
  attempts?: number;
  baseMs?: number;
  capMs?: number;
  onRetry?: (err: unknown, attempt: number) => void;
}

export async function retry<T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
  const attempts = opts.attempts ?? 4;
  const baseMs = opts.baseMs ?? 500;
  const capMs = opts.capMs ?? 15_000;
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i === attempts - 1) break;
      opts.onRetry?.(err, i + 1);
      const expo = Math.min(capMs, baseMs * 2 ** i);
      const jitter = Math.random() * expo * 0.3;
      await sleep(expo + jitter);
    }
  }
  throw lastErr;
}

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly url: string,
    readonly body: string,
  ) {
    super(`HTTP ${status} ${url}: ${body.slice(0, 200)}`);
  }
}

export async function fetchJson<T = unknown>(
  url: string,
  init: RequestInit = {},
  opts: RetryOptions = {},
): Promise<T> {
  return retry(async () => {
    const res = await fetch(url, init);
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new HttpError(res.status, url, body);
    }
    return (await res.json()) as T;
  }, opts);
}

export async function fetchText(
  url: string,
  init: RequestInit = {},
  opts: RetryOptions = {},
): Promise<string> {
  return retry(async () => {
    const res = await fetch(url, init);
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new HttpError(res.status, url, body);
    }
    return await res.text();
  }, opts);
}
