import { NextRequest } from 'next/server'

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(request: NextRequest, limit = 100, windowMs = 15 * 60 * 1000) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const windowStart = now - windowMs

  // Limpar entradas antigas
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < windowStart) {
      rateLimitMap.delete(key)
    }
  }

  const current = rateLimitMap.get(ip)
  
  if (!current) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return { success: true, remaining: limit - 1 }
  }

  if (current.resetTime < now) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return { success: true, remaining: limit - 1 }
  }

  if (current.count >= limit) {
    return { success: false, remaining: 0 }
  }

  current.count++
  return { success: true, remaining: limit - current.count }
}