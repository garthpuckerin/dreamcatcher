import React from 'react'

/**
 * Toast notification component
 */
export function Toast({ message, type = 'info', onClose, duration = 5000, action }) {
  const [visible, setVisible] = React.useState(true)

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(onClose, 300) // Wait for fade out animation
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const types = {
    info: 'bg-blue-600 border-blue-500',
    success: 'bg-green-600 border-green-500',
    warning: 'bg-yellow-600 border-yellow-500',
    error: 'bg-red-600 border-red-500',
  }

  const icons = {
    info: '💡',
    success: '✓',
    warning: '⚠',
    error: '✕',
  }

  return (
    <div
      className={`
        fixed bottom-4 right-4 max-w-sm p-4 rounded-lg shadow-xl border-l-4
        transform transition-all duration-300 z-50
        ${types[type]}
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl">{icons[type]}</span>
        <div className="flex-1">
          <p className="text-white font-medium">{message}</p>
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-sm text-white/80 hover:text-white underline"
            >
              {action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => {
            setVisible(false)
            setTimeout(onClose, 300)
          }}
          className="text-white/60 hover:text-white text-xl leading-none"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  )
}

/**
 * Toast container for managing multiple toasts
 */
export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ transform: `translateY(-${index * 10}px)` }}>
          <Toast {...toast} onClose={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  )
}

/**
 * Hook for managing toasts
 */
export function useToast() {
  const [toasts, setToasts] = React.useState([])

  const addToast = React.useCallback((message, type = 'info', options = {}) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, ...options }])
    return id
  }, [])

  const removeToast = React.useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const success = React.useCallback((msg, opts) => addToast(msg, 'success', opts), [addToast])
  const error = React.useCallback((msg, opts) => addToast(msg, 'error', opts), [addToast])
  const warning = React.useCallback((msg, opts) => addToast(msg, 'warning', opts), [addToast])
  const info = React.useCallback((msg, opts) => addToast(msg, 'info', opts), [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    ToastContainer: () => <ToastContainer toasts={toasts} removeToast={removeToast} />,
  }
}

export default { Toast, ToastContainer, useToast }
