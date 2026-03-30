'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  footer?: React.ReactNode
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}

export function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
      <div
        className={cn(
          'relative w-full bg-[var(--kfx-surface)] border border-[var(--kfx-border)] rounded-xl shadow-2xl',
          'animate-slide-up',
          sizeClasses[size]
        )}
        role="dialog"
        aria-modal="true"
      >
        {(title || description) && (
          <div className="px-6 pt-6 pb-4 border-b border-[var(--kfx-border)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                {title && (
                  <h2 className="text-base font-semibold text-[var(--kfx-text)]">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-sm text-[var(--kfx-text-muted)] mt-1">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-[var(--kfx-text-muted)] hover:text-[var(--kfx-text)] hover:bg-[var(--kfx-surface-raised)] transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="px-6 pb-5 pt-0 flex items-center justify-end gap-3 border-t border-[var(--kfx-border)] mt-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            className="kfx-btn-secondary"
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={
              variant === 'danger' ? 'kfx-btn-danger' : 'kfx-btn-primary'
            }
          >
            {loading ? 'Processing…' : confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-[var(--kfx-text-muted)]">{message}</p>
    </Modal>
  )
}