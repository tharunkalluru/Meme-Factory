import { RateLimitResult } from '@/types/meme';

interface RequestLog {
  count: number;
  firstRequestAt: Date;
}

// In-memory store (resets on server restart)
// For production with multiple servers, use Redis
const requestCounts = new Map<string, RequestLog>();

const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '10', 10);
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW || '3600', 10); // seconds

function addSeconds(date: Date, seconds: number): Date {
  return new Date(date.getTime() + seconds * 1000);
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = new Date();
  const log = requestCounts.get(ip);

  // No previous requests
  if (!log) {
    requestCounts.set(ip, { count: 1, firstRequestAt: now });
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX - 1,
      resetAt: addSeconds(now, RATE_LIMIT_WINDOW),
    };
  }

  // Window expired, reset
  const windowStart = addSeconds(now, -RATE_LIMIT_WINDOW);
  if (log.firstRequestAt < windowStart) {
    requestCounts.set(ip, { count: 1, firstRequestAt: now });
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX - 1,
      resetAt: addSeconds(now, RATE_LIMIT_WINDOW),
    };
  }

  // Within window, check count
  if (log.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: addSeconds(log.firstRequestAt, RATE_LIMIT_WINDOW),
    };
  }

  // Increment and allow
  log.count++;
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX - log.count,
    resetAt: addSeconds(log.firstRequestAt, RATE_LIMIT_WINDOW),
  };
}

// Cleanup old entries periodically (optional)
export function cleanupRateLimits(): void {
  const now = new Date();
  const windowStart = addSeconds(now, -RATE_LIMIT_WINDOW);

  for (const [ip, log] of requestCounts.entries()) {
    if (log.firstRequestAt < windowStart) {
      requestCounts.delete(ip);
    }
  }
}

// Run cleanup every hour
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimits, RATE_LIMIT_WINDOW * 1000);
}

