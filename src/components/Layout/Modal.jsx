import React from 'react'

/**
 * Modal component for overlaying content
 * @param {React.ReactNode} children - Content to display in the modal
 * @param {Function} onClose - Callback when clicking outside the modal
 */
const Modal = React.memo(function Modal({ children, onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#1e293b',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1px solid #334155',
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
})

export default Modal
