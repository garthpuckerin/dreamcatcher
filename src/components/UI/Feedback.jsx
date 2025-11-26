import React from 'react'

/**
 * Error display for API/async errors
 */
export function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
  variant = 'default',
}) {
  const variants = {
    default: 'bg-red-900/20 border-red-500/50 text-red-200',
    warning: 'bg-yellow-900/20 border-yellow-500/50 text-yellow-200',
    info: 'bg-blue-900/20 border-blue-500/50 text-blue-200',
  }

  return (
    <div className={`rounded-lg border p-4 ${variants[variant]}`} role="alert">
      <div className="flex items-start gap-3">
        <span className="text-xl">
          {variant === 'warning' ? '⚠️' : variant === 'info' ? 'ℹ️' : '❌'}
        </span>
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          {message && <p className="mt-1 text-sm opacity-80">{message}</p>}
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Empty state display
 */
export function EmptyState({ icon = '📭', title = 'Nothing here yet', description, action }) {
  return (
    <div className="text-center py-12 px-4">
      <span className="text-5xl mb-4 block">{icon}</span>
      <h3 className="text-xl font-semibold text-slate-200 mb-2">{title}</h3>
      {description && <p className="text-slate-400 mb-6 max-w-md mx-auto">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

/**
 * Offline indicator
 */
export function OfflineIndicator() {
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine)

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-600 text-yellow-100 text-center py-2 text-sm font-medium z-50">
      📡 You&apos;re offline. Some features may not work.
    </div>
  )
}

/**
 * Network error with retry
 */
export function NetworkError({ onRetry }) {
  return (
    <ErrorMessage
      title="Connection Error"
      message="Unable to connect to the server. Please check your internet connection and try again."
      onRetry={onRetry}
    />
  )
}

/**
 * AI feature unavailable
 */
export function AIUnavailable({ reason = 'API key not configured' }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
      <span className="text-3xl mb-2 block">🤖</span>
      <h3 className="font-medium text-slate-200">AI Features Unavailable</h3>
      <p className="text-sm text-slate-400 mt-1">{reason}</p>
    </div>
  )
}

export default {
  ErrorMessage,
  EmptyState,
  OfflineIndicator,
  NetworkError,
  AIUnavailable,
}
