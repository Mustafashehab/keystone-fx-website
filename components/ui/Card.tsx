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

export function Card({
  children,
  className,
  raised = false,
  padding = 'md',
}: CardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[24px] border border-[#d7dce2] bg-[linear-gradient(180deg,#ffffff_0%,#f2f4f7_100%)] shadow-[0_10px_30px_rgba(15,23,42,0.08)]',
        raised && 'shadow-[0_18px_50px_rgba(15,23,42,0.12)]',
        paddingClasses[padding],
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.18)_42%,transparent_62%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/90" />
      <div className="relative">{children}</div>
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
    <div className={cn('flex items-start justify-between gap-4 mb-5', className)}>
      <div>
        <h3 className="text-[15px] font-semibold tracking-tight text-[#111827]">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-[#6b7280] mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div className="ml-4 shrink-0">{action}</div>}
    </div>
  )
}

export function CardDivider() {
  return <div className="my-5 h-px bg-[#e5e7eb]" />
}

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
    positive: 'text-emerald-600',
    negative: 'text-rose-600',
    neutral: 'text-[#6b7280]',
  }[deltaType]

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[24px] border border-[#d7dce2] bg-[linear-gradient(180deg,#ffffff_0%,#eef2f6_100%)] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.22)_44%,transparent_66%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/90" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280] mb-2.5">
            {label}
          </p>

          <p className="text-[30px] leading-none font-semibold tracking-tight text-[#0f172a] tabular-nums">
            {value}
          </p>

          {delta && (
            <p className={cn('text-xs mt-3 font-medium', deltaColor)}>
              {delta}
            </p>
          )}
        </div>

        {icon && (
          <div className="shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d7dce2] bg-[linear-gradient(145deg,#f8fafc_0%,#e5e7eb_100%)] text-[#4b5563] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_12px_rgba(15,23,42,0.06)]">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}