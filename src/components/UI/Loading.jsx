import React from 'react'

/**
 * Spinner component for loading states
 */
export function Spinner({ size = 'md', color = 'primary', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  }

  const colors = {
    primary: 'border-blue-500',
    secondary: 'border-gray-400',
    white: 'border-white',
    success: 'border-green-500'
  }

  return (
    <div
      className={`inline-block rounded-full border-t-transparent animate-spin ${sizes[size]} ${colors[color]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

/**
 * Full page loading overlay
 */
export function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <Spinner size="xl" color="primary" />
        <p className="mt-4 text-slate-300 text-lg">{message}</p>
      </div>
    </div>
  )
}

/**
 * Inline loading indicator
 */
export function LoadingInline({ message = 'Loading...', size = 'sm' }) {
  return (
    <div className="flex items-center gap-2 text-slate-400">
      <Spinner size={size} color="secondary" />
      <span>{message}</span>
    </div>
  )
}

/**
 * Button with loading state
 */
export function LoadingButton({
  loading = false,
  disabled = false,
  children,
  loadingText = 'Loading...',
  className = '',
  ...props
}) {
  return (
    <button
      disabled={loading || disabled}
      className={`relative inline-flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" color="white" />}
      <span className={loading ? 'opacity-70' : ''}>{loading ? loadingText : children}</span>
    </button>
  )
}

/**
 * Skeleton loader for content placeholders
 */
export function Skeleton({ className = '', variant = 'text', width, height }) {
  const baseClass = 'animate-pulse bg-slate-700 rounded'
  
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-10 w-10 rounded-full',
    thumbnail: 'h-24 w-24 rounded-lg',
    card: 'h-32 w-full rounded-xl',
    button: 'h-10 w-24 rounded-lg'
  }

  const style = {}
  if (width) style.width = width
  if (height) style.height = height

  return (
    <div
      className={`${baseClass} ${variants[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  )
}

/**
 * Skeleton card for dream list items
 */
export function DreamCardSkeleton() {
  return (
    <div className="bg-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <Skeleton variant="title" width="60%" />
        <Skeleton variant="button" width="60px" height="24px" />
      </div>
      <Skeleton variant="text" />
      <Skeleton variant="text" width="80%" />
      <div className="flex gap-2 mt-2">
        <Skeleton variant="button" width="50px" height="20px" />
        <Skeleton variant="button" width="60px" height="20px" />
        <Skeleton variant="button" width="45px" height="20px" />
      </div>
    </div>
  )
}

/**
 * Multiple skeleton cards for list loading
 */
export function DreamListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <DreamCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default {
  Spinner,
  LoadingOverlay,
  LoadingInline,
  LoadingButton,
  Skeleton,
  DreamCardSkeleton,
  DreamListSkeleton
}
