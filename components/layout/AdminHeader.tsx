'use client'

import { cn } from '@/lib/utils'

const GOLD_BORDER = 'rgba(201,168,76,0.10)'
const GOLD_50 = 'rgba(201,168,76,0.50)'
const ADMIN_BG = 'linear-gradient(180deg, #0d1117 0%, #0a0e14 100%)'

interface AdminHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export function AdminHeader({
  title,
  subtitle,
  action,
  className,
}: AdminHeaderProps) {
  return (
    <header
      className={cn('flex items-start justify-between px-6 py-5 border-b', className)}
      style={{ background: ADMIN_BG, borderColor: GOLD_BORDER }}
    >
      <div>
        <h1 className="text-xl font-semibold text-[var(--kfx-text)] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: GOLD_50 }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 ml-4">{action}</div>}
    </header>
  )
}

// ─── Filter / search bar used across list pages ───────────────────────────────

interface AdminFilterBarProps {
  searchPlaceholder?: string
  searchValue: string
  onSearchChange: (value: string) => void
  children?: React.ReactNode
}

export function AdminFilterBar({
  searchPlaceholder = 'Search…',
  searchValue,
  onSearchChange,
  children,
}: AdminFilterBarProps) {
  return (
    <div
      className="flex items-center gap-3 px-6 py-3 border-b"
      style={{ borderColor: 'rgba(201,168,76,0.08)' }}
    >
      <div className="relative flex-1 max-w-xs">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--kfx-text-subtle)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="kfx-input !pl-9 !py-2 text-sm"
        />
      </div>
      {children}
    </div>
  )
}