'use client'

import { useState } from 'react'
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
const WithdrawalsIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M12 20V8m0 0l-4 4m4-4l4 4M4 4h16" />
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
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
      { label: 'Clients',     href: '/admin/clients',     icon: <ClientsIcon /> },
      { label: 'KYC Review',  href: '/admin/kyc',         icon: <KYCIcon /> },
      { label: 'Documents',   href: '/admin/documents',   icon: <DocumentsIcon /> },
      { label: 'Withdrawals', href: '/admin/withdrawals', icon: <WithdrawalsIcon /> },
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

interface AdminSidebarProps {
  adminName: string
  adminEmail: string
  onSignOut: () => void
}

export function AdminSidebar({ adminName, adminEmail, onSignOut }: AdminSidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const sidebarContent = (
    <>
      <div className="px-6 py-6 border-b border-[#eef2f6] flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[#0f172a]">
            Keystone <span className="text-[#94a3b8]">FX</span>
          </p>
          <p className="text-[10px] text-[#94a3b8] tracking-widest uppercase mt-1">
            Admin Console
          </p>
        </div>
        {/* Close button — mobile only */}
        <button
          className="md:hidden p-1.5 rounded-lg text-[#64748b] hover:bg-[#f1f5f9]"
          onClick={() => setOpen(false)}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[10px] font-semibold text-[#94a3b8] uppercase tracking-widest">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                      isActive
                        ? 'bg-[#eef2f6] text-[#0f172a] font-medium'
                        : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]'
                    )}>
                    <span className={cn(isActive ? 'text-[#0f172a]' : 'text-[#94a3b8]')}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 pb-3">
        <Link
          href="/admin/settings"
          onClick={() => setOpen(false)}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
            pathname === '/admin/settings'
              ? 'bg-[#eef2f6] text-[#0f172a] font-medium'
              : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]'
          )}>
          <span className={cn(pathname === '/admin/settings' ? 'text-[#0f172a]' : 'text-[#94a3b8]')}>
            <SettingsIcon />
          </span>
          <span>Settings</span>
        </Link>
      </div>

      <div className="px-4 pb-5 border-t border-[#eef2f6] pt-4">
        <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e5e7eb]">
          <p className="text-xs text-[#0f172a] font-medium truncate">{adminName}</p>
          <p className="text-[11px] text-[#64748b] truncate mt-0.5">{adminEmail}</p>
          <button
            onClick={onSignOut}
            className="mt-3 text-[11px] text-[#64748b] hover:text-red-500 transition"
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white border border-[#e5e7eb] shadow-sm text-[#0f172a]"
        onClick={() => setOpen(true)}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay — mobile only */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'flex flex-col h-screen bg-white border-r border-[#e5e7eb] z-50 transition-transform duration-300',
        'md:relative md:w-64 md:translate-x-0 md:sticky md:top-0',
        'fixed top-0 left-0 w-72',
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        {sidebarContent}
      </aside>
    </>
  )
}