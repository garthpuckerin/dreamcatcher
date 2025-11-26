// Shared utilities for API routes

/**
 * In-memory rate limiter
 * Note: Resets on cold start - for production, use Redis/Upstash
 */
const rateLimitStore = new Map()

export function rateLimit(identifier, { limit = 20, windowMs = 60000 } = {}) {
  const now = Date.now()
  const key = `${identifier}`
  const requests = rateLimitStore.get(key) || []
  const recentRequests = requests.filter(time => now - time < windowMs)

  if (recentRequests.length >= limit) {
    return { allowed: false, remaining: 0, resetIn: Math.ceil((requests[0] + windowMs - now) / 1000) }
  }

  recentRequests.push(now)
  rateLimitStore.set(key, recentRequests)
  
  return { allowed: true, remaining: limit - recentRequests.length }
}

/**
 * Get client identifier for rate limiting
 */
export function getClientId(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() 
    || req.socket?.remoteAddress 
    || 'unknown'
}

/**
 * Sanitize string input
 */
export function sanitizeString(input, maxLength = 10000) {
  if (typeof input !== 'string') return ''
  return input
    .slice(0, maxLength)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .trim()
}

/**
 * Validate request body
 */
export function validateBody(body, schema) {
  const errors = []
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = body[field]
    
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`)
      continue
    }
    
    if (value !== undefined && value !== null) {
      if (rules.type === 'string' && typeof value !== 'string') {
        errors.push(`${field} must be a string`)
      }
      if (rules.type === 'array' && !Array.isArray(value)) {
        errors.push(`${field} must be an array`)
      }
      if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
        errors.push(`${field} exceeds maximum length of ${rules.maxLength}`)
      }
      if (rules.maxItems && Array.isArray(value) && value.length > rules.maxItems) {
        errors.push(`${field} exceeds maximum items of ${rules.maxItems}`)
      }
    }
  }
  
  return errors.length > 0 ? errors : null
}

/**
 * Standard CORS handler
 */
export function handleCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return true
  }
  return false
}

/**
 * Standard error response
 */
export function errorResponse(res, status, message, details = null) {
  const response = { error: message }
  if (details && process.env.NODE_ENV !== 'production') {
    response.details = details
  }
  return res.status(status).json(response)
}

/**
 * Wrap handler with common middleware
 */
export function withMiddleware(handler, options = {}) {
  const { 
    rateLimit: rateLimitOptions = { limit: 20, windowMs: 60000 },
    methods = ['POST']
  } = options

  return async (req, res) => {
    // CORS
    if (handleCors(req, res)) return

    // Method check
    if (!methods.includes(req.method)) {
      return errorResponse(res, 405, 'Method not allowed')
    }

    // Rate limiting
    const clientId = getClientId(req)
    const rateLimitResult = rateLimit(clientId, rateLimitOptions)
    
    res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining)
    
    if (!rateLimitResult.allowed) {
      res.setHeader('Retry-After', rateLimitResult.resetIn)
      return errorResponse(res, 429, 'Rate limit exceeded. Please try again later.')
    }

    // Execute handler
    try {
      return await handler(req, res)
    } catch (error) {
      console.error('API Error:', error)
      
      if (error.code === 'insufficient_quota') {
        return errorResponse(res, 503, 'AI service temporarily unavailable')
      }
      
      return errorResponse(res, 500, 'Internal server error', error.message)
    }
  }
}
