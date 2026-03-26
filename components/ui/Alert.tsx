import { cn } from '@/lib/utils'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface AlertProps {
  variant?: AlertVariant
  title?: string
  children: React.ReactNode
  className?: string
  onDismiss?: () => void
}

const alertConfig: Record<
  AlertVariant,
  { border: string; bg: string; iconColor: string; icon: string }
> = {
  info: {
    border: 'border-[var(--kfx-accent)]/30',
    bg: 'bg-[var(--kfx-accent-muted)]',
    iconColor: 'text-[var(--kfx-accent)]',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  success: {
    border: 'border-[var(--kfx-success)]/30',
    bg: 'bg-[var(--kfx-success-muted)]',
    iconColor: 'text-[var(--kfx-success)]',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  warning: {
    border: 'border-[var(--kfx-warning)]/30',
    bg: 'bg-[var(--kfx-warning-muted)]',
    iconColor: 'text-[var(--kfx-warning)]',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  },
  error: {
    border: 'border-[var(--kfx-danger)]/30',
    bg: 'bg-[var(--kfx-danger-muted)]',
    iconColor: 'text-[var(--kfx-danger)]',
    icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
}

export function Alert({
  variant = 'info',
  title,
  children,
  className,
  onDismiss,
}: AlertProps) {
  const cfg = alertConfig[variant]
  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg border',
        cfg.border,
        cfg.bg,
        className
      )}
    >
      <svg
        className={cn('w-5 h-5 shrink-0 mt-0.5', cfg.iconColor)}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={cfg.icon}
        />
      </svg>
      <div className="flex-1 min-w-0">
        {title && (
          <p className={cn('text-sm font-medium mb-1', cfg.iconColor)}>{title}</p>
        )}
        <div className="text-sm text-[var(--kfx-text-muted)]">{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 text-[var(--kfx-text-subtle)] hover:text-[var(--kfx-text-muted)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center',
        className
      )}
    >
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-[var(--kfx-surface-raised)] flex items-center justify-center mb-4 text-[var(--kfx-text-subtle)]">
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-[var(--kfx-text-muted)]">{title}</p>
      {description && (
        <p className="text-xs text-[var(--kfx-text-subtle)] mt-1.5 max-w-xs">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('bg-[var(--kfx-surface-raised)] rounded animate-pulse', className)}
    />
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  )
}