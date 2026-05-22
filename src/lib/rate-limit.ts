import { db } from "./db";

interface RateLimitParams {
  ip: string;
  limit: number;
  durationSeconds: number;
}

/**
 * Basic memory cache for in-memory rate limiting (works per-instance)
 */
const rateLimitCache = new Map<string, { count: number; expiresAt: number }>();

export async function rateLimit({ ip, limit, durationSeconds }: RateLimitParams): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const now = Date.now();
  const cacheKey = `rate_limit:${ip}`;
  const record = rateLimitCache.get(cacheKey);

  if (!record || now > record.expiresAt) {
    const expiresAt = now + durationSeconds * 1000;
    rateLimitCache.set(cacheKey, { count: 1, expiresAt });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: expiresAt,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: record.expiresAt,
    };
  }

  record.count += 1;
  rateLimitCache.set(cacheKey, record);

  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: record.expiresAt,
  };
}

/**
 * Database-backed rate limiter specifically for product verifications
 * Prevents brute-forcing codes across multiple IP addresses/sessions
 */
export async function checkVerificationRateLimit(ip: string, limit: number = 10): Promise<boolean> {
  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const attemptCount = await db.verificationAttemptLog.count({
      where: {
        ipAddress: ip,
        createdAt: {
          gte: fifteenMinutesAgo,
        },
      },
    });

    return attemptCount < limit;
  } catch (error) {
    console.error("Rate limit check failed:", error);
    return true; // Fallback to allow check in case DB is down
  }
}
