'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDateTime } from '@/lib/utils'
import Link from 'next/link'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  link: string | null
  created_at: string
}

interface NotificationBellProps {
  recipient: 'client' | 'admin'
  clientId?: string
}

export function NotificationBell({ recipient, clientId }: NotificationBellProps) {
  const supabase = createClient()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen]     = useState(false)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  async function loadNotifications() {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('recipient', recipient)
      .order('created_at', { ascending: false })
      .limit(20)

    if (recipient === 'client' && clientId) {
      query = query.eq('client_id', clientId)
    }

    const { data } = await query
    setNotifications((data ?? []) as Notification[])
    setLoading(false)
  }

  useEffect(() => {
    loadNotifications()
    // Poll every 30 seconds for new notifications
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [clientId])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function markAllRead() {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id)
    if (unreadIds.length === 0) return

    await supabase
      .from('notifications')
      .update({ read: true })
      .in('id', unreadIds)

    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  async function markRead(id: string) {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)

    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const iconForType: Record<string, string> = {
    ticket_reply:          '💬',
    withdrawal_approved:   '✅',
    withdrawal_rejected:   '❌',
    kyc_approved:          '✅',
    kyc_rejected:          '❌',
    kyc_submitted:         '📋',
    deposit_detected:      '💰',
    new_ticket:            '🎫',
    new_withdrawal:        '💸',
    new_client:            '👤',
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => { setOpen(v => !v); if (!open) loadNotifications() }}
        className="relative p-2 rounded-xl text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9] transition-all"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white border border-[#e5e7eb] shadow-xl z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f5f9]">
            <h3 className="text-sm font-semibold text-[#0f172a]">
              Notifications {unreadCount > 0 && (
                <span className="ml-1.5 text-xs font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
                  {unreadCount} new
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-[#64748b] hover:text-[#0f172a] transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-2">
                {[1,2,3].map(i => (
                  <div key={i} className="h-12 bg-[#f8fafc] rounded animate-pulse" />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-[#64748b]">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => {
                const content = (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-[#f8fafc] cursor-pointer transition-colors hover:bg-[#f8fafc] ${
                      !n.read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <span className="text-base shrink-0 mt-0.5">
                      {iconForType[n.type] ?? '🔔'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-[#0f172a] truncate">{n.title}</p>
                        {!n.read && (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[#64748b] mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-[#94a3b8] mt-1">{formatDateTime(n.created_at)}</p>
                    </div>
                  </div>
                )

                return n.link ? (
                  <Link key={n.id} href={n.link}>{content}</Link>
                ) : (
                  <div key={n.id}>{content}</div>
                )
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-[#f1f5f9] text-center">
              <p className="text-xs text-[#94a3b8]">Showing last 20 notifications</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}