'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { AdminHeader, AdminFilterBar } from '@/components/layout/AdminHeader'
import { formatDate } from '@/lib/utils'
import type { ClientProfile, KYCStatus } from '@/types'

const KYC_FILTERS: { label: string; value: KYCStatus | 'all' }[] = [
  { label: 'All',         value: 'all' },
  { label: 'Not Started', value: 'not_started' },
  { label: 'Pending',     value: 'pending' },
  { label: 'In Review',   value: 'under_review' },
  { label: 'Approved',    value: 'approved' },
  { label: 'Rejected',    value: 'rejected' },
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

export default function AdminClientsPage() {
  const router = useRouter()

  const [clients,   setClients]   = useState<ClientProfile[]>([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [kycFilter, setKycFilter] = useState<KYCStatus | 'all'>('all')

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/clients')
      const data = await res.json()
      setClients(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const name        = (c.first_name + ' ' + c.last_name).toLowerCase()
      const matchSearch = !search || name.includes(search.toLowerCase())
      const matchKYC    = kycFilter === 'all' || c.kyc_status === kycFilter
      return matchSearch && matchKYC
    })
  }, [clients, search, kycFilter])

  return (
    <div>
      <AdminHeader title="Clients" subtitle={clients.length + ' registered clients'} />
      <AdminFilterBar searchPlaceholder="Search by name…" searchValue={search} onSearchChange={setSearch}>
        <div className="flex items-center gap-1.5 flex-wrap">
          {KYC_FILTERS.map((f) => (
            <button key={f.value} onClick={() => setKycFilter(f.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                kycFilter === f.value
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
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 bg-[#f8fafc] rounded animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-[#64748b]">No clients match your filters.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-[#f1f5f9]">
              <tr>
                {['Client', 'Account Type', 'KYC Status', 'Onboarding', 'Registered', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filtered.map((c) => (
                <tr key={c.id} className="cursor-pointer hover:bg-[#f8fafc] transition-colors"
                  onClick={() => router.push('/admin/clients/' + c.id)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#eef2f6] flex items-center justify-center text-[10px] font-bold text-[#64748b] shrink-0">
                        {(c.first_name?.[0] ?? '') + (c.last_name?.[0] ?? '')}
                      </div>
                      <div>
                        <p className="font-medium text-[#0f172a]">{c.first_name} {c.last_name}</p>
                        <p className="text-xs text-[#94a3b8] font-mono">{c.id.slice(0, 8).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-[#64748b]">{c.account_type}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${KYC_STYLES[c.kyc_status] ?? KYC_STYLES.not_started}`}>
                      {KYC_LABELS[c.kyc_status] ?? c.kyc_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className={`w-4 h-1.5 rounded-full ${i < c.onboarding_step ? 'bg-[#0f172a]' : 'bg-[#e2e8f0]'}`} />
                      ))}
                      <span className="text-xs text-[#94a3b8] ml-1">{c.onboarding_step}/4</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#64748b]">{formatDate(c.created_at)}</td>
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