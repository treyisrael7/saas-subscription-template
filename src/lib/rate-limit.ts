/**
 * Simple in-memory rate limiter for auth endpoints.
 * Uses fixed-window counter. For production with multiple instances, use Upstash Redis.
 */

const store = new Map<string, { count: number; windowStart: number }>();

const AUTH_LIMIT = 5;
const AUTH_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

export function checkAuthRateLimit(request: Request): { allowed: boolean; retryAfter?: number } {
  const ip = getClientIp(request);
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry) {
    store.set(ip, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (now - entry.windowStart > AUTH_WINDOW_MS) {
    store.set(ip, { count: 1, windowStart: now });
    return { allowed: true };
  }

  entry.count++;
  if (entry.count > AUTH_LIMIT) {
    const retryAfter = Math.ceil((entry.windowStart + AUTH_WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfter };
  }

  return { allowed: true };
}
