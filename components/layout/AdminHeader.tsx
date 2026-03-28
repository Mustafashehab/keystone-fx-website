'use client'

interface AdminHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export function AdminHeader({ title, subtitle, action, className }: AdminHeaderProps) {
  return (
    <header className="flex items-start justify-between px-6 py-5 border-b border-[#eef2f6] bg-white">
      <div>
        <h1 className="text-xl font-semibold text-[#0f172a] tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-[#64748b] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 ml-4">{action}</div>}
    </header>
  )
}

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
    <div className="flex items-center gap-3 px-6 py-3 border-b border-[#eef2f6] bg-white flex-wrap">
      <div className="relative flex-1 max-w-xs">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="search" value={searchValue} onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full h-[38px] pl-9 pr-3 rounded-lg border border-[#e2e8f0] bg-white text-sm text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#94a3b8] focus:ring-2 focus:ring-[#eef2f6] transition-all" />
      </div>
      {children}
    </div>
  )
}