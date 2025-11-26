/**
 * Dreamcatcher API Server
 * Main entry point for the backend API
 */

require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const {
  initSentry,
  sentryRequestHandler,
  sentryTracingHandler,
  sentryErrorHandler,
  performanceMonitoring,
  healthCheck,
  requestLogger,
  errorLogger,
} = require('./middleware/monitoring')

// Initialize Express app
const app = express()

// Initialize Sentry monitoring
initSentry(app)

// ============================================
// Middleware
// ============================================

// Sentry request handler (must be first)
app.use(sentryRequestHandler())
app.use(sentryTracingHandler())

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
    crossOriginEmbedderPolicy: false,
  })
)

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging
app.use(requestLogger())

// Performance monitoring
app.use(performanceMonitoring())

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
})

app.use('/api/', limiter)

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later.',
})

app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

// ============================================
// Health Check
// ============================================

// Initialize DB and Redis connections (simplified for now)
const db = null // TODO: Initialize database connection
const redis = null // TODO: Initialize Redis connection

app.get('/health', healthCheck(db, redis))

// ============================================
// API Routes
// ============================================

// Auth routes
// app.use('/api/auth', require('./routes/auth'));

// Portfolio routes
// app.use('/api/portfolios', require('./routes/portfolio'));

// Integration routes
// app.use('/api/integrations', require('./routes/integrations'));

// Template routes
// app.use('/api/templates', require('./routes/templates'));

// Dream routes
// app.use('/api/dreams', require('./routes/dreams'));

// Analytics routes
// app.use('/api/analytics', require('./routes/analytics'));

// User routes
// app.use('/api/users', require('./routes/users'));

// ============================================
// 404 Handler
// ============================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  })
})

// ============================================
// Error Handlers
// ============================================

// Error logger
app.use(errorLogger())

// Sentry error handler (must be before other error handlers)
app.use(sentryErrorHandler())

// Generic error handler
app.use((err, req, res, _next) => {
  const statusCode = err.statusCode || err.status || 500
  const message = err.message || 'Internal Server Error'

  // Don't leak error details in production
  const response = {
    error: process.env.NODE_ENV === 'production' ? 'Server Error' : message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  }

  res.status(statusCode).json(response)
})

// ============================================
// Start Server
// ============================================

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  console.log('')
  console.log('🚀 Dreamcatcher API Server')
  console.log('==========================')
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`Port: ${PORT}`)
  console.log(`Health: http://localhost:${PORT}/health`)
  console.log('')
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    // Close database connections
    if (db) db.destroy()
    if (redis) redis.quit()
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    if (db) db.destroy()
    if (redis) redis.quit()
    process.exit(0)
  })
})

module.exports = app
