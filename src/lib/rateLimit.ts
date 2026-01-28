import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Initialize Redis client for Upstash (serverless-compatible)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

// In-memory fallback for development/when Redis not configured
const inMemoryStore = new Map<string, { count: number; resetAt: number }>()

// Rate limiter configurations
export const loginRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 attempts per 15 minutes
      analytics: true,
      prefix: 'l7_login',
    })
  : null

export const apiRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
      analytics: true,
      prefix: 'l7_api',
    })
  : null

// Fallback rate limiting for when Redis is not available
export async function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): Promise<{ success: boolean; remaining: number; reset: number }> {
  // Use Upstash if available
  if (loginRateLimit) {
    const result = await loginRateLimit.limit(identifier)
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
    }
  }

  // Fallback to in-memory rate limiting
  const now = Date.now()
  const key = `login_${identifier}`
  const stored = inMemoryStore.get(key)

  // Clean up expired entries periodically
  if (Math.random() < 0.1) {
    cleanupExpiredEntries()
  }

  if (!stored || now > stored.resetAt) {
    // First attempt or window expired
    inMemoryStore.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: maxAttempts - 1, reset: now + windowMs }
  }

  if (stored.count >= maxAttempts) {
    // Rate limited
    return { success: false, remaining: 0, reset: stored.resetAt }
  }

  // Increment counter
  stored.count++
  inMemoryStore.set(key, stored)
  return { success: true, remaining: maxAttempts - stored.count, reset: stored.resetAt }
}

// Clear rate limit for an identifier (on successful login)
export async function clearRateLimit(identifier: string): Promise<void> {
  if (redis) {
    await redis.del(`l7_login:${identifier}`)
  } else {
    inMemoryStore.delete(`login_${identifier}`)
  }
}

// Cleanup expired in-memory entries
function cleanupExpiredEntries(): void {
  const now = Date.now()
  const entries = Array.from(inMemoryStore.entries())
  for (const [key, value] of entries) {
    if (now > value.resetAt) {
      inMemoryStore.delete(key)
    }
  }
}

// IP-based rate limiting for additional security
export async function checkIpRateLimit(
  ip: string,
  maxAttempts: number = 20,
  windowMs: number = 60 * 60 * 1000 // 1 hour
): Promise<boolean> {
  const key = `ip_${ip}`
  const stored = inMemoryStore.get(key)
  const now = Date.now()

  if (!stored || now > stored.resetAt) {
    inMemoryStore.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (stored.count >= maxAttempts) {
    return false
  }

  stored.count++
  inMemoryStore.set(key, stored)
  return true
}

// Suspicious activity detection
export interface SuspiciousActivity {
  type: 'brute_force' | 'credential_stuffing' | 'distributed_attack' | 'unusual_pattern'
  confidence: number
  details: string
}

export async function detectSuspiciousActivity(
  ip: string,
  email: string,
  userAgent: string
): Promise<SuspiciousActivity | null> {
  // Check for rapid attempts from same IP
  const ipKey = `suspicious_ip_${ip}`
  const ipAttempts = inMemoryStore.get(ipKey)

  if (ipAttempts && ipAttempts.count > 10) {
    return {
      type: 'brute_force',
      confidence: 0.9,
      details: `${ipAttempts.count} attempts from IP in short window`,
    }
  }

  // Check for attempts on multiple accounts from same IP
  const multiAccountKey = `multi_${ip}`
  const emailKey = `email_${ip}_${email}`

  if (!inMemoryStore.has(emailKey)) {
    const multiCount = inMemoryStore.get(multiAccountKey)
    if (multiCount && multiCount.count > 3) {
      return {
        type: 'credential_stuffing',
        confidence: 0.8,
        details: 'Multiple account attempts from same IP',
      }
    }
    inMemoryStore.set(emailKey, { count: 1, resetAt: Date.now() + 3600000 })
    inMemoryStore.set(multiAccountKey, {
      count: (multiCount?.count || 0) + 1,
      resetAt: Date.now() + 3600000,
    })
  }

  // Check for suspicious user agent patterns
  const suspiciousAgents = ['curl', 'wget', 'python', 'bot', 'spider', 'scraper']
  const lowerAgent = userAgent.toLowerCase()
  if (suspiciousAgents.some(agent => lowerAgent.includes(agent))) {
    return {
      type: 'unusual_pattern',
      confidence: 0.6,
      details: 'Suspicious user agent detected',
    }
  }

  return null
}
