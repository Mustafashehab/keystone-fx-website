'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

/* ================= ICONS ================= */

const DashboardIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeWidth={1.75} d="M3 12l2-2 7-7 7 7 2 2M5 10v10h3m8-10v10h-3M9 21v-6h6v6" />
  </svg>
)

const KYCIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const DocumentIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeWidth={1.75} d="M9 12h6m-6 4h6M7 3h6l5 5v13H7z" />
  </svg>
)

const AccountIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12h14V7a2 2 0 00-2-2h-2M9 5h6" />
  </svg>
)

const SupportIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="9" strokeWidth={1.75} />
    <path strokeWidth={1.75} d="M9 10h.01M15 10h.01M9 15h6" />
  </svg>
)

const SettingsIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="3" strokeWidth={1.75} />
    <path strokeWidth={1.75} d="M19.4 15a1.65 1.65 0 000-6l2-1.2-2-3.5-2.3 1a6 6 0 00-4-1.2l-.5-2.5h-4l-.5 2.5a6 6 0 00-4 1.2l-2.3-1-2 3.5 2 1.2a1.65 1.65 0 000 6l-2 1.2 2 3.5 2.3-1a6 6 0 004 1.2l.5 2.5h4l.5-2.5a6 6 0 004-1.2l2.3 1 2-3.5-2-1.2z" />
  </svg>
)

/* ================= NAV ================= */

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/portal/dashboard', icon: <DashboardIcon /> },
  { label: 'KYC Verification', href: '/portal/kyc', icon: <KYCIcon /> },
  { label: 'Documents', href: '/portal/documents', icon: <DocumentIcon /> },
  { label: 'Account Application', href: '/portal/account-application', icon: <AccountIcon /> },
  { label: 'Support', href: '/portal/support', icon: <SupportIcon /> },
]

const BOTTOM_ITEMS: NavItem[] = [
  { label: 'Settings', href: '/portal/settings', icon: <SettingsIcon /> },
]

/* ================= SIDEBAR ================= */

export function PortalSidebar({ userName, userEmail, onSignOut }: any) {
  const pathname = usePathname()

  return (
    <aside className="w-64 flex flex-col h-screen sticky top-0 bg-white border-r border-[#e5e7eb]">

      {/* LOGO */}
      <div className="px-6 py-6 border-b border-[#eef2f6]">
        <p className="text-sm font-semibold text-[#0f172a]">
          Keystone <span className="text-[#94a3b8]">FX</span>
        </p>
        <p className="text-[10px] text-[#94a3b8] tracking-widest uppercase mt-1">
          Client Portal
        </p>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={pathname === item.href}
          />
        ))}
      </nav>

      {/* BOTTOM */}
      <div className="px-3 space-y-1 pb-3">
        {BOTTOM_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={pathname === item.href}
          />
        ))}
      </div>

      {/* USER */}
      <div className="px-4 pb-5 border-t border-[#eef2f6] pt-4">
        <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e5e7eb]">
          <p className="text-xs text-[#0f172a] font-medium truncate">{userName}</p>
          <p className="text-[11px] text-[#64748b] truncate">{userEmail}</p>

          <button
            onClick={onSignOut}
            className="mt-3 text-[11px] text-[#64748b] hover:text-red-500 transition"
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  )
}

/* ================= NAV LINK ================= */

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
        active
          ? 'bg-[#eef2f6] text-[#0f172a] font-medium'
          : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]'
      )}
    >
      <span className={cn(active ? 'text-[#0f172a]' : 'text-[#94a3b8]')}>
        {item.icon}
      </span>
      <span>{item.label}</span>
    </Link>
  )
}