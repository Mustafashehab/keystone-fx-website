'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'kfx-btn-primary',
  secondary: 'kfx-btn-secondary',
  ghost: 'kfx-btn-ghost',
  danger: 'kfx-btn-danger',
  gold:
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium ' +
    'bg-[var(--kfx-gold-muted)] border border-[var(--kfx-gold)] text-[var(--kfx-gold)] ' +
    'hover:bg-[var(--kfx-gold)] hover:text-[var(--kfx-bg)] ' +
    'focus:outline-none focus:ring-2 focus:ring-[var(--kfx-gold)] focus:ring-offset-2 focus:ring-offset-[var(--kfx-bg)] ' +
    'disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: '!px-3 !py-1.5 !text-xs !gap-1.5',
  md: '',
  lg: '!px-6 !py-3 !text-base',
}

const Spinner = () => (
  <svg
    className="animate-spin h-3.5 w-3.5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
)

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(variantClasses[variant], sizeClasses[size], className)}
        {...props}
      >
        {loading ? (
          <Spinner />
        ) : (
          icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && icon && iconPosition === 'right' && (
          <span className="shrink-0">{icon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'