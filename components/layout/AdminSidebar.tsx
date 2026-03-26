'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const DashboardIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const ClientsIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const KYCIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const DocumentsIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
)

const LeadsIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const TicketsIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
)

const SettingsIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: <DashboardIcon /> },
    ],
  },
  {
    label: 'Client Management',
    items: [
      { label: 'Clients',    href: '/admin/clients',   icon: <ClientsIcon /> },
      { label: 'KYC Review', href: '/admin/kyc',       icon: <KYCIcon /> },
      { label: 'Documents',  href: '/admin/documents', icon: <DocumentsIcon /> },
    ],
  },
  {
    label: 'Pipeline',
    items: [
      { label: 'Leads',           href: '/admin/leads',   icon: <LeadsIcon /> },
      { label: 'Support Tickets', href: '/admin/tickets', icon: <TicketsIcon /> },
    ],
  },
]

const GOLD = 'var(--kfx-gold)'
const GOLD_10 = 'rgba(201,168,76,0.10)'
const GOLD_12 = 'rgba(201,168,76,0.12)'
const GOLD_40 = 'rgba(201,168,76,0.40)'
const GOLD_50 = 'rgba(201,168,76,0.50)'
const SURFACE_HOVER = 'rgba(255,255,255,0.03)'

interface AdminSidebarProps {
  adminName: string
  adminEmail: string
  onSignOut: () => void
}

export function AdminSidebar({ adminName, adminEmail, onSignOut }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className="w-56 shrink-0 flex flex-col h-screen sticky top-0 border-r"
      style={{
        background: 'linear-gradient(180deg, #0d1117 0%, #0a0e14 100%)',
        borderColor: GOLD_12,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-4 py-5 border-b"
        style={{ borderColor: GOLD_12 }}
      >
        <div
          className="w-7 h-7 rounded flex items-center justify-center shrink-0"
          style={{ background: GOLD }}
        >
          <span className="text-[#0a0c0f] text-xs font-bold">K</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--kfx-text)] leading-tight tracking-tight">
            Keystone <span style={{ color: GOLD }}>FX</span>
          </p>
          <p
            className="text-[10px] tracking-widest uppercase font-medium"
            style={{ color: GOLD_50 }}
          >
            Admin Console
          </p>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-2 py-4 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p
              className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: GOLD_40 }}
            >
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <AdminNavLink
                    key={item.href}
                    item={item}
                    isActive={isActive}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div
        className="px-2 pb-3 pt-3 border-t space-y-0.5"
        style={{ borderColor: GOLD_12 }}
      >
        <Link
          href="/admin/settings"
          className={cn(
            'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors',
            pathname === '/admin/settings'
              ? 'text-[var(--kfx-gold)]'
              : 'text-[var(--kfx-text-muted)] hover:text-[var(--kfx-text)]'
          )}
        >
          <SettingsIcon />
          <span>Settings</span>
        </Link>

        {/* Admin user card */}
        <div
          className="mt-1 p-2.5 rounded-lg border"
          style={{ background: GOLD_10, borderColor: GOLD_12 }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{ background: GOLD, color: '#0a0c0f' }}
            >
              {adminName[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[var(--kfx-text)] truncate">
                {adminName}
              </p>
              <p className="text-[10px] truncate" style={{ color: GOLD_50 }}>
                Administrator
              </p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="mt-2 text-[11px] text-[var(--kfx-text-muted)] hover:text-[var(--kfx-danger)] transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  )
}

function AdminNavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-all duration-150 relative group"
      style={{
        color: isActive ? GOLD : undefined,
        background: isActive ? GOLD_10 : undefined,
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = SURFACE_HOVER
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = ''
      }}
    >
      {isActive && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r"
          style={{ background: GOLD }}
        />
      )}
      <span
        className={cn(
          'shrink-0 transition-colors',
          !isActive && 'text-[var(--kfx-text-subtle)] group-hover:text-[var(--kfx-text-muted)]'
        )}
        style={isActive ? { color: GOLD } : undefined}
      >
        {item.icon}
      </span>
      <span
        className={cn(!isActive && 'text-[var(--kfx-text-muted)] group-hover:text-[var(--kfx-text)]')}
      >
        {item.label}
      </span>
    </Link>
  )
}