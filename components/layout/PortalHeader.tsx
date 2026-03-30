'use client'

import { cn } from '@/lib/utils'
import { NotificationBell } from '@/components/ui/NotificationBell'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePortalI18n } from '@/lib/portal-i18n'

interface PortalHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export function PortalHeader({
  title,
  subtitle,
  action,
  className,
}: PortalHeaderProps) {
  const supabase = createClient()
  const [clientId, setClientId] = useState<string | null>(null)
  const { lang, toggle } = usePortalI18n()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase
        .from('client_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()
      if (profile) setClientId(profile.id)
    }
    load()
  }, [])

  return (
    <header
      className={cn(
        'relative px-7 py-6 border-b border-[var(--kfx-border)] bg-[var(--kfx-bg-elevated)]',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(148,163,184,0.08),transparent_45%)]" />

      <div className="relative flex items-start justify-between gap-6">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight text-[var(--kfx-text)]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[14px] text-[var(--kfx-text-muted)] mt-1.5 max-w-xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">

          {/* Language toggle */}
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--kfx-border)] bg-[var(--kfx-surface)] hover:bg-[var(--kfx-surface-raised)] transition-colors text-xs font-semibold text-[var(--kfx-text-muted)] hover:text-[var(--kfx-text)]"
            title={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
          >
            <span className="text-sm">{lang === 'en' ? '🇸🇦' : '🇬🇧'}</span>
            <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>

          {clientId && (
            <NotificationBell recipient="client" clientId={clientId} />
          )}
          {action && <div>{action}</div>}
        </div>
      </div>
    </header>
  )
}

interface OnboardingProgressProps {
  currentStep: number
  steps: string[]
}

export function OnboardingProgress({ currentStep, steps }: OnboardingProgressProps) {
  return (
    <div className="px-7 py-5 bg-[var(--kfx-bg-elevated)] border-b border-[var(--kfx-border)]">
      <div className="flex items-center">
        {steps.map((label, i) => {
          const stepNum = i + 1
          const isComplete = stepNum < currentStep
          const isActive = stepNum === currentStep
          const isLast = i === steps.length - 1

          return (
            <div key={label} className={cn('flex items-center', !isLast && 'flex-1')}>
              <div className="flex items-center gap-2 shrink-0">
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
                  isComplete && 'bg-[var(--kfx-success)] text-white shadow-sm',
                  isActive && 'bg-[#e2e8f0] text-[#0f172a] ring-4 ring-[#eef2f6]',
                  !isComplete && !isActive && 'bg-[var(--kfx-surface-raised)] text-[var(--kfx-text-subtle)] border border-[var(--kfx-border)]'
                )}>
                  {isComplete ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : stepNum}
                </div>
                <span className={cn(
                  'text-xs font-medium hidden sm:block whitespace-nowrap',
                  isActive ? 'text-[var(--kfx-text)]' : 'text-[var(--kfx-text-muted)]'
                )}>
                  {label}
                </span>
              </div>
              {!isLast && (
                <div className={cn('flex-1 h-px mx-3', isComplete ? 'bg-[var(--kfx-success)]' : 'bg-[var(--kfx-border)]')} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}