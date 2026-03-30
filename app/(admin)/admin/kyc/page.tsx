'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { AdminHeader, AdminFilterBar } from '@/components/layout/AdminHeader'
import { formatDateTime } from '@/lib/utils'
import type { KYCStatus } from '@/types'

interface KYCRow {
  id: string
  client_id: string
  status: KYCStatus
  submitted_at: string | null
  politically_exposed: boolean
  us_person: boolean
  client_profiles: { first_name: string; last_name: string; account_type: string; nationality: string | null } | null
}

const STATUS_FILTERS: { label: string; value: KYCStatus | 'all' }[] = [
  { label: 'All',       value: 'all' },
  { label: 'Pending',   value: 'pending' },
  { label: 'In Review', value: 'under_review' },
  { label: 'Approved',  value: 'approved' },
  { label: 'Rejected',  value: 'rejected' },
]

const KYC_STYLES: Record<string, string> = {
  not_started:  'bg-gray-100 text-gray-500',
  pending:      'bg-amber-100 text-amber-600',
  under_review: 'bg-blue-100 text-blue-600',
  approved:     'bg-green-100 text-green-600',
  rejected:     'bg-red-100 text-red-600',
}
const KYC_LABELS: Record<string, string> = {
  not_started: 'Not Started', pending: 'Pending',
  under_review: 'In Review', approved: 'Approved', rejected: 'Rejected',
}

export default function AdminKYCPage() {
  const router = useRouter()

  const [submissions,  setSubmissions]  = useState<KYCRow[]>([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState<KYCStatus | 'all'>('pending')

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/kyc')
      const data = await res.json()
      setSubmissions(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      const name        = ((s.client_profiles?.first_name ?? '') + ' ' + (s.client_profiles?.last_name ?? '')).toLowerCase()
      const matchSearch = !search || name.includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || s.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [submissions, search, statusFilter])

  return (
    <div>
      <AdminHeader
        title="KYC Review"
        subtitle={submissions.filter(s => s.status === 'pending').length + ' pending submissions'}
      />
      <AdminFilterBar searchPlaceholder="Search by client name…" searchValue={search} onSearchChange={setSearch}>
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
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-[#f8fafc] rounded animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-[#64748b]">No KYC submissions match your filters.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-[#f1f5f9]">
              <tr>
                {['Client', 'Nationality', 'Account Type', 'PEP', 'US Person', 'Submitted', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filtered.map((s) => (
                <tr key={s.id} className="cursor-pointer hover:bg-[#f8fafc] transition-colors"
                  onClick={() => router.push('/admin/kyc/' + s.id)}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#0f172a]">{s.client_profiles?.first_name} {s.client_profiles?.last_name}</p>
                    <p className="text-xs text-[#94a3b8] font-mono">{s.client_id.slice(0, 8).toUpperCase()}</p>
                  </td>
                  <td className="px-4 py-3 text-[#64748b]">{s.client_profiles?.nationality ?? '—'}</td>
                  <td className="px-4 py-3 text-[#64748b] capitalize">{s.client_profiles?.account_type ?? '—'}</td>
                  <td className="px-4 py-3">
                    {s.politically_exposed
                      ? <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">YES</span>
                      : <span className="text-xs text-[#94a3b8]">No</span>}
                  </td>
                  <td className="px-4 py-3">
                    {s.us_person
                      ? <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600">YES</span>
                      : <span className="text-xs text-[#94a3b8]">No</span>}
                  </td>
                  <td className="px-4 py-3 text-[#64748b]">{s.submitted_at ? formatDateTime(s.submitted_at) : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${KYC_STYLES[s.status]}`}>
                      {KYC_LABELS[s.status]}
                    </span>
                  </td>
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