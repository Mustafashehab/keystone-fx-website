'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { AdminHeader, AdminFilterBar } from '@/components/layout/AdminHeader'
import { formatDateTime } from '@/lib/utils'
import type { TicketStatus, TicketPriority } from '@/types'

interface TicketRow {
  id: string
  subject: string
  status: TicketStatus
  priority: TicketPriority
  category: string | null
  created_at: string
  client_profiles: { first_name: string; last_name: string } | null
}

const STATUS_FILTERS: { label: string; value: TicketStatus | 'all' }[] = [
  { label: 'All',         value: 'all' },
  { label: 'Open',        value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved',    value: 'resolved' },
  { label: 'Closed',      value: 'closed' },
]

const TICKET_STYLES: Record<string, string> = {
  open:        'bg-amber-100 text-amber-600',
  in_progress: 'bg-blue-100 text-blue-600',
  resolved:    'bg-green-100 text-green-600',
  closed:      'bg-gray-100 text-gray-500',
}

const PRIORITY_STYLES: Record<string, string> = {
  low:    'bg-gray-100 text-gray-500',
  medium: 'bg-amber-100 text-amber-600',
  high:   'bg-orange-100 text-orange-500',
  urgent: 'bg-red-100 text-red-600',
}

export default function AdminTicketsPage() {
  const router = useRouter()

  const [tickets,      setTickets]      = useState<TicketRow[]>([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('open')

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/tickets')
      const data = await res.json()
      setTickets(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const name        = ((t.client_profiles?.first_name ?? '') + ' ' + (t.client_profiles?.last_name ?? '')).toLowerCase()
      const matchSearch = !search || name.includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || t.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [tickets, search, statusFilter])

  const openCount = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length

  return (
    <div>
      <AdminHeader
        title="Support Tickets"
        subtitle={openCount > 0 ? openCount + ' ticket(s) requiring attention' : 'All tickets resolved'}
      />
      <AdminFilterBar searchPlaceholder="Search by subject or client…" searchValue={search} onSearchChange={setSearch}>
        <div className="flex items-center gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <button key={f.value} onClick={() => setStatusFilter(f.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                statusFilter === f.value
                  ? 'bg-[#eef2f6] border-[#e2e8f0] text-[#0f172a] font-semibold'
                  : 'bg-white border-[#e2e8f0] text-[#64748b] hover:bg-[#f1f5f9]'
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </AdminFilterBar>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-[#f8fafc] rounded animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-[#64748b]">No tickets match your filters.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-[#f1f5f9]">
              <tr>
                {['Subject', 'Client', 'Category', 'Priority', 'Status', 'Opened', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filtered.map((t) => (
                <tr key={t.id} className="cursor-pointer hover:bg-[#f8fafc] transition-colors"
                  onClick={() => router.push('/admin/tickets/' + t.id)}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#0f172a] max-w-xs truncate">{t.subject}</p>
                    <p className="text-xs text-[#94a3b8] font-mono">{'#' + t.id.slice(0, 8).toUpperCase()}</p>
                  </td>
                  <td className="px-4 py-3 text-[#64748b]">
                    {t.client_profiles ? t.client_profiles.first_name + ' ' + t.client_profiles.last_name : '—'}
                  </td>
                  <td className="px-4 py-3 text-[#64748b] capitalize">{t.category?.replace(/_/g, ' ') ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_STYLES[t.priority]}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TICKET_STYLES[t.status]}`}>
                      {t.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#64748b]">{formatDateTime(t.created_at)}</td>
                  <td className="px-4 py-3 text-[#94a3b8]">→</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}