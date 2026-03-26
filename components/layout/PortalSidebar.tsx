'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: number
}

const DashboardIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const KYCIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const DocumentIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const AccountIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
)

const SupportIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
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

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',           href: '/portal/dashboard',            icon: <DashboardIcon /> },
  { label: 'KYC Verification',    href: '/portal/kyc',                  icon: <KYCIcon /> },
  { label: 'Documents',           href: '/portal/documents',            icon: <DocumentIcon /> },
  { label: 'Account Application', href: '/portal/account-application',  icon: <AccountIcon /> },
  { label: 'Support',             href: '/portal/support',              icon: <SupportIcon /> },
]

const BOTTOM_ITEMS: NavItem[] = [
  { label: 'Settings', href: '/portal/settings', icon: <SettingsIcon /> },
]

interface PortalSidebarProps {
  userName: string
  userEmail: string
  onSignOut: () => void
}

export function PortalSidebar({ userName, userEmail, onSignOut }: PortalSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 flex flex-col h-screen sticky top-0 bg-[var(--kfx-surface)] border-r border-[var(--kfx-border)]">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-[var(--kfx-border)]">
        <div className="w-7 h-7 rounded bg-[var(--kfx-accent)] flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">K</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--kfx-text)] leading-tight tracking-tight">
            Keystone <span className="text-[var(--kfx-accent)]">FX</span>
          </p>
          <p className="text-[10px] text-[var(--kfx-text-subtle)] tracking-widest uppercase">
            Client Portal
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-2 pb-2 text-[10px] font-semibold text-[var(--kfx-text-subtle)] uppercase tracking-widest">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={pathname === item.href || pathname.startsWith(item.href + '/')}
          />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-3 space-y-0.5 border-t border-[var(--kfx-border)] pt-3">
        {BOTTOM_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={pathname === item.href}
          />
        ))}

        {/* User card */}
        <div className="mt-2 p-2.5 rounded-lg bg-[var(--kfx-surface-raised)] border border-[var(--kfx-border)]">
          <p className="text-xs font-medium text-[var(--kfx-text)] truncate">{userName}</p>
          <p className="text-[11px] text-[var(--kfx-text-subtle)] truncate mt-0.5">{userEmail}</p>
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

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-all duration-150 group relative',
        active
          ? 'bg-[var(--kfx-accent-muted)] text-[var(--kfx-accent)]'
          : 'text-[var(--kfx-text-muted)] hover:text-[var(--kfx-text)] hover:bg-[var(--kfx-surface-raised)]'
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r bg-[var(--kfx-accent)]" />
      )}
      <span
        className={cn(
          'shrink-0',
          active
            ? 'text-[var(--kfx-accent)]'
            : 'text-[var(--kfx-text-subtle)] group-hover:text-[var(--kfx-text-muted)]'
        )}
      >
        {item.icon}
      </span>
      <span className="truncate">{item.label}</span>
      {item.badge != null && item.badge > 0 && (
        <span className="ml-auto bg-[var(--kfx-accent)] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
    </Link>
  )
}