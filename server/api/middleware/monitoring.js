/**
 * Monitoring and Error Tracking Middleware
 * Integrates Sentry, performance monitoring, and health checks
 */

const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require('@sentry/profiling-node');

/**
 * Initialize Sentry
 */
function initSentry(app) {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      integrations: [
        // Enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // Enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app }),
        // Profiling
        new ProfilingIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
      // Profiling
      profilesSampleRate: parseFloat(process.env.SENTRY_PROFILES_SAMPLE_RATE || '0.1'),
      // Ignore common errors
      ignoreErrors: [
        'ECONNRESET',
        'EPIPE',
        'ECANCELED',
        'ERR_STREAM_PREMATURE_CLOSE',
      ],
      beforeSend(event, hint) {
        // Filter out sensitive data
        if (event.request) {
          delete event.request.cookies;
          if (event.request.headers) {
            delete event.request.headers.authorization;
            delete event.request.headers.cookie;
          }
        }
        return event;
      },
    });

    console.log('✓ Sentry monitoring initialized');
  }
}

/**
 * Request handler middleware (must be first)
 */
function sentryRequestHandler() {
  return Sentry.Handlers.requestHandler();
}

/**
 * Tracing middleware
 */
function sentryTracingHandler() {
  return Sentry.Handlers.tracingHandler();
}

/**
 * Error handler middleware (must be last)
 */
function sentryErrorHandler() {
  return Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Capture all errors with status code >= 500
      if (error.status >= 500) {
        return true;
      }
      return false;
    },
  });
}

/**
 * Performance monitoring middleware
 */
function performanceMonitoring() {
  return (req, res, next) => {
    const start = Date.now();

    // Capture response time
    res.on('finish', () => {
      const duration = Date.now() - start;

      // Log slow requests
      if (duration > 1000) {
        console.warn(`⚠️  Slow request: ${req.method} ${req.path} - ${duration}ms`);
      }

      // Send to monitoring service
      if (process.env.ANALYTICS_ENABLED === 'true') {
        // You can integrate with DataDog, New Relic, etc.
        recordMetric('api.request.duration', duration, {
          method: req.method,
          path: req.route?.path || req.path,
          status: res.statusCode,
        });
      }
    });

    next();
  };
}

/**
 * Health check endpoint
 */
function healthCheck(db, redis) {
  return async (req, res) => {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {},
    };

    // Check database
    try {
      if (db) {
        await db.raw('SELECT 1');
        health.services.database = 'healthy';
      }
    } catch (error) {
      health.status = 'unhealthy';
      health.services.database = 'unhealthy';
      console.error('Database health check failed:', error);
    }

    // Check Redis
    try {
      if (redis) {
        await redis.ping();
        health.services.redis = 'healthy';
      }
    } catch (error) {
      health.status = 'unhealthy';
      health.services.redis = 'unhealthy';
      console.error('Redis health check failed:', error);
    }

    // Check memory usage
    const memUsage = process.memoryUsage();
    health.memory = {
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
    };

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  };
}

/**
 * Record custom metrics
 */
function recordMetric(name, value, tags = {}) {
  // Integrate with your monitoring service
  // Example: DataDog, New Relic, CloudWatch, etc.

  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 Metric: ${name} = ${value}`, tags);
  }

  // Example: DataDog StatsD
  // const StatsD = require('hot-shots');
  // const dogstatsd = new StatsD();
  // dogstatsd.histogram(name, value, tags);
}

/**
 * Request logger
 */
function requestLogger() {
  return (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const logData = {
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('user-agent'),
        ip: req.ip,
      };

      // Structured logging
      if (process.env.LOG_FORMAT === 'json') {
        console.log(JSON.stringify(logData));
      } else {
        const emoji = res.statusCode < 400 ? '✓' : '✗';
        console.log(
          `${emoji} ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
        );
      }
    });

    next();
  };
}

/**
 * Error logger
 */
function errorLogger() {
  return (err, req, res, next) => {
    const errorData = {
      message: err.message,
      stack: err.stack,
      method: req.method,
      path: req.path,
      userAgent: req.get('user-agent'),
      ip: req.ip,
    };

    if (process.env.LOG_FORMAT === 'json') {
      console.error(JSON.stringify(errorData));
    } else {
      console.error(`❌ Error in ${req.method} ${req.path}:`, err.message);
      if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
      }
    }

    next(err);
  };
}

module.exports = {
  initSentry,
  sentryRequestHandler,
  sentryTracingHandler,
  sentryErrorHandler,
  performanceMonitoring,
  healthCheck,
  recordMetric,
  requestLogger,
  errorLogger,
};
