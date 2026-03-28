'use client'

import { useState, useEffect, useMemo } from 'react'
import { AdminHeader, AdminFilterBar } from '@/components/layout/AdminHeader'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'
import type { WithdrawalRequestWithClient } from '@/types'

const ATTESTATION_WINDOW_MS = 5 * 60 * 1000 // 5 minutes — must match server

const STATUS_FILTERS = [
  { label: 'All',       value: 'all' },
  { label: 'Pending',   value: 'pending' },
  { label: 'Approved',  value: 'approved' },
  { label: 'Rejected',  value: 'rejected' },
  { label: 'Cancelled', value: 'cancelled' },
]

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-amber-100 text-amber-600',
  approved:  'bg-green-100 text-green-600',
  rejected:  'bg-red-100 text-red-600',
  cancelled: 'bg-gray-100 text-gray-500',
}

interface AttestationState {
  attestedBalance: number
  attestedAt: number
  expiresAt: number
}

export default function AdminWithdrawalsPage() {
  const { success, error: toastError } = useToast()

  const [requests,     setRequests]     = useState<WithdrawalRequestWithClient[]>([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('pending')
  const [processing,   setProcessing]   = useState<string | null>(null)

  const [rejectingId,  setRejectingId]  = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const [attestingId,  setAttestingId]  = useState<string | null>(null)
  const [balanceInput, setBalanceInput] = useState('')
  const [attestations, setAttestations] = useState<Record<string, AttestationState>>({})
  const [attesting,    setAttesting]    = useState(false)

  // Re-render every second to keep countdown live
  const [, setTick] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/withdrawals')
      if (!res.ok) { toastError('Load failed', 'Could not load withdrawal requests'); setLoading(false); return }
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

  function getAttestationStatus(withdrawalId: string): {
    valid: boolean
    secondsLeft: number
    balance: number | null
  } {
    const att = attestations[withdrawalId]
    if (!att) return { valid: false, secondsLeft: 0, balance: null }
    const msLeft = att.expiresAt - Date.now()
    if (msLeft <= 0) return { valid: false, secondsLeft: 0, balance: att.attestedBalance }
    return { valid: true, secondsLeft: Math.ceil(msLeft / 1000), balance: att.attestedBalance }
  }

  async function submitAttestation(withdrawalId: string) {
    const balance = Number(balanceInput)
    if (isNaN(balance) || balance < 0 || balanceInput.trim() === '') {
      toastError('Invalid balance', 'Please enter the MT5 account balance as a number.')
      return
    }

    setAttesting(true)
    try {
      const res = await fetch('/api/admin/withdrawals/attest', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ withdrawalId, attestedBalance: balance }),
      })
      const body = await res.json()

      if (!res.ok) {
        toastError('Attestation failed', body.error ?? 'Could not record attestation')
        return
      }

      setAttestations(prev => ({
        ...prev,
        [withdrawalId]: {
          attestedBalance: balance,
          attestedAt:      Date.now(),
          expiresAt:       Date.now() + ATTESTATION_WINDOW_MS,
        }
      }))

      setAttestingId(null)
      setBalanceInput('')

      // Check if balance is sufficient and show appropriate toast
      const withdrawal = requests.find(r => r.id === withdrawalId)
      const withdrawalAmount = Number(withdrawal?.amount ?? 0)
      if (balance < withdrawalAmount) {
        toastError(
          'Insufficient balance',
          `MT5 balance $${balance.toFixed(2)} is less than withdrawal amount $${withdrawalAmount.toFixed(2)}. You must reject this request.`
        )
      } else {
        success(
          'Balance attested',
          `MT5 balance of $${balance.toFixed(2)} confirmed. You have 5 minutes to approve.`
        )
      }
    } catch {
      toastError('Network error', 'Could not reach server')
    } finally {
      setAttesting(false)
    }
  }

  async function executeApprove(withdrawalId: string) {
    const att = getAttestationStatus(withdrawalId)
    if (!att.valid) {
      toastError('Attestation required', 'Please attest the MT5 balance before approving.')
      return
    }

    setProcessing(withdrawalId)
    try {
      const res = await fetch('/api/admin/withdrawals', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id: withdrawalId, status: 'approved' }),
      })
      const body = await res.json()

      if (!res.ok) {
        toastError('Approval blocked', body.error ?? 'Could not approve withdrawal')
        if (body.code === 'attestation_expired' || body.code === 'attestation_missing') {
          setAttestations(prev => {
            const next = { ...prev }
            delete next[withdrawalId]
            return next
          })
        }
        return
      }

      setRequests(prev => prev.map(r =>
        r.id === withdrawalId ? { ...r, status: 'approved' as const } : r
      ))
      setAttestations(prev => {
        const next = { ...prev }
        delete next[withdrawalId]
        return next
      })
      success('Withdrawal approved', 'Process the USDT transfer in your terminal now.')
    } catch {
      toastError('Network error', 'Request failed — please try again')
    } finally {
      setProcessing(null)
    }
  }

  async function executeReject(withdrawalId: string) {
    if (!rejectReason.trim()) return

    setProcessing(withdrawalId)
    try {
      const res = await fetch('/api/admin/withdrawals', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id: withdrawalId, status: 'rejected', rejectionReason: rejectReason }),
      })
      const body = await res.json()

      if (!res.ok) {
        toastError('Rejection failed', body.error ?? 'Could not reject withdrawal')
        return
      }

      setRequests(prev => prev.map(r =>
        r.id === withdrawalId ? { ...r, status: 'rejected' as const, rejection_reason: rejectReason } : r
      ))
      setAttestations(prev => {
        const next = { ...prev }
        delete next[withdrawalId]
        return next
      })
      setRejectingId(null)
      setRejectReason('')
      success('Withdrawal rejected', 'Client will see the rejection reason.')
    } catch {
      toastError('Network error', 'Request failed — please try again')
    } finally {
      setProcessing(null)
    }
  }

  const pendingCount = requests.filter(r => r.status === 'pending').length

  return (
    <div>
      <AdminHeader
        title="Withdrawals"
        subtitle={pendingCount > 0
          ? `${pendingCount} pending withdrawal request${pendingCount !== 1 ? 's' : ''}`
          : 'All withdrawal requests reviewed'}
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
          filtered.map((r) => {
            const att = getAttestationStatus(r.id)
            const isActing = rejectingId === r.id || attestingId === r.id
            const isInsufficientBalance = att.valid && att.balance !== null && att.balance < Number(r.amount)

            return (
              <div key={r.id} className={`rounded-xl border bg-white p-4 ${
                isInsufficientBalance ? 'border-red-300' : 'border-[#e5e7eb]'
              }`}>
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">

                    {/* Client + status */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-semibold text-[#0f172a]">
                        {r.client_profiles?.first_name} {r.client_profiles?.last_name}
                      </p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[r.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </div>

                    <p className="text-sm text-[#0f172a] font-medium">
                      ${Number(r.amount).toFixed(2)} USDT
                    </p>

                    {r.mt5_account && (
                      <p className="text-xs text-[#64748b] mt-0.5">
                        MT5: <span className="font-semibold text-[#0f172a]">{r.mt5_account}</span>
                      </p>
                    )}

                    <p className="text-xs text-[#64748b] font-mono mt-0.5 truncate">
                      → {r.wallet_address}
                    </p>

                    <p className="text-xs text-[#94a3b8] mt-0.5">{formatDate(r.created_at)}</p>

                    {r.rejection_reason && (
                      <p className="text-xs text-red-500 mt-1 font-medium">
                        Rejected: {r.rejection_reason}
                      </p>
                    )}

                    {/* Attestation freshness indicator — red if insufficient, green if sufficient */}
                    {r.status === 'pending' && att.valid && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                          isInsufficientBalance ? 'bg-red-500' : 'bg-green-500'
                        }`} />
                        <p className={`text-xs font-medium ${
                          isInsufficientBalance ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {isInsufficientBalance
                            ? `MT5 balance $${att.balance?.toFixed(2)} is insufficient for $${Number(r.amount).toFixed(2)} withdrawal — reject required`
                            : `Balance attested: $${att.balance?.toFixed(2)} — expires in ${att.secondsLeft}s`
                          }
                        </p>
                      </div>
                    )}

                    {/* Attestation input */}
                    {attestingId === r.id && (
                      <div className="mt-3 space-y-2">
                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                          <p className="text-xs font-semibold text-amber-700 mb-1">
                            MT5 Balance Attestation Required
                          </p>
                          <p className="text-xs text-amber-600">
                            Open your MT5 Manager Terminal and check the client's account balance.
                            Enter the exact balance you see below. This attestation is valid for 5 minutes.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#64748b]">$</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={balanceInput}
                              onChange={(e) => setBalanceInput(e.target.value)}
                              placeholder="0.00"
                              autoFocus
                              className="w-full h-9 pl-6 pr-3 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] outline-none focus:border-amber-400"
                            />
                          </div>
                          <button
                            onClick={() => submitAttestation(r.id)}
                            disabled={attesting || !balanceInput.trim()}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-white disabled:opacity-40">
                            {attesting ? 'Recording…' : 'Attest Balance'}
                          </button>
                          <button
                            onClick={() => { setAttestingId(null); setBalanceInput('') }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e2e8f0] text-[#64748b]">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Rejection input */}
                    {rejectingId === r.id && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-[#64748b]">
                          Rejection reason (required — client will see this):
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="e.g. Insufficient MT5 balance, address mismatch…"
                            autoFocus
                            className="flex-1 h-9 px-3 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] outline-none focus:border-[#94a3b8]"
                          />
                          <button
                            onClick={() => executeReject(r.id)}
                            disabled={!rejectReason.trim() || processing === r.id}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white disabled:opacity-40">
                            {processing === r.id ? 'Rejecting…' : 'Confirm Reject'}
                          </button>
                          <button
                            onClick={() => { setRejectingId(null); setRejectReason('') }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e2e8f0] text-[#64748b]">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  {r.status === 'pending' && !isActing && (
                    <div className="flex flex-col items-end gap-2 shrink-0">

                      {att.valid ? (
                        isInsufficientBalance ? (
                          // Balance too low — Approve is blocked, show reject prompt
                          <div className="flex flex-col items-end gap-1.5">
                            <div className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-600 border border-red-300 cursor-not-allowed">
                              ✕ Cannot Approve
                            </div>
                            <button
                              onClick={() => {
                                setRejectingId(r.id)
                                setRejectReason('Insufficient MT5 balance')
                                setAttestingId(null)
                              }}
                              disabled={processing === r.id}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50">
                              Reject (Insufficient Funds)
                            </button>
                          </div>
                        ) : (
                          // Balance sufficient — show Approve with countdown
                          <button
                            onClick={() => executeApprove(r.id)}
                            disabled={processing === r.id}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50">
                            {processing === r.id ? 'Approving…' : `Approve (${att.secondsLeft}s)`}
                          </button>
                        )
                      ) : (
                        // No attestation yet
                        <button
                          onClick={() => {
                            setAttestingId(r.id)
                            setBalanceInput('')
                            setRejectingId(null)
                          }}
                          disabled={processing === r.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-300 transition-colors disabled:opacity-50">
                          Verify MT5 Balance
                        </button>
                      )}

                      {/* Reject button — always available unless insufficient balance already showing it */}
                      {!isInsufficientBalance && (
                        <button
                          onClick={() => {
                            setRejectingId(r.id)
                            setRejectReason('')
                            setAttestingId(null)
                          }}
                          disabled={processing === r.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-500 hover:bg-red-200 transition-colors disabled:opacity-50">
                          Reject
                        </button>
                      )}

                      {!att.valid && att.balance !== null && (
                        <p className="text-[10px] text-[#94a3b8] text-right">
                          Previous attestation expired
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}