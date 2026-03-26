import { cn } from '@/lib/utils'

interface PortalHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export function PortalHeader({ title, subtitle, action, className }: PortalHeaderProps) {
  return (
    <header
      className={cn(
        'flex items-start justify-between px-6 py-5 border-b border-[var(--kfx-border)] bg-[var(--kfx-surface)]',
        className
      )}
    >
      <div>
        <h1 className="kfx-page-title">{title}</h1>
        {subtitle && <p className="kfx-page-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 ml-4">{action}</div>}
    </header>
  )
}

// ─── Onboarding progress stepper ─────────────────────────────────────────────

interface OnboardingProgressProps {
  currentStep: number
  steps: string[]
}

export function OnboardingProgress({ currentStep, steps }: OnboardingProgressProps) {
  return (
    <div className="px-6 py-4 bg-[var(--kfx-surface)] border-b border-[var(--kfx-border)]">
      <div className="flex items-center">
        {steps.map((label, i) => {
          const stepNum = i + 1
          const isComplete = stepNum < currentStep
          const isActive = stepNum === currentStep
          const isLast = i === steps.length - 1

          return (
            <div key={label} className={cn('flex items-center', !isLast && 'flex-1')}>
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
                    isComplete
                      ? 'bg-[var(--kfx-success)] text-white'
                      : isActive
                      ? 'bg-[var(--kfx-accent)] text-white ring-4 ring-[var(--kfx-accent-muted)]'
                      : 'bg-[var(--kfx-surface-raised)] text-[var(--kfx-text-subtle)] border border-[var(--kfx-border)]'
                  )}
                >
                  {isComplete ? (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium hidden sm:block whitespace-nowrap',
                    isActive
                      ? 'text-[var(--kfx-text)]'
                      : 'text-[var(--kfx-text-muted)]'
                  )}
                >
                  {label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'flex-1 h-px mx-3',
                    isComplete
                      ? 'bg-[var(--kfx-success)]'
                      : 'bg-[var(--kfx-border)]'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}