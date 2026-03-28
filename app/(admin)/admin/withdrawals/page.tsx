'use client'

import { useState, useEffect, useMemo } from 'react'
import { AdminHeader, AdminFilterBar } from '@/components/layout/AdminHeader'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'

interface WithdrawalRow {
  id: string
  amount: number
  wallet_address: string
  mt5_account: string | null
  status: string
  rejection_reason: string | null
  created_at: string
  client_profiles: { first_name: string; last_name: string } | null
}

const STATUS_FILTERS = [
  { label: 'All',      value: 'all' },
  { label: 'Pending',  value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
]

const STATUS_STYLES: Record<string, string> = {
  pending:  'bg-amber-100 text-amber-600',
  approved: 'bg-green-100 text-green-600',
  rejected: 'bg-red-100 text-red-600',
}

export default function AdminWithdrawalsPage() {
  const { success, error: toastError } = useToast()

  const [requests,     setRequests]     = useState<WithdrawalRow[]>([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('pending')
  const [rejecting,    setRejecting]    = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [processing,   setProcessing]   = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/withdrawals')
      const data = await res.json()
      setRequests(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const name = ((r.client_profiles?.first_name ?? '') + ' ' + (r.client_profiles?.last_name ?? '')).toLowerCase()
      const matchSearch = !search || name.includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || r.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [requests, search, statusFilter])

  async function updateStatus(id: string, status: string, reason?: string) {
    setProcessing(id)
    try {
      const res = await fetch('/api/admin/withdrawals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, rejectionReason: reason }),
      })
      if (!res.ok) throw new Error('Update failed')
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status, rejection_reason: reason ?? null } : r))
      setRejecting(null)
      setRejectReason('')
      success(status === 'approved' ? 'Withdrawal approved' : 'Withdrawal rejected')
    } catch {
      toastError('Failed', 'Could not update withdrawal status')
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div>
      <AdminHeader
        title="Withdrawals"
        subtitle={requests.filter(r => r.status === 'pending').length + ' pending withdrawal requests'}
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

      <div className="p-6 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-[#f8fafc] rounded animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-[#64748b]">No withdrawal requests match your filters.</p>
          </div>
        ) : (
          filtered.map((r) => (
            <div key={r.id} className="rounded-xl border border-[#e5e7eb] bg-white p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-semibold text-[#0f172a]">
                      {r.client_profiles?.first_name} {r.client_profiles?.last_name}
                    </p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[r.status]}`}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-[#0f172a] font-medium">
                    ${Number(r.amount).toFixed(2)} USDT
                  </p>
                  {r.mt5_account && (
                    <p className="text-xs text-[#64748b] mt-0.5">
                      MT5 Account: <span className="font-semibold text-[#0f172a]">{r.mt5_account}</span>
                    </p>
                  )}
                  <p className="text-xs text-[#64748b] font-mono mt-0.5 truncate">
                    → {r.wallet_address}
                  </p>
                  <p className="text-xs text-[#94a3b8] mt-0.5">{formatDate(r.created_at)}</p>
                  {r.rejection_reason && (
                    <p className="text-xs text-red-500 mt-1">Reason: {r.rejection_reason}</p>
                  )}

                  {rejecting === r.id && (
                    <div className="mt-3 flex gap-2">
                      <input type="text" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Reason for rejection…"
                        className="flex-1 h-9 px-3 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] outline-none focus:border-[#94a3b8]" />
                      <button onClick={() => updateStatus(r.id, 'rejected', rejectReason)}
                        disabled={!rejectReason.trim()}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white disabled:opacity-40">
                        Confirm
                      </button>
                      <button onClick={() => { setRejecting(null); setRejectReason('') }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e2e8f0] text-[#64748b]">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {r.status === 'pending' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateStatus(r.id, 'approved')}
                      disabled={processing === r.id}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-600 hover:bg-green-200 transition-colors disabled:opacity-50">
                      Approve
                    </button>
                    <button
                      onClick={() => setRejecting(r.id)}
                      disabled={processing === r.id}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-500 hover:bg-red-200 transition-colors disabled:opacity-50">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}