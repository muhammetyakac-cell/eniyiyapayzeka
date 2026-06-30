import pLimit from "p-limit";

/**
 * Rate limiter for external API calls.
 * Uses p-limit for concurrency control + delay between tasks.
 *
 * Gemini free tier: 15 RPM → concurrency 3, 4s delay keeps us safe.
 * GitHub API: 5000/hour with token → concurrency 5, no delay needed.
 */

/** Default concurrency for Gemini API (conservative) */
const GEMINI_CONCURRENCY = 3;
const GEMINI_DELAY_MS = 4000;

/** Default concurrency for other APIs */
const DEFAULT_CONCURRENCY = 5;

export function createRateLimiter(concurrency: number = DEFAULT_CONCURRENCY) {
  return pLimit(concurrency);
}

export function createGeminiLimiter() {
  return pLimit(GEMINI_CONCURRENCY);
}

/**
 * Execute a batch of async tasks with rate limiting.
 * Adds a delay between each task to respect API rate limits.
 */
export async function rateLimitedBatch<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  options: {
    concurrency?: number;
    delayMs?: number;
  } = {}
): Promise<{ results: R[]; errors: Array<{ item: T; error: Error }> }> {
  const { concurrency = GEMINI_CONCURRENCY, delayMs = GEMINI_DELAY_MS } = options;
  const limit = pLimit(concurrency);
  const results: R[] = [];
  const errors: Array<{ item: T; error: Error }> = [];

  const tasks = items.map((item) =>
    limit(async () => {
      try {
        const result = await fn(item);
        results.push(result);

        // Respect rate limits
        if (delayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }

        return result;
      } catch (err) {
        errors.push({
          item,
          error: err instanceof Error ? err : new Error(String(err)),
        });
        return null;
      }
    })
  );

  await Promise.allSettled(tasks);

  return { results, errors };
}

export { pLimit };
