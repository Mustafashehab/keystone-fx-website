import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  raised?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

export function Card({ children, className, raised = false, padding = 'md' }: CardProps) {
  return (
    <div
      className={cn(
        raised ? 'kfx-card-raised' : 'kfx-card',
        paddingClasses[padding],
        'animate-fade-in',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-start justify-between mb-5', className)}>
      <div>
        <h3 className="text-base font-semibold text-[var(--kfx-text)]">{title}</h3>
        {subtitle && <p className="text-sm text-[var(--kfx-text-muted)] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="ml-4 shrink-0">{action}</div>}
    </div>
  )
}

export function CardDivider() {
  return <div className="kfx-divider" />
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string | number
  delta?: string
  deltaType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
  className?: string
}

export function StatCard({
  label,
  value,
  delta,
  deltaType = 'neutral',
  icon,
  className,
}: StatCardProps) {
  const deltaColor = {
    positive: 'text-[var(--kfx-success)]',
    negative: 'text-[var(--kfx-danger)]',
    neutral: 'text-[var(--kfx-text-muted)]',
  }[deltaType]

  return (
    <div className={cn('kfx-card p-5', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-[var(--kfx-text-muted)] uppercase tracking-wider mb-2">
            {label}
          </p>
          <p className="text-2xl font-semibold text-[var(--kfx-text)] tabular-nums">{value}</p>
          {delta && <p className={cn('text-xs mt-1', deltaColor)}>{delta}</p>}
        </div>
        {icon && (
          <div className="w-9 h-9 rounded-md bg-[var(--kfx-accent-muted)] flex items-center justify-center text-[var(--kfx-accent)] shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}