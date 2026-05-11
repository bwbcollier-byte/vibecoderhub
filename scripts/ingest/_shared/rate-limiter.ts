// In-memory sliding-window rate limiter for outbound HTTP calls.
// One instance per source; pass to retryingFetch helpers or call await
// limiter.acquire() before each request.

export class RateLimiter {
  private timestamps: number[] = [];

  constructor(
    private readonly maxRequests: number,
    private readonly windowMs: number,
  ) {}

  async acquire(): Promise<void> {
    while (true) {
      const now = Date.now();
      const cutoff = now - this.windowMs;
      this.timestamps = this.timestamps.filter((t) => t > cutoff);
      if (this.timestamps.length < this.maxRequests) {
        this.timestamps.push(now);
        return;
      }
      const oldest = this.timestamps[0]!;
      const waitMs = oldest + this.windowMs - now + 25;
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
